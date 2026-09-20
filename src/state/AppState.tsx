/**
 * Session state for the learning flow.
 *
 * The prototype kept one state object on the root component; the same data is
 * shared here so screens can be navigated to independently and still agree on
 * whether the path has been adapted, which answer was picked, and so on.
 */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ScanAnalysis } from '../api/scanApi';

export type Approach = 'written' | 'visual';
export type Plan = 'annual' | 'monthly';

/** Free-tier scans before the paywall gate kicks in — matches the prototype's plan table. */
export const FREE_SCAN_LIMIT = 5;

/** A page captured by the camera or picked from the library this session. */
export type Shot = {
  /** Local file URI — for on-device display (Image source). */
  uri: string;
  /** Base64-encoded JPEG data (no data-URI prefix) — for sending to the scan API. */
  base64: string;
};

export type AnalysisStatus = 'idle' | 'loading' | 'error' | 'done';

type AppState = {
  /** Pages captured in the current scan session. */
  pages: number;
  /** Real photos captured this session, newest first. */
  shots: Shot[];
  /** The real analysis result from the scan backend, once one has completed. */
  analysis: ScanAnalysis | null;
  analysisStatus: AnalysisStatus;
  analysisError: string | null;
  /** Whether the live-adaptation step has rewritten the learning path. */
  adapted: boolean;
  /** The learner's answer on the practice question, or null before answering. */
  pick: string | null;
  /** Whether the teach-back recording has been submitted and scored. */
  tbDone: boolean;
  /** Which explanation style the lesson screen is currently showing. */
  approach: Approach;
  /** Whether the concept detail sheet is open on the map. */
  sheetOpen: boolean;
  /** Selected plan on the paywall. */
  plan: Plan;
  /** Free scans consumed so far — reaching FREE_SCAN_LIMIT routes Scan to the Limit gate. */
  scansUsed: number;
  /** Index into `analysis.concepts` of the concept currently being studied. */
  activeConceptIndex: number;
};

type AppActions = {
  /** Registers a captured page. Pass a real photo to also add it to `shots`. */
  capturePage: (shot?: Shot) => void;
  removeShot: (uri: string) => void;
  /** Marks a scan analysis request in flight — clears any previous result/error. */
  startAnalysis: () => void;
  analysisSucceeded: (result: ScanAnalysis) => void;
  analysisFailed: (message: string) => void;
  /** Discards a real analysis result, e.g. to fall back to demo content after a failure. */
  clearAnalysis: () => void;
  setAdapted: (v: boolean) => void;
  setPick: (v: string | null) => void;
  setTbDone: (v: boolean) => void;
  setApproach: (v: Approach) => void;
  setPlan: (v: Plan) => void;
  /** Consumes one free scan — called when a scan flow is handed off for analysis. */
  useFreeScan: () => void;
  openSheet: () => void;
  closeSheet: () => void;
  /** Clears per-run answers so a fresh pass through the flow starts clean. */
  resetRun: () => void;
  /** Marks the current live concept mastered, moves on to the next, and resets per-concept answers. */
  advanceConcept: () => void;
};

const INITIAL: AppState = {
  pages: 12,
  shots: [],
  analysis: null,
  analysisStatus: 'idle',
  analysisError: null,
  adapted: false,
  pick: null,
  tbDone: false,
  approach: 'written',
  sheetOpen: false,
  plan: 'annual',
  scansUsed: 0,
  activeConceptIndex: 0,
};

const Ctx = createContext<(AppState & AppActions) | null>(null);

export function AppStateProvider({
  children,
  initial,
}: {
  children: React.ReactNode;
  /** Starting overrides — used to render a screen mid-flow (and by tests). */
  initial?: Partial<AppState>;
}) {
  const [state, setState] = useState<AppState>({ ...INITIAL, ...initial });

  const patch = useCallback(
    (p: Partial<AppState>) => setState(prev => ({ ...prev, ...p })),
    [],
  );

  // Actions keep a stable identity across renders — screens depend on them in
  // effects (closing the sheet on blur, for one), so they must not churn.
  const actions = useMemo<AppActions>(
    () => ({
      capturePage: shot =>
        setState(prev => ({
          ...prev,
          pages: prev.pages + 1,
          shots: shot ? [shot, ...prev.shots] : prev.shots,
        })),
      removeShot: uri =>
        setState(prev => ({
          ...prev,
          shots: prev.shots.filter(s => s.uri !== uri),
          pages: Math.max(0, prev.pages - 1),
        })),
      startAnalysis: () => patch({ analysisStatus: 'loading', analysisError: null }),
      analysisSucceeded: result => patch({ analysisStatus: 'done', analysis: result, analysisError: null }),
      analysisFailed: message => patch({ analysisStatus: 'error', analysisError: message }),
      clearAnalysis: () => patch({ analysisStatus: 'idle', analysis: null, analysisError: null }),
      setAdapted: v => patch({ adapted: v }),
      setPick: v => patch({ pick: v }),
      setTbDone: v => patch({ tbDone: v }),
      setApproach: v => patch({ approach: v }),
      setPlan: v => patch({ plan: v }),
      useFreeScan: () => setState(prev => ({ ...prev, scansUsed: prev.scansUsed + 1 })),
      openSheet: () => patch({ sheetOpen: true }),
      closeSheet: () => patch({ sheetOpen: false }),
      resetRun: () => patch({ pick: null, tbDone: false, approach: 'written', sheetOpen: false }),
      advanceConcept: () =>
        setState(prev => ({
          ...prev,
          // Clamped to `concepts.length`, one past the last valid index — that
          // value means "every concept in this path has been mastered."
          activeConceptIndex: Math.min(prev.activeConceptIndex + 1, prev.analysis?.concepts.length ?? 0),
          pick: null,
          tbDone: false,
          approach: 'written',
          sheetOpen: false,
        })),
    }),
    [patch],
  );

  const value = useMemo<AppState & AppActions>(
    () => ({ ...state, ...actions }),
    [state, actions],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be used inside <AppStateProvider>');
  return ctx;
}
