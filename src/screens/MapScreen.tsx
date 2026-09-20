import React, { useCallback, useMemo, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav } from '../components/BottomNav';
import { ConceptSheet } from '../components/ConceptSheet';
import { FadeInUp, useDashOffset } from '../components/anim';
import {
  CurrentNode,
  DestinationNode,
  LockedNode,
  MapBadge,
  MasteredNode,
  NodeAt,
  RootNode,
  ScoredNode,
  SupportNode,
} from '../components/MapNodes';
import { PrimaryButton, RadialGlow } from '../components/ui';
import { SearchIcon } from '../components/icons';
import { useAppState } from '../state/AppState';
import { BOOK, CONCEPT_DETAILS, type ConceptDetail } from '../data/content';
import { ROOT_Y, computeMapLayout, roadPath, type MapLayout } from '../utils/mapLayout';
import type { AnalysisConcept } from '../api/scanApi';
import { C, F } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * The map is authored on a fixed 353 × 900 canvas, centred horizontally.
 *
 * Node labels are fixed-size text, so stretching the canvas to the device width
 * would push the outer columns out from under their pills (and distort the
 * curved roads). Wider devices simply get more margin.
 *
 * Two deliberate departures from the prototype's coordinates: the outer node
 * columns sit at 82 / 270 rather than 70 / 282. At the design's own spacing the
 * widest node ("Permanent Settlements") overflows the canvas far enough to be
 * clipped by a 393pt screen edge — pulling the columns in by 12 keeps every
 * label whole, on narrow devices too, and is imperceptible otherwise.
 */
const CANVAS_W = 353;
const CANVAS_H = 900;

export function MapScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { adapted, sheetOpen, openSheet, closeSheet, analysis, activeConceptIndex } = useAppState();

  const dash = useDashOffset(1400, 24);

  const [focused, setFocused] = useState<string | null>(null);

  const live = !!analysis && analysis.concepts.length > 0;
  const layout = useMemo(
    () => (live ? computeMapLayout(analysis!.concepts) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [live, analysis],
  );
  const pathDone = live && activeConceptIndex >= analysis!.concepts.length;
  const currentLiveConcept = live
    ? analysis!.concepts[Math.min(activeConceptIndex, analysis!.concepts.length - 1)]
    : null;

  const liveDetail: ConceptDetail | null = useMemo(() => {
    if (!live || !analysis) return null;
    const idx = analysis.concepts.findIndex(c => c.name === focused);
    const i = idx >= 0 ? idx : Math.min(activeConceptIndex, analysis.concepts.length - 1);
    const c = analysis.concepts[i];
    if (!c) return null;
    const mastered = i < activeConceptIndex;
    return {
      name: c.name,
      importance: c.tag,
      importanceTone: c.tag === 'CORE' ? 'high' : 'normal',
      minutes: `${c.minutes} min`,
      mastery: mastered ? 1 : 0,
      prerequisites: c.prerequisites,
      understand: c.summary,
      needsWork: mastered ? 'Nothing outstanding — revisit any time.' : 'Not started yet.',
      recommendation: c.explanation,
    };
  }, [live, analysis, focused, activeConceptIndex]);

  const detail =
    liveDetail ??
    CONCEPT_DETAILS[focused ?? (adapted ? 'Societies' : 'Agricultural Revolution')] ??
    CONCEPT_DETAILS['Agricultural Revolution'];

  const show = (name: string) => {
    setFocused(name);
    openSheet();
  };

  // Leaving the map dismisses the sheet, so coming back starts clean.
  useFocusEffect(useCallback(() => () => closeSheet(), [closeSheet]));

  return (
    <View style={styles.root}>
      <View style={[styles.flex, { paddingTop: insets.top + 4 }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.flex}>
            <Text style={styles.title}>Your Learning Map</Text>
            <Text style={styles.subtitle}>
              {live
                ? `${analysis!.book.title} · ${analysis!.concepts.length} concepts · ${activeConceptIndex} mastered`
                : `${BOOK.title} · ${BOOK.concepts} concepts · ${adapted ? 7 : 6} mastered`}
            </Text>
          </View>
          <View style={styles.headerBtn}>
            <SearchIcon size={15} color={C.muted} />
          </View>
          <View style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>⤢</Text>
          </View>
        </View>

        {/* Map + pinned overlays */}
        <View style={styles.flex}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
          >
            <FadeInUp duration={400}>
              <View style={[styles.canvas, live && { height: layout!.canvasHeight }]}>
                <RadialGlow
                  color={C.purple}
                  opacity={adapted ? 0.14 : 0.12}
                  style={[
                    styles.canvasGlow,
                    { top: (live ? layout!.canvasHeight : CANVAS_H) * (adapted ? 0.4 : 0.46) - 130 },
                  ]}
                />

                <Svg
                  width={CANVAS_W}
                  height={live ? layout!.canvasHeight : CANVAS_H}
                  style={StyleSheet.absoluteFill}
                >
                  {live ? (
                    <LiveRoads layout={layout!} />
                  ) : adapted ? (
                    <AdaptedRoads dash={dash} />
                  ) : (
                    <InitialRoads dash={dash} />
                  )}
                </Svg>

                {live ? (
                  <LiveNodes
                    concepts={analysis!.concepts}
                    layout={layout!}
                    activeIndex={activeConceptIndex}
                    bookTitle={analysis!.book.title}
                    onOpen={show}
                  />
                ) : adapted ? (
                  <AdaptedNodes onOpen={show} />
                ) : (
                  <InitialNodes onOpen={show} />
                )}
              </View>
            </FadeInUp>
          </ScrollView>

          {/* Next up — floats over the map */}
          {!pathDone && (
            <View style={styles.nextUp}>
              <View style={styles.nextUpHead}>
                <Text style={styles.nextUpEyebrow}>NEXT UP</Text>
                <View style={styles.nextUpRule} />
                <Text style={styles.nextUpTime}>
                  {live ? `${currentLiveConcept!.minutes} min` : '18 min'}
                </Text>
              </View>
              <View style={styles.nextUpBody}>
                <View style={styles.flex}>
                  <Text style={styles.nextUpTitle}>
                    {live
                      ? currentLiveConcept!.name
                      : adapted
                        ? 'Food Surplus'
                        : 'Agricultural Revolution'}
                  </Text>
                  <View style={styles.approachRow}>
                    <View style={[styles.approach, { backgroundColor: C.purpleA14 }]}>
                      <Text style={[styles.approachText, { color: C.purpleSoft }]}>
                        {live ? currentLiveConcept!.tag : 'Visual'}
                      </Text>
                    </View>
                    <Text style={styles.arrow}>→</Text>
                    <View style={[styles.approach, { backgroundColor: C.blueA14 }]}>
                      <Text style={[styles.approachText, { color: C.blueLight }]}>
                        {live ? 'Explain' : 'Example'}
                      </Text>
                    </View>
                    <Text style={styles.arrow}>→</Text>
                    <View style={[styles.approach, { backgroundColor: C.tealA14 }]}>
                      <Text style={[styles.approachText, { color: C.tealLight }]}>Practice</Text>
                    </View>
                  </View>
                </View>
                <PrimaryButton
                  label="Start"
                  onPress={() => nav.navigate('Lesson')}
                  contentStyle={styles.startBtn}
                  textStyle={styles.startBtnText}
                  glow={false}
                />
              </View>
            </View>
          )}

          {pathDone && (
            <View style={styles.nextUp}>
              <Text style={styles.nextUpTitle}>Path complete — every concept mastered.</Text>
            </View>
          )}

          {sheetOpen && (
            <ConceptSheet
              detail={detail}
              onClose={closeSheet}
              onStart={() => {
                closeSheet();
                nav.navigate('Lesson');
              }}
            />
          )}
        </View>
      </View>

      <BottomNav />
    </View>
  );
}

/* ── Live roads / nodes ───────────────────────────────────────────────── */

function LiveRoads({ layout }: { layout: MapLayout }) {
  const root = { x: CANVAS_W / 2, y: ROOT_Y };
  return (
    <>
      {layout.rootTargets.map((t, i) => (
        <Path key={`root-${i}`} d={roadPath(root, t)} stroke={C.green} strokeWidth={2} fill="none" opacity={0.5} />
      ))}
      {layout.edges.map((e, i) => (
        <Path
          key={i}
          d={roadPath(e.from, e.to)}
          stroke={C.muted}
          strokeWidth={1.6}
          fill="none"
          strokeDasharray="4 5"
          opacity={0.5}
        />
      ))}
      {layout.destSources.map((s, i) => (
        <Path
          key={`dest-${i}`}
          d={roadPath(s, layout.destPos)}
          stroke={C.teal}
          strokeWidth={1.6}
          fill="none"
          strokeDasharray="4 5"
          opacity={0.4}
        />
      ))}
    </>
  );
}

function LiveNodes({
  concepts,
  layout,
  activeIndex,
  bookTitle,
  onOpen,
}: {
  concepts: AnalysisConcept[];
  layout: MapLayout;
  activeIndex: number;
  bookTitle: string;
  onOpen: (name: string) => void;
}) {
  return (
    <>
      <NodeAt x={CANVAS_W / 2} y={ROOT_Y}>
        <RootNode label={bookTitle} />
      </NodeAt>
      {concepts.map((c, i) => {
        const pos = layout.positions[i];
        return (
          <NodeAt key={c.name} x={pos.x} y={pos.y}>
            {i < activeIndex && <MasteredNode label={c.name} onPress={() => onOpen(c.name)} />}
            {i === activeIndex && <CurrentNode label={c.name} glyph="◎" onPress={() => onOpen(c.name)} />}
            {i > activeIndex && <LockedNode label={c.name} />}
          </NodeAt>
        );
      })}
      <NodeAt x={layout.destPos.x} y={layout.destPos.y}>
        <DestinationNode label={activeIndex >= concepts.length ? 'PATH COMPLETE' : 'END OF PATH'} />
      </NodeAt>
    </>
  );
}

/* ── Roads ────────────────────────────────────────────────────────────── */

/** Prerequisite edges before live adaptation rewrites the route. */
function InitialRoads({ dash }: { dash: Animated.AnimatedInterpolation<number> }) {
  return (
    <>
      <Path d="M176 44 V104" stroke={C.green} strokeWidth={2} opacity={0.5} />
      <Path d="M176 148 C176 180 82 178 82 208" stroke={C.green} strokeWidth={2} fill="none" opacity={0.5} />
      <Path d="M176 148 C176 180 270 178 270 208" stroke={C.green} strokeWidth={2} fill="none" opacity={0.5} />
      <Path d="M82 244 C82 278 176 274 176 302" stroke={C.green} strokeWidth={2} fill="none" opacity={0.5} />
      <Path d="M270 244 C270 278 176 274 176 302" stroke={C.green} strokeWidth={2} fill="none" opacity={0.5} />
      <AnimatedPath
        d="M176 340 V424"
        stroke={C.purple}
        strokeWidth={2.5}
        strokeDasharray="6 6"
        strokeDashoffset={dash}
      />
      <Path d="M176 468 C176 504 82 500 82 530" stroke={C.purple} strokeWidth={2} fill="none" opacity={0.55} />
      <Path d="M176 468 C176 504 270 500 270 530" stroke={C.purple} strokeWidth={2} fill="none" opacity={0.55} />
      <Path d="M82 566 C82 604 176 600 176 630" stroke={C.muted} strokeWidth={1.6} fill="none" strokeDasharray="4 5" opacity={0.5} />
      <Path d="M270 566 C270 604 176 600 176 630" stroke={C.muted} strokeWidth={1.6} fill="none" strokeDasharray="4 5" opacity={0.5} />
      <Path d="M176 666 V726" stroke={C.muted} strokeWidth={1.6} strokeDasharray="4 5" opacity={0.5} />
      <Path d="M176 762 V824" stroke={C.muted} strokeWidth={1.6} strokeDasharray="4 5" opacity={0.5} />
    </>
  );
}

/** The rerouted map: a teal support path replaces the direct jump. */
function AdaptedRoads({ dash }: { dash: Animated.AnimatedInterpolation<number> }) {
  const support = {
    stroke: C.teal,
    strokeWidth: 2.5,
    fill: 'none' as const,
    strokeDasharray: '6 6',
    strokeDashoffset: dash,
  };
  return (
    <>
      <Path d="M176 44 V104" stroke={C.green} strokeWidth={2} opacity={0.5} />
      <Path d="M176 148 C176 176 176 176 176 202" stroke={C.green} strokeWidth={2} opacity={0.5} />
      <Path d="M176 240 V296" stroke={C.green} strokeWidth={2} opacity={0.5} />
      <AnimatedPath d="M176 334 C176 366 270 362 270 392" {...support} />
      <AnimatedPath d="M270 428 V486" {...support} />
      <AnimatedPath d="M270 522 V580" {...support} />
      <AnimatedPath d="M270 616 C270 652 176 648 176 678" {...support} />
      <Path d="M176 334 C176 400 82 420 82 500" stroke={C.muted} strokeWidth={1.4} fill="none" strokeDasharray="3 6" opacity={0.35} />
      <Path d="M176 714 V790" stroke={C.muted} strokeWidth={1.6} strokeDasharray="4 5" opacity={0.5} />
    </>
  );
}

/* ── Nodes ────────────────────────────────────────────────────────────── */

type NodeProps = { onOpen: (name: string) => void };

function InitialNodes({ onOpen }: NodeProps) {
  return (
    <>
      <NodeAt x={176} y={26}>
        <RootNode label={BOOK.title} />
      </NodeAt>
      <NodeAt x={176} y={126}>
        <MasteredNode label="Cognitive Revolution" onPress={() => onOpen('Cognitive Revolution')} />
      </NodeAt>
      <NodeAt x={82} y={226}>
        <MasteredNode label="Language" size="sm" />
      </NodeAt>
      <NodeAt x={270} y={226}>
        <MasteredNode label="Cooperation" size="sm" />
      </NodeAt>
      <NodeAt x={176} y={320}>
        <ScoredNode label="Shared Myths" score="82" />
      </NodeAt>
      <NodeAt x={176} y={378}>
        <MapBadge label="YOU ARE HERE" tone="purple" />
      </NodeAt>
      <NodeAt x={176} y={446}>
        <CurrentNode
          label="Agricultural Revolution"
          progress={0.58}
          onPress={() => onOpen('Agricultural Revolution')}
        />
      </NodeAt>
      <NodeAt x={82} y={548}>
        <ScoredNode label="Money" score="42" tone="amber" />
      </NodeAt>
      <NodeAt x={270} y={548}>
        <LockedNode label="Societies" />
      </NodeAt>
      <NodeAt x={176} y={648}>
        <LockedNode label="Religion" />
      </NodeAt>
      <NodeAt x={176} y={744}>
        <LockedNode label="Science" />
      </NodeAt>
      <NodeAt x={176} y={848}>
        <DestinationNode label="MODERN WORLD" />
      </NodeAt>
    </>
  );
}

function AdaptedNodes({ onOpen }: NodeProps) {
  return (
    <>
      <NodeAt x={176} y={26}>
        <RootNode label={BOOK.title} />
      </NodeAt>
      <NodeAt x={176} y={126}>
        <MasteredNode label="Shared Myths" />
      </NodeAt>
      <NodeAt x={176} y={220}>
        <MasteredNode label="Agricultural Revolution" size="lg" />
      </NodeAt>
      <NodeAt x={176} y={314}>
        <MapBadge label="NEW SUPPORT PATH" tone="teal" />
      </NodeAt>
      <NodeAt x={270} y={410}>
        <FadeInUp duration={500}>
          <SupportNode label="Food Surplus" />
        </FadeInUp>
      </NodeAt>
      <NodeAt x={270} y={504}>
        <FadeInUp duration={500} delay={120}>
          <SupportNode label="Permanent Settlements" />
        </FadeInUp>
      </NodeAt>
      <NodeAt x={270} y={598}>
        <FadeInUp duration={500} delay={240}>
          <SupportNode label="Social Hierarchy" />
        </FadeInUp>
      </NodeAt>
      <NodeAt x={82} y={508}>
        <ScoredNode label="Money" score="42" tone="amber" faded />
      </NodeAt>
      <NodeAt x={176} y={696}>
        <CurrentNode label="Societies" glyph="◎" onPress={() => onOpen('Societies')} />
      </NodeAt>
      <NodeAt x={176} y={810}>
        <LockedNode label="Religion" />
      </NodeAt>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  flex: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
  },
  title: { fontFamily: F.semibold, fontSize: 17, color: C.text },
  subtitle: { fontFamily: F.regular, fontSize: 11.5, color: C.muted },
  headerBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnText: { fontSize: 12, color: C.muted },

  scroll: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 190 },
  canvas: { width: CANVAS_W, height: CANVAS_H },
  canvasGlow: { position: 'absolute', left: 0, right: 0, height: 260 },

  nextUp: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    backgroundColor: 'rgba(20,20,32,0.95)',
    borderWidth: 1,
    borderColor: C.purpleA28,
    borderRadius: 22,
    padding: 16,
    boxShadow: '0 20px 50px -20px rgba(0,0,0,0.9)',
  },
  nextUpHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  nextUpEyebrow: { fontFamily: F.semibold, fontSize: 9.5, letterSpacing: 1.6, color: C.purpleLight },
  nextUpRule: { height: 1, flex: 1, backgroundColor: C.border },
  nextUpTime: { fontFamily: F.regular, fontSize: 11, color: C.muted },
  nextUpBody: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nextUpTitle: { fontFamily: F.semibold, fontSize: 16.5, letterSpacing: -0.2, color: C.text },
  approachRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  approach: { paddingVertical: 3, paddingHorizontal: 7, borderRadius: 6 },
  approachText: { fontFamily: F.regular, fontSize: 10.5 },
  arrow: { fontSize: 10.5, color: C.muted },
  startBtn: { borderRadius: 14, paddingVertical: 13, paddingHorizontal: 22 },
  startBtnText: { fontSize: 14.5 },
});
