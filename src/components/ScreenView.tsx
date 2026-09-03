/**
 * Standard screen shell: dark ground, safe-area top padding, an optional
 * scrolling body and the tab bar where the design shows one.
 */
import React from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme';
import { BottomNav } from './BottomNav';

export function ScreenView({
  children,
  nav = false,
  scroll = true,
  contentStyle,
  style,
}: {
  children: React.ReactNode;
  /** Show the tab bar (the six screens the design gives one to). */
  nav?: boolean;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  const body = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, contentStyle]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.flex, contentStyle]}>{children}</View>
  );

  return (
    <View style={[styles.root, style]}>
      <View style={[styles.flex, { paddingTop: insets.top + 4 }]}>{body}</View>
      {nav && <BottomNav />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  flex: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
});
