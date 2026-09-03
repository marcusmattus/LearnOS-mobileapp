import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { ScreenView } from '../components/ScreenView';
import { FadeInUp, Float } from '../components/anim';
import { Bar, StepRow } from '../components/ui';
import { useRamp } from '../hooks/useRamp';
import { BUILD_STEPS, stepStates } from '../data/content';
import { C, F, G, lh } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DOTS = [C.purple, C.blue, C.teal];

export function BuildingScreen() {
  const nav = useNavigation<Nav>();
  const pct = useRamp(() => nav.replace('Map'));
  const steps = stepStates(BUILD_STEPS, pct);

  return (
    <ScreenView scroll={false}>
      <FadeInUp style={styles.flex}>
        <Text style={styles.title}>Building your learning path</Text>

        {/* Gradient numerals — SVG stands in for CSS background-clip: text */}
        <View style={styles.pctWrap}>
          <Svg width="100%" height={72}>
            <Defs>
              <SvgLinearGradient id="build-pct" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={G.headline[0]} />
                <Stop offset="1" stopColor={G.headline[1]} />
              </SvgLinearGradient>
            </Defs>
            <SvgText
              x="50%"
              y={58}
              textAnchor="middle"
              fontSize={64}
              fontFamily={F.semibold}
              fill="url(#build-pct)"
            >
              {`${pct}%`}
            </SvgText>
          </Svg>
        </View>

        <Bar progress={pct / 100} height={4} colors={G.progress} style={styles.bar} />
        <Text style={styles.caption}>
          Finding the shortest route from what you know to what you want to understand.
        </Text>

        <View style={styles.steps}>
          {steps.map(s => (
            <StepRow key={s.label} label={s.label} state={s.state} />
          ))}
        </View>

        <View style={styles.dots}>
          {DOTS.map((color, i) => (
            <Float key={color} duration={1600} delay={i * 200} distance={6}>
              <View style={[styles.dot, { backgroundColor: color }]} />
            </Float>
          ))}
        </View>
      </FadeInUp>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: {
    fontFamily: F.semibold,
    fontSize: 22,
    letterSpacing: -0.4,
    color: C.text,
    textAlign: 'center',
  },
  pctWrap: { marginTop: 26, marginBottom: 8 },
  bar: { marginTop: 14, marginBottom: 8 },
  caption: {
    fontFamily: F.regular,
    fontSize: 12.5,
    color: C.muted,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: lh(12.5, 1.5),
  },
  steps: { gap: 12 },
  dots: {
    marginTop: 'auto',
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 22,
  },
  dot: { width: 7, height: 7, borderRadius: 999 },
});
