import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenView } from '../components/ScreenView';
import { FadeInUp, GlowRing, ScanLine } from '../components/anim';
import { Chip, Stripes } from '../components/ui';
import { BoltIcon, ImageIcon } from '../components/icons';
import { useAppState, FREE_SCAN_LIMIT } from '../state/AppState';
import { angle, C, F } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const KINDS = ['BOOK', 'PAGE', 'DIAGRAM', 'NOTES', 'DOC'];

const SOURCES = [
  { title: 'Upload PDF', meta: 'up to 800 pages', kind: 'simulated' as const },
  { title: 'Paste Text', meta: 'notes, articles', kind: 'simulated' as const },
  { title: 'Import Photos', meta: 'from library', kind: 'photos' as const },
  { title: 'Enter Topic', meta: 'no material yet', kind: 'simulated' as const },
];

const VIEWFINDER_HEIGHT = 250;

export function ScanScreen() {
  const nav = useNavigation<Nav>();
  const [kind, setKind] = useState('BOOK');
  const { scansUsed, capturePage, useFreeScan } = useAppState();
  const [picking, setPicking] = useState(false);

  const gated = (go: () => void) => {
    if (scansUsed >= FREE_SCAN_LIMIT) nav.navigate('Limit');
    else go();
  };

  const openCapture = () => gated(() => nav.navigate('Capture'));

  const runSource = (source: (typeof SOURCES)[number]) =>
    gated(async () => {
      if (source.kind === 'simulated') {
        useFreeScan();
        nav.navigate('Analysing');
        return;
      }
      // Import Photos — pull real images from the library into this scan session.
      if (picking) return;
      setPicking(true);
      try {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Photo access needed', 'Enable photo library access for LearnOS in Settings.');
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsMultipleSelection: true,
          quality: 0.6,
        });
        if (result.canceled || result.assets.length === 0) return;
        result.assets.forEach(a => capturePage(a.uri));
        useFreeScan();
        nav.navigate('Analysing');
      } finally {
        setPicking(false);
      }
    });

  return (
    <ScreenView nav>
      <FadeInUp>
        <Text style={styles.title}>Turn anything into a learning path.</Text>
        <Text style={styles.subtitle}>
          Scan books, pages, diagrams, notes or learning material.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.kinds}
        >
          {KINDS.map(k => (
            <Chip key={k} label={k} active={k === kind} onPress={() => setKind(k)} />
          ))}
        </ScrollView>

        {/* Viewfinder — taps open the real camera */}
        <Pressable onPress={openCapture}>
          <LinearGradient colors={['#1A1622', '#0F0F18']} {...angle(160)} style={styles.viewfinder}>
            <Stripes variant="texture" style={StyleSheet.absoluteFill} />
            <Stripes variant="pageStack" style={styles.page} />

            <View style={[styles.bracket, styles.bracketTL]} />
            <View style={[styles.bracket, styles.bracketTR]} />
            <View style={[styles.bracket, styles.bracketBL]} />
            <View style={[styles.bracket, styles.bracketBR]} />

            <ScanLine height={VIEWFINDER_HEIGHT} />

            <View style={styles.previewTag}>
              <Text style={styles.previewTagText}>camera preview</Text>
            </View>
          </LinearGradient>
        </Pressable>

        {/* Shutter row */}
        <View style={styles.controls}>
          <View style={styles.controlBtn}>
            <BoltIcon size={18} color={C.muted} />
          </View>

          <Pressable style={styles.shutterRing} onPress={openCapture}>
            <View style={styles.shutterInnerWrap}>
              <GlowRing duration={2600} color={C.purple} radius={999} blur={30} spread={4} />
              <LinearGradient
                colors={[C.purpleBright, C.purpleDark]}
                {...angle(140)}
                style={styles.shutterInner}
              />
            </View>
          </Pressable>

          <View style={styles.controlBtn}>
            <ImageIcon size={18} color={C.muted} />
          </View>
        </View>

        {/* Other sources */}
        <View style={styles.sourceGrid}>
          {SOURCES.map(s => (
            <Pressable key={s.title} style={styles.source} onPress={() => runSource(s)}>
              <Text style={styles.sourceTitle}>{s.title}</Text>
              <Text style={styles.sourceMeta}>{s.meta}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.footer}>Combine multiple sources into one learning path.</Text>
      </FadeInUp>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: F.semibold, fontSize: 24, letterSpacing: -0.5, color: C.text },
  subtitle: { fontFamily: F.regular, fontSize: 13.5, color: C.muted, marginTop: 6 },
  kinds: { gap: 7, paddingTop: 18, paddingBottom: 14 },

  viewfinder: {
    height: VIEWFINDER_HEIGHT,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
  },
  page: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 132,
    height: 186,
    borderRadius: 6,
    overflow: 'hidden',
    opacity: 0.5,
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
  },
  bracket: { position: 'absolute', width: 26, height: 26, borderColor: C.purple },
  bracketTL: {
    left: 22,
    top: 22,
    borderLeftWidth: 2.5,
    borderTopWidth: 2.5,
    borderTopLeftRadius: 6,
  },
  bracketTR: {
    right: 22,
    top: 22,
    borderRightWidth: 2.5,
    borderTopWidth: 2.5,
    borderTopRightRadius: 6,
  },
  bracketBL: {
    left: 22,
    bottom: 22,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderBottomLeftRadius: 6,
  },
  bracketBR: {
    right: 22,
    bottom: 22,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    borderBottomRightRadius: 6,
  },
  previewTag: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(11,11,18,0.7)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  previewTagText: { fontFamily: F.mono, fontSize: 9.5, color: C.muted },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    paddingTop: 18,
    paddingBottom: 4,
  },
  controlBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterRing: {
    width: 74,
    height: 74,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.16)',
    padding: 5,
  },
  shutterInnerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: '100%', height: '100%', borderRadius: 999 },

  sourceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
  source: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 14,
  },
  sourceTitle: { fontFamily: F.semibold, fontSize: 14, color: C.text },
  sourceMeta: { fontFamily: F.regular, fontSize: 11, color: C.muted, marginTop: 2 },

  footer: {
    marginTop: 14,
    fontFamily: F.regular,
    fontSize: 11.5,
    color: C.muted,
    textAlign: 'center',
  },
});
