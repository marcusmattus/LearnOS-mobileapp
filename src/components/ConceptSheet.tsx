/**
 * The concept detail sheet that slides up from the learning map.
 * Anchored to the bottom of the content area so it sits above the tab bar,
 * exactly as the prototype layers it.
 */
import React from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton, Ring, SecondaryButton } from './ui';
import type { ConceptDetail } from '../data/content';
import { C, F, lh } from '../theme';

export function ConceptSheet({
  detail,
  onClose,
  onStart,
}: {
  detail: ConceptDetail;
  onClose: () => void;
  onStart: () => void;
}) {
  const enter = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const anim = Animated.timing(enter, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [enter]);

  const importanceStyle =
    detail.importanceTone === 'high'
      ? { backgroundColor: C.redA12, color: C.redLight }
      : { backgroundColor: C.greenA12, color: C.green };

  return (
    <>
      <Pressable
        style={styles.scrim}
        onPress={onClose}
        accessibilityLabel="Close concept details"
      />
      <Animated.View
        style={[
          styles.sheet,
          {
            opacity: enter,
            transform: [
              { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
            ],
          },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetBody}>
          <View style={styles.grabber} />

          <View style={styles.head}>
            <View style={styles.flex}>
              <Text style={styles.title}>{detail.name}</Text>
              <View style={styles.badges}>
                <View style={[styles.badge, { backgroundColor: importanceStyle.backgroundColor }]}>
                  <Text style={[styles.badgeText, { color: importanceStyle.color }]}>
                    {detail.importance}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: C.surfaceAlt }]}>
                  <Text style={[styles.badgeText, styles.badgeMuted]}>{detail.minutes}</Text>
                </View>
              </View>
            </View>
            <Ring size={56} stroke={5} progress={detail.mastery}>
              <Text style={styles.ringText}>{Math.round(detail.mastery * 100)}%</Text>
            </Ring>
          </View>

          <Text style={styles.label}>PREREQUISITES</Text>
          <View style={styles.prereqs}>
            {detail.prerequisites.map(p => (
              <View key={p} style={styles.prereq}>
                <Text style={styles.prereqTick}>✓</Text>
                <Text style={styles.prereqText}>{p}</Text>
              </View>
            ))}
          </View>

          <View style={styles.splitRow}>
            <View style={[styles.splitCard, { borderColor: C.greenA22 }]}>
              <Text style={[styles.splitLabel, { color: C.green }]}>YOU UNDERSTAND</Text>
              <Text style={styles.splitText}>{detail.understand}</Text>
            </View>
            <View style={[styles.splitCard, { borderColor: C.amberA22 }]}>
              <Text style={[styles.splitLabel, { color: C.amber }]}>NEEDS WORK</Text>
              <Text style={styles.splitText}>{detail.needsWork}</Text>
            </View>
          </View>

          <View style={styles.recommendation}>
            <Text style={[styles.splitLabel, { color: C.purpleLight }]}>
              LEARNOS RECOMMENDATION
            </Text>
            <Text style={styles.recommendationText}>{detail.recommendation}</Text>
          </View>

          <PrimaryButton label="Start Concept" onPress={onStart} style={styles.cta} glow={false} />
          <SecondaryButton label="View Connections" onPress={onClose} style={styles.ctaAlt} />
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5,5,10,0.6)',
    zIndex: 5,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 6,
    maxHeight: 620,
    backgroundColor: C.surfaceSheet,
    borderWidth: 1,
    borderColor: C.border2,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },
  sheetBody: { paddingTop: 14, paddingHorizontal: 20, paddingBottom: 22 },
  grabber: {
    width: 44,
    height: 4,
    borderRadius: 999,
    backgroundColor: C.borderDashed,
    alignSelf: 'center',
    marginBottom: 16,
  },

  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  title: { fontFamily: F.semibold, fontSize: 21, letterSpacing: -0.4, color: C.text },
  badges: { flexDirection: 'row', gap: 8, marginTop: 8 },
  badge: { paddingVertical: 4, paddingHorizontal: 9, borderRadius: 7 },
  badgeText: { fontFamily: F.semibold, fontSize: 11 },
  badgeMuted: { fontFamily: F.regular, color: C.muted },
  ringText: { fontFamily: F.semibold, fontSize: 12.5, color: C.text },

  label: { marginTop: 18, fontFamily: F.semibold, fontSize: 10.5, letterSpacing: 1.5, color: C.muted },
  prereqs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 9 },
  prereq: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 10,
    backgroundColor: C.surfaceGreen,
    borderWidth: 1,
    borderColor: C.greenA30,
  },
  prereqTick: { fontSize: 11.5, color: C.green },
  prereqText: { fontFamily: F.regular, fontSize: 11.5, color: C.text },

  splitRow: { flexDirection: 'row', gap: 10, marginTop: 18 },
  splitCard: {
    flex: 1,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderRadius: 16,
    padding: 13,
  },
  splitLabel: { fontFamily: F.semibold, fontSize: 10.5, letterSpacing: 1.2 },
  splitText: {
    fontFamily: F.regular,
    fontSize: 12.5,
    color: C.body,
    marginTop: 8,
    lineHeight: lh(12.5, 1.5),
  },

  recommendation: {
    marginTop: 16,
    backgroundColor: C.purpleA08,
    borderWidth: 1,
    borderColor: C.purpleA24,
    borderRadius: 16,
    padding: 14,
  },
  recommendationText: {
    fontFamily: F.regular,
    fontSize: 13,
    lineHeight: lh(13, 1.6),
    color: C.purpleTint,
    marginTop: 7,
  },

  cta: { marginTop: 18 },
  ctaAlt: { marginTop: 9 },
});
