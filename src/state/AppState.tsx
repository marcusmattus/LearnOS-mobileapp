/**
 * Session state for the learning flow.
 *
 * The prototype kept one state object on the root component; the same data is
 * shared here so screens can be navigated to independently and still agree on
 * whether the path has been adapted, which answer was picked, and so on.
 */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type Approach = 'written' | 'visual';
export type Plan = 'annual' | 'monthly';

/** Free-tier scans before the paywall gate kicks in — matches the prototype's plan table. */
export const FREE_SCAN_LIMIT = 5;

type AppState = {
  /** Pages captured in the current scan session. */
  pages: number;
  /** Real photo URIs captured by the camera or picked from the library this session, newest first. */
  shots: string[];
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
};

type AppActions = {
  /** Registers a captured page. Pass a real photo URI to also add it to `shots`. */
  capturePage: (uri?: string) => void;
  removeShot: (uri: string) => void;
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
};

const INITIAL: AppState = {
  pages: 12,
  shots: [],
  adapted: false,
  pick: null,
  tbDone: false,
  approach: 'written',
  sheetOpen: false,
  plan: 'annual',
  scansUsed: 0,
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
      capturePage: uri =>
        setState(prev => ({
          ...prev,
          pages: prev.pages + 1,
          shots: uri ? [uri, ...prev.shots] : prev.shots,
        })),
      removeShot: uri =>
        setState(prev => ({
          ...prev,
          shots: prev.shots.filter(s => s !== uri),
          pages: Math.max(0, prev.pages - 1),
        })),
      setAdapted: v => patch({ adapted: v }),
      setPick: v => patch({ pick: v }),
      setTbDone: v => patch({ tbDone: v }),
      setApproach: v => patch({ approach: v }),
      setPlan: v => patch({ plan: v }),
      useFreeScan: () => setState(prev => ({ ...prev, scansUsed: prev.scansUsed + 1 })),
      openSheet: () => patch({ sheetOpen: true }),
      closeSheet: () => patch({ sheetOpen: false }),
      resetRun: () => patch({ pick: null, tbDone: false, approach: 'written', sheetOpen: false }),
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
