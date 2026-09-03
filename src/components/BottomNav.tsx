/**
 * The six-slot tab bar, with the scan action raised out of the bar.
 * Shown only on the screens listed in `NAV_SCREENS`.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { angle, C, F } from '../theme';
import type { RootStackParamList, ScreenName } from '../navigation/types';
import { BarsIcon, BookIcon, HomeIcon, MapIcon, PersonIcon, ScanIcon } from './icons';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TABS: { route: ScreenName; label: string; Icon: typeof HomeIcon }[] = [
  { route: 'Home', label: 'Home', Icon: HomeIcon },
  { route: 'Map', label: 'Map', Icon: MapIcon },
  { route: 'Library', label: 'Learn', Icon: BookIcon },
  { route: 'Progress', label: 'Progress', Icon: BarsIcon },
  { route: 'Profile', label: 'Profile', Icon: PersonIcon },
];

export function BottomNav() {
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const current = route.name as ScreenName;

  // The scan action sits third, breaking the row into two halves.
  const [left, right] = [TABS.slice(0, 2), TABS.slice(2)];

  const tab = ({ route: r, label, Icon }: (typeof TABS)[number]) => {
    const active = current === r;
    const color = active ? C.purpleLight : C.muted;
    return (
      <Pressable
        key={r}
        onPress={() => navigation.navigate(r)}
        style={styles.item}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        accessibilityLabel={label}
      >
        <Icon size={21} color={color} />
        <Text style={[styles.label, { color }]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) + 10 }]}>
      {left.map(tab)}

      <Pressable
        onPress={() => navigation.navigate('Scan')}
        style={styles.scanItem}
        accessibilityRole="button"
        accessibilityLabel="Scan"
      >
        <LinearGradient colors={[C.purpleBright, '#5C4CFF']} {...angle(140)} style={styles.scanBtn}>
          <ScanIcon size={23} color="#fff" />
        </LinearGradient>
        <Text style={styles.scanLabel}>Scan</Text>
      </Pressable>

      {right.map(tab)}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 9,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(11,11,18,0.94)',
    borderTopWidth: 1,
    borderTopColor: C.borderSoft,
  },
  item: { flex: 1, alignItems: 'center', gap: 4 },
  label: { fontFamily: F.medium, fontSize: 9.5 },
  scanItem: { flex: 1, alignItems: 'center', gap: 4, marginTop: -16 },
  scanBtn: {
    width: 52,
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 26px -8px rgba(124,92,255,0.9), 0 0 0 5px rgba(124,92,255,0.1)',
  },
  scanLabel: { fontFamily: F.semibold, fontSize: 9.5, color: C.purpleLight },
});
