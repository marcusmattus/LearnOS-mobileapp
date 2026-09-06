import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenView } from '../components/ScreenView';
import { FadeInUp } from '../components/anim';
import { BackButton, Bar } from '../components/ui';
import { useAppState } from '../state/AppState';
import { angle, C, F, lh } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TIMELINE = [
  { date: '70,000 BC', text: 'Foraging bands, shared myths', color: C.purple, label: C.purpleLight },
  { date: '12,000 BC', text: 'Wheat domesticated · food surplus', color: C.blue, label: C.blueLight },
  { date: '9,000 BC', text: 'Permanent settlements, stored grain', color: C.teal, label: C.tealLight },
  { date: '5,000 BC', text: 'Elites who control the surplus', color: C.green, label: C.green },
];

const CHAIN = ['Farming', 'Surplus', 'Settlement', 'Hierarchy'];

const KEY_TERMS = ['Domestication', 'Surplus', 'Sedentism', 'Stratification'];

/** The concept itself, taught in whichever way currently fits the learner. */
export function LessonScreen() {
  const nav = useNavigation<Nav>();
  const { approach, analysis, activeConceptIndex } = useAppState();

  const live = !!analysis && analysis.concepts.length > 0 && activeConceptIndex < analysis.concepts.length;
  const concept = live ? analysis!.concepts[activeConceptIndex] : null;
  const total = live ? analysis!.concepts.length : 18;
  const current = live ? activeConceptIndex + 1 : 4;
  const pct = current / total;

  return (
    <ScreenView contentStyle={styles.content}>
      <FadeInUp>
        <View style={styles.header}>
          <BackButton onPress={() => nav.navigate('Map')} />
          <View style={styles.flex}>
            <Text style={styles.progressLabel}>
              Concept {current} / {total}
            </Text>
            <Bar progress={pct} height={4} colors={[C.purple, C.blue]} style={styles.progressBar} />
          </View>
          <Text style={styles.progressPct}>{Math.round(pct * 100)}%</Text>
        </View>

        <Text style={styles.approach}>
          {live ? 'WRITTEN EXPLANATION' : approach === 'visual' ? 'VISUAL TIMELINE' : 'WRITTEN EXPLANATION'}
        </Text>
        <Text style={styles.title}>{concept?.name ?? 'Agricultural Revolution'}</Text>

        {live ? (
          <LiveExplanation explanation={concept!.explanation} keyTerms={concept!.keyTerms} />
        ) : approach === 'visual' ? (
          <VisualExplanation />
        ) : (
          <WrittenExplanation />
        )}

        <View style={styles.actionRow}>
          <Pressable
            style={[styles.action, styles.actionUnderstand]}
            onPress={() => nav.navigate('Practice')}
          >
            <Text style={[styles.actionText, { color: C.greenLight }]}>I Understand</Text>
          </Pressable>
          <Pressable
            style={[styles.action, styles.actionConfused]}
            onPress={() => nav.navigate('Another')}
          >
            <Text style={[styles.actionText, { color: C.amberLight }]}>I'm Confused</Text>
          </Pressable>
        </View>

        <View style={[styles.actionRow, styles.actionRowTight]}>
          <Pressable style={[styles.action, styles.actionMuted]} onPress={() => nav.navigate('Another')}>
            <Text style={styles.actionMutedText}>Teach Me Another Way</Text>
          </Pressable>
          <Pressable
            style={[styles.action, styles.actionMuted, styles.actionShrink]}
            onPress={() => nav.navigate('Practice')}
          >
            <Text style={styles.actionMutedText}>Practice</Text>
          </Pressable>
        </View>
      </FadeInUp>
    </ScreenView>
  );
}

function VisualExplanation() {
  return (
    <>
      <View style={styles.timelineCard}>
        <Text style={styles.cardLabel}>TIMELINE</Text>
        <View style={styles.timeline}>
          <LinearGradient colors={[C.purple, C.teal]} {...angle(180)} style={styles.timelineRail} />
          {TIMELINE.map((t, i) => (
            <View key={t.date} style={i < TIMELINE.length - 1 ? styles.timelineItem : undefined}>
              <View style={[styles.timelineDot, { borderColor: t.color }]} />
              <Text style={[styles.timelineDate, { color: t.label }]}>{t.date}</Text>
              <Text style={styles.timelineText}>{t.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.chainCard}>
        <Text style={styles.cardLabel}>THE CHAIN</Text>
        <View style={styles.chainRow}>
          {CHAIN.map((step, i) => (
            <React.Fragment key={step}>
              {i > 0 && <Text style={styles.chainArrow}>→</Text>}
              <View style={[styles.chainStep, i === CHAIN.length - 1 && styles.chainStepFinal]}>
                <Text
                  style={[styles.chainStepText, i === CHAIN.length - 1 && styles.chainStepTextFinal]}
                >
                  {step}
                </Text>
              </View>
            </React.Fragment>
          ))}
        </View>
        <Text style={styles.chainBody}>
          Stored grain can be counted, taxed and taken. Once food could be accumulated, some people
          could live off what others grew — and that is where lasting hierarchy begins.
        </Text>
      </View>
    </>
  );
}

function LiveExplanation({ explanation, keyTerms }: { explanation: string; keyTerms: string[] }) {
  return (
    <>
      <View style={styles.proseCard}>
        <Text style={styles.prose}>{explanation}</Text>
      </View>
      {keyTerms.length > 0 && (
        <View style={styles.termsCard}>
          <Text style={styles.cardLabelTight}>KEY TERMS</Text>
          <View style={styles.terms}>
            {keyTerms.map(t => (
              <View key={t} style={styles.term}>
                <Text style={styles.termText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </>
  );
}

function WrittenExplanation() {
  return (
    <>
      <View style={styles.proseCard}>
        <Text style={styles.prose}>
          The Agricultural Revolution began roughly 12,000 years ago, when humans in several regions
          independently shifted from foraging to cultivating a small number of plant and animal
          species. The consequence was not simply more food but storable food. Surplus grain could
          be accumulated, measured and claimed, which allowed populations to grow, settlements to
          become permanent, and a minority to live on production they did not perform themselves.
        </Text>
      </View>
      <View style={styles.termsCard}>
        <Text style={styles.cardLabelTight}>KEY TERMS</Text>
        <View style={styles.terms}>
          {KEY_TERMS.map(t => (
            <View key={t} style={styles.term}>
              <Text style={styles.termText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingTop: 4 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 },
  progressLabel: { fontFamily: F.regular, fontSize: 11, color: C.muted },
  progressBar: { marginTop: 5 },
  progressPct: { fontFamily: F.semibold, fontSize: 12, color: C.purpleLight },

  approach: {
    fontFamily: F.semibold,
    fontSize: 9.5,
    letterSpacing: 1.6,
    color: C.tealLight,
    marginTop: 16,
  },
  title: {
    fontFamily: F.semibold,
    fontSize: 26,
    letterSpacing: -0.6,
    color: C.text,
    marginTop: 6,
  },

  timelineCard: {
    marginTop: 18,
    backgroundColor: C.surfaceDeep,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  cardLabel: {
    fontFamily: F.semibold,
    fontSize: 11,
    letterSpacing: 1.4,
    color: C.muted,
    marginBottom: 18,
  },
  cardLabelTight: { fontFamily: F.semibold, fontSize: 10.5, letterSpacing: 1.4, color: C.muted },
  timeline: { paddingLeft: 22 },
  timelineRail: { position: 'absolute', left: 5, top: 6, bottom: 6, width: 2 },
  timelineItem: { marginBottom: 20 },
  timelineDot: {
    position: 'absolute',
    left: -22,
    top: 4,
    width: 12,
    height: 12,
    borderRadius: 999,
    borderWidth: 2.5,
    backgroundColor: C.bg,
  },
  timelineDate: { fontFamily: F.mono, fontSize: 11 },
  timelineText: { fontFamily: F.medium, fontSize: 13.5, color: C.text, marginTop: 2 },

  chainCard: {
    marginTop: 14,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    padding: 16,
  },
  chainRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chainStep: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: C.surfaceAlt,
  },
  chainStepFinal: {
    backgroundColor: C.purpleA18,
    borderWidth: 1,
    borderColor: C.purpleA40,
  },
  chainStepText: { fontFamily: F.medium, fontSize: 10.5, color: C.text },
  chainStepTextFinal: { fontFamily: F.semibold, color: C.purpleSoft },
  chainArrow: { fontSize: 12, color: C.purple },
  chainBody: {
    fontFamily: F.regular,
    fontSize: 12.5,
    lineHeight: lh(12.5, 1.65),
    color: C.body,
    marginTop: 14,
  },

  proseCard: {
    marginTop: 18,
    backgroundColor: C.surfaceDeep,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    padding: 18,
  },
  prose: { fontFamily: F.regular, fontSize: 14, lineHeight: lh(14, 1.75), color: C.body },
  termsCard: {
    marginTop: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 15,
  },
  terms: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 10 },
  term: { paddingVertical: 6, paddingHorizontal: 11, borderRadius: 9, backgroundColor: C.surfaceAlt },
  termText: { fontFamily: F.regular, fontSize: 11.5, color: C.text },

  actionRow: { flexDirection: 'row', gap: 9, marginTop: 18 },
  actionRowTight: { marginTop: 9 },
  action: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    borderRadius: 15,
    paddingVertical: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionUnderstand: { backgroundColor: C.greenA14, borderColor: C.greenA35 },
  actionConfused: { backgroundColor: C.amberA12, borderColor: C.amberA30 },
  actionMuted: { backgroundColor: C.surface, borderColor: C.border2, paddingVertical: 13 },
  // Practice hugs its label; "Teach Me Another Way" absorbs the rest of the row.
  actionShrink: { flexGrow: 0, flexShrink: 0, flexBasis: 'auto', paddingHorizontal: 20 },
  actionText: { fontFamily: F.semibold, fontSize: 14 },
  actionMutedText: { fontFamily: F.medium, fontSize: 13.5, color: C.text },
});
