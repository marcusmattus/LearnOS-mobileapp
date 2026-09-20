import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenView } from '../components/ScreenView';
import { FadeInUp } from '../components/anim';
import { PrimaryButton } from '../components/ui';
import { useAppState } from '../state/AppState';
import { PLAN_ROWS } from '../data/content';
import { C, F } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const LINKS = ['Restore purchase', 'Terms', 'Privacy'];

/** The subscription upsell — reachable from Welcome, the Limit gate, or Home. */
export function PaywallScreen() {
  const nav = useNavigation<Nav>();
  const { plan, setPlan } = useAppState();
  const annual = plan === 'annual';

  const close = () => (nav.canGoBack() ? nav.goBack() : nav.replace('Home'));
  // No real IAP wired up — subscribing just lands the learner in the unlimited-feeling app.
  const subscribe = () => nav.replace('Home');

  return (
    <ScreenView contentStyle={styles.content}>
      <FadeInUp>
        <View style={styles.topRow}>
          <Text style={styles.eyebrow}>LEARNOS PRO</Text>
          <Pressable onPress={close} hitSlop={10}>
            <Text style={styles.close}>×</Text>
          </Pressable>
        </View>

        <Text style={styles.headline}>Unlimited scans.{'\n'}Unlimited paths.</Text>
        <Text style={styles.body}>
          Free gives you 5 scans to try it. Pro removes the limit and keeps every map adapting as
          you learn.
        </Text>

        <View style={styles.plans}>
          <Pressable
            onPress={() => setPlan('annual')}
            style={[styles.planCard, annual ? styles.planActive : styles.planIdle]}
          >
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeText}>SAVE 33%</Text>
            </View>
            <View style={styles.planRow}>
              <View style={[styles.dot, { borderColor: annual ? C.purple : C.border2 }]}>
                {annual && <View style={styles.dotFill} />}
              </View>
              <View style={styles.flex}>
                <Text style={styles.planName}>Annual</Text>
                <Text style={styles.planMeta}>$240 billed once a year</Text>
              </View>
              <View style={styles.priceWrap}>
                <Text style={styles.price}>$20</Text>
                <Text style={styles.priceUnit}>per month</Text>
              </View>
            </View>
          </Pressable>

          <Pressable
            onPress={() => setPlan('monthly')}
            style={[styles.planCard, !annual ? styles.planActive : styles.planIdle]}
          >
            <View style={styles.planRow}>
              <View style={[styles.dot, { borderColor: !annual ? C.purple : C.border2 }]}>
                {!annual && <View style={styles.dotFill} />}
              </View>
              <View style={styles.flex}>
                <Text style={styles.planName}>Monthly</Text>
                <Text style={styles.planMeta}>Cancel any time</Text>
              </View>
              <View style={styles.priceWrap}>
                <Text style={styles.price}>$30</Text>
                <Text style={styles.priceUnit}>per month</Text>
              </View>
            </View>
          </Pressable>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHead}>
            <Text style={[styles.tableHeadText, styles.flex]}>What you get</Text>
            <Text style={[styles.tableHeadText, styles.col]}>Free</Text>
            <Text style={[styles.tableHeadText, styles.col, { color: C.purpleLight }]}>Pro</Text>
          </View>
          {PLAN_ROWS.map(r => (
            <View key={r.label} style={styles.tableRow}>
              <Text style={[styles.tableLabel, styles.flex]}>{r.label}</Text>
              <Text style={[styles.tableFree, styles.col, r.free === '—' && { color: C.faint }]}>
                {r.free}
              </Text>
              <Text style={[styles.tablePro, styles.col]}>{r.pro}</Text>
            </View>
          ))}
        </View>

        <PrimaryButton
          label={annual ? 'Subscribe — $240 / year' : 'Subscribe — $30 / month'}
          onPress={subscribe}
          style={styles.cta}
        />
        <Text style={styles.ctaSub}>
          {annual
            ? 'Billed annually. Cancel any time before renewal.'
            : 'Billed monthly. Switch to annual any time and save 33%.'}
        </Text>

        <View style={styles.links}>
          {LINKS.map(l => (
            <Text key={l} style={styles.link}>
              {l}
            </Text>
          ))}
        </View>
      </FadeInUp>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8, paddingBottom: 28 },
  flex: { flex: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { fontFamily: F.semibold, fontSize: 11, letterSpacing: 1.8, color: C.muted },
  close: { fontFamily: F.regular, fontSize: 22, lineHeight: 22, color: C.muted },

  headline: {
    fontFamily: F.semibold,
    fontSize: 27,
    letterSpacing: -0.7,
    lineHeight: 32,
    color: C.text,
    marginTop: 14,
  },
  body: { fontFamily: F.regular, fontSize: 14, lineHeight: 22, color: C.muted, marginTop: 9 },

  plans: { gap: 11, marginTop: 22 },
  planCard: { position: 'relative', borderRadius: 20, padding: 17, borderWidth: 1.5 },
  planActive: { backgroundColor: C.purpleA12, borderColor: C.purpleA55 },
  planIdle: { backgroundColor: C.surface, borderColor: C.border2 },
  saveBadge: {
    position: 'absolute',
    top: -9,
    right: 16,
    backgroundColor: C.teal,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 999,
  },
  saveBadgeText: {
    fontFamily: F.bold,
    fontSize: 10,
    letterSpacing: 0.8,
    color: '#08201D',
  },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotFill: { width: 10, height: 10, borderRadius: 999, backgroundColor: C.purple },
  planName: { fontFamily: F.semibold, fontSize: 15.5, color: C.text },
  planMeta: { fontFamily: F.regular, fontSize: 12, color: C.muted, marginTop: 2 },
  priceWrap: { alignItems: 'flex-end' },
  price: { fontFamily: F.semibold, fontSize: 20, letterSpacing: -0.4, color: C.text },
  priceUnit: { fontFamily: F.regular, fontSize: 10.5, color: C.muted },

  table: {
    marginTop: 22,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    overflow: 'hidden',
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tableHeadText: {
    fontFamily: F.semibold,
    fontSize: 10.5,
    letterSpacing: 1.4,
    color: C.muted,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  tableLabel: { fontFamily: F.regular, fontSize: 13, color: C.text },
  col: { width: 52, textAlign: 'center', fontFamily: F.regular, fontSize: 12 },
  tableFree: { color: C.muted },
  tablePro: { fontFamily: F.semibold, color: C.greenLight },

  cta: { marginTop: 22 },
  ctaSub: {
    textAlign: 'center',
    fontFamily: F.regular,
    fontSize: 11.5,
    color: C.dim,
    lineHeight: 18,
    marginTop: 11,
  },
  links: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 14 },
  link: { fontFamily: F.regular, fontSize: 11, color: C.faint },
});
