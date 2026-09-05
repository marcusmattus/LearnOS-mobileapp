import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenView } from '../components/ScreenView';
import { FadeInUp } from '../components/anim';
import { BackButton, PrimaryButton, SecondaryButton, Stripes } from '../components/ui';
import { useAppState } from '../state/AppState';
import { C, F } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TOOLS = ['Rotate', 'Crop', 'Rescan'];
const PLACEHOLDER_SLOTS = ['01', '02', '03', '04', '05'];

export function ReviewScreen() {
  const nav = useNavigation<Nav>();
  const { pages, shots, removeShot, useFreeScan } = useAppState();
  // Real captures come first; placeholder slots pad the strip out to five like the design.
  const slots: { key: string; uri?: string }[] =
    shots.length > 0
      ? shots.map((uri, i) => ({ key: String(i + 1).padStart(2, '0'), uri }))
      : PLACEHOLDER_SLOTS.map(key => ({ key }));
  const [selected, setSelected] = useState(slots[0]?.key ?? '01');
  const current = slots.find(s => s.key === selected) ?? slots[0];

  const analyse = () => {
    useFreeScan();
    nav.navigate('Analysing');
  };

  const deleteSelected = () => {
    if (current?.uri) removeShot(current.uri);
  };

  return (
    <ScreenView contentStyle={styles.content}>
      <FadeInUp>
        <View style={styles.header}>
          <BackButton onPress={() => nav.goBack()} />
          <Text style={styles.title}>Review Scan</Text>
          <Text style={styles.ready}>{pages} pages ready</Text>
        </View>

        {current?.uri ? (
          <Image source={{ uri: current.uri }} style={styles.preview} resizeMode="cover" />
        ) : (
          <Stripes variant="paper" style={styles.preview}>
            <View style={styles.previewHeaderBand} />
            <Text style={styles.previewChapter}>CHAPTER 3 · The Cognitive Revolution</Text>
            <View style={styles.correctedTag}>
              <Text style={styles.correctedText}>perspective corrected</Text>
            </View>
          </Stripes>
        )}

        <View style={styles.tools}>
          {TOOLS.map(t => (
            <Pressable
              key={t}
              style={styles.tool}
              onPress={t === 'Rescan' ? () => nav.navigate('Capture') : undefined}
            >
              <Text style={styles.toolText}>{t}</Text>
            </Pressable>
          ))}
          <Pressable style={[styles.tool, styles.toolDanger]} onPress={deleteSelected}>
            <Text style={[styles.toolText, { color: C.red }]}>Delete</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbRow}
        >
          {slots.map(s => {
            const active = s.key === selected;
            return (
              <Pressable key={s.key} style={styles.thumb} onPress={() => setSelected(s.key)}>
                {s.uri ? (
                  <Image
                    source={{ uri: s.uri }}
                    style={[styles.thumbImage, active ? styles.thumbActive : styles.thumbIdle]}
                    resizeMode="cover"
                  />
                ) : (
                  <Stripes
                    variant={active ? 'paper' : 'paperSoft'}
                    style={[styles.thumbImage, active ? styles.thumbActive : styles.thumbIdle]}
                  />
                )}
                <Text style={[styles.thumbLabel, active && { color: C.purpleSoft }]}>{s.key}</Text>
              </Pressable>
            );
          })}
          <Pressable style={styles.addThumb} onPress={() => nav.navigate('Capture')}>
            <Text style={styles.addThumbText}>+</Text>
          </Pressable>
        </ScrollView>

        <PrimaryButton label="Analyse Book" onPress={analyse} style={styles.cta} />
        <SecondaryButton
          label="Scan More Pages"
          onPress={() => nav.navigate('Capture')}
          style={styles.ctaAlt}
        />
      </FadeInUp>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 4 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  title: { fontFamily: F.semibold, fontSize: 17, color: C.text },
  ready: { marginLeft: 'auto', fontFamily: F.medium, fontSize: 12, color: C.green },

  preview: {
    height: 342,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  previewHeaderBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  previewChapter: {
    position: 'absolute',
    left: 14,
    top: 16,
    fontFamily: F.semibold,
    fontSize: 13,
    color: '#3A3A52',
  },
  correctedTag: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: 'rgba(11,11,18,0.78)',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 7,
  },
  correctedText: { fontFamily: F.mono, fontSize: 9, color: C.purpleSoft },

  tools: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 16, marginBottom: 18 },
  tool: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 11,
  },
  toolDanger: { borderColor: C.redA25 },
  toolText: { fontFamily: F.regular, fontSize: 11.5, color: C.muted },

  thumbRow: { gap: 9, paddingBottom: 6 },
  thumb: { width: 56 },
  thumbImage: { height: 76, borderRadius: 8, overflow: 'hidden' },
  thumbActive: { borderWidth: 2, borderColor: C.purple },
  thumbIdle: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  thumbLabel: {
    textAlign: 'center',
    fontFamily: F.mono,
    fontSize: 9.5,
    color: C.muted,
    marginTop: 5,
  },
  addThumb: {
    width: 56,
    height: 76,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: C.borderDashed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addThumbText: { fontSize: 20, color: C.muted },

  cta: { marginTop: 20 },
  ctaAlt: { marginTop: 10 },
});
