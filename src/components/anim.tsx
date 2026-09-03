/**
 * Ports of the prototype's CSS keyframes (`lo-in`, `lo-pulse`, `lo-spin`,
 * `lo-float`, `lo-glow`, `lo-scanline`, `lo-dash`) to RN's Animated API.
 *
 * Everything here uses the native driver except the SVG dash offset, which
 * drives a non-layout SVG prop and has to run on the JS thread.
 */
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleProp, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C } from '../theme';

/** A 0 → 1 value that loops forever. */
export function useLoop(duration: number, delay = 0) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(v, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [duration, delay, v]);
  return v;
}

/** Same, but on the JS driver — for props the native driver can't touch. */
export function useJsLoop(duration: number, delay = 0) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(v, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [duration, delay, v]);
  return v;
}

/**
 * `@keyframes lo-in` — the entry transition on nearly every screen root.
 * from { opacity: 0; transform: translateY(10px) }
 */
export function FadeInUp({
  children,
  delay = 0,
  duration = 350,
  distance = 10,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.timing(v, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [v, delay, duration]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: v,
          transform: [
            { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/**
 * `@keyframes lo-pulse` — 0/100% { scale 1, opacity .55 }, 50% { scale 1.14, opacity .15 }.
 */
export function Pulse({
  children,
  duration = 3400,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const v = useLoop(duration, delay);
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: v.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.55, 0.15, 0.55] }),
          transform: [
            { scale: v.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.14, 1] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/** `@keyframes lo-spin` — a continuous rotation. */
export function Spin({
  children,
  duration = 14000,
  style,
}: {
  children: React.ReactNode;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const v = useLoop(duration);
  return (
    <Animated.View
      style={[
        style,
        {
          transform: [
            { rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/** `@keyframes lo-float` — a gentle 6px bob. */
export function Float({
  children,
  duration = 2600,
  delay = 0,
  distance = 6,
  style,
}: {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const v = useLoop(duration, delay);
  return (
    <Animated.View
      style={[
        style,
        {
          transform: [
            {
              translateY: v.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, -distance, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

/**
 * `@keyframes lo-glow` — a soft glow that breathes.
 *
 * The CSS pairs a blurred `0 0 26px 2px` halo with a spreading ring. RN can't
 * animate `boxShadow`, so this is a sibling view carrying a *static* blurred
 * shadow whose opacity (and a little scale) is what animates — which keeps the
 * glow soft-edged rather than reading as a hard disc.
 */
export function GlowRing({
  duration = 2800,
  delay = 0,
  color = 'rgba(124,92,255,0.55)',
  radius = 999,
  scaleTo = 1.06,
  blur = 30,
  spread = 4,
  minOpacity = 0.45,
  maxOpacity = 1,
  inset = 0,
}: {
  duration?: number;
  delay?: number;
  color?: string;
  radius?: number;
  scaleTo?: number;
  /** Shadow blur radius, matching the CSS glow. */
  blur?: number;
  spread?: number;
  minOpacity?: number;
  maxOpacity?: number;
  inset?: number;
}) {
  const v = useLoop(duration, delay);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: inset,
        left: inset,
        right: inset,
        bottom: inset,
        borderRadius: radius,
        boxShadow: `0 0 ${blur}px ${spread}px ${color}`,
        opacity: v.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [minOpacity, maxOpacity, minOpacity],
        }),
        transform: [
          { scale: v.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, scaleTo, 1] }) },
        ],
      }}
    />
  );
}

/** The small pulsing status dots (`lo-glow` on a 7–8px circle). */
export function GlowDot({
  size = 8,
  color = C.purple,
  duration = 1600,
}: {
  size?: number;
  color?: string;
  duration?: number;
}) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <GlowRing duration={duration} color={color} radius={999} blur={9} spread={2} scaleTo={1.2} />
      <View style={{ width: size, height: size, borderRadius: 999, backgroundColor: color }} />
    </View>
  );
}

/**
 * `@keyframes lo-scanline` — a bar sweeping from 6% to 94% of its container,
 * fading in at 12% and out after 88%.
 */
export function ScanLine({ height, duration = 3200 }: { height: number; duration?: number }) {
  const v = useLoop(duration);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 2,
        opacity: v.interpolate({
          inputRange: [0, 0.12, 0.88, 1],
          outputRange: [0, 1, 1, 0],
        }),
        transform: [
          {
            translateY: v.interpolate({
              inputRange: [0, 1],
              outputRange: [height * 0.06, height * 0.94],
            }),
          },
        ],
      }}
    >
      <LinearGradient
        colors={['transparent', C.purple, 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{ flex: 1 }}
      />
    </Animated.View>
  );
}

/**
 * `@keyframes lo-dash` — marching ants along an SVG path.
 * Returns an Animated value to feed to `strokeDashoffset` (JS driver only).
 */
export function useDashOffset(duration = 1400, span = 24) {
  const v = useJsLoop(duration);
  return useMemo(
    () => v.interpolate({ inputRange: [0, 1], outputRange: [0, -span] }),
    [v, span],
  );
}
