import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenView } from '../components/ScreenView';
import { FadeInUp } from '../components/anim';
import { BackButton, Chip, PrimaryButton } from '../components/ui';
import { SearchIcon } from '../components/icons';
import { useAppState } from '../state/AppState';
import { BOOK, CONCEPTS, TAG_COLORS } from '../data/content';
import { C, F } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TABS = ['Concepts', 'Structure', 'Connections', 'Insights'];

export function ConceptsScreen() {
  const nav = useNavigation<Nav>();
  const { openSheet } = useAppState();
  const [tab, setTab] = useState('Concepts');

  const openConcept = () => {
    openSheet();
    nav.navigate('Map');
  };

  return (
    <ScreenView contentStyle={styles.content}>
      <FadeInUp>
        <View style={styles.header}>
          <BackButton onPress={() => nav.goBack()} />
          <View>
            <Text style={styles.title}>{BOOK.concepts} Concepts Found</Text>
            <Text style={styles.subtitle}>{BOOK.title} · sorted by prerequisite order</Text>
          </View>
        </View>

        <View style={styles.tabs}>
          {TABS.map(t => (
            <Chip key={t} label={t} active={t === tab} onPress={() => setTab(t)} />
          ))}
        </View>

        <View style={styles.search}>
          <SearchIcon size={15} color={C.muted} />
          <Text style={styles.searchText}>Search concepts...</Text>
        </View>

        <View style={styles.list}>
          {CONCEPTS.map(c => {
            const tagColor = TAG_COLORS[c.tag];
            return (
              <Pressable key={c.num} style={styles.row} onPress={openConcept}>
                <View
                  style={[
                    styles.num,
                    { backgroundColor: c.mastered ? C.greenA14 : 'rgba(255,255,255,0.06)' },
                  ]}
                >
                  <Text style={[styles.numText, { color: c.mastered ? C.green : C.muted }]}>
                    {c.num}
                  </Text>
                </View>
                <View style={styles.flex}>
                  <Text style={styles.name}>{c.name}</Text>
                  <Text style={styles.meta}>{c.meta}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: tagColor.bg }]}>
                  <Text style={[styles.tagText, { color: tagColor.fg }]}>{c.tag}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            );
          })}
        </View>

        <PrimaryButton
          label="Generate Learning Map"
          onPress={() => nav.navigate('ProfileMatch')}
          style={styles.cta}
        />
      </FadeInUp>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  content: { paddingTop: 4 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  title: { fontFamily: F.semibold, fontSize: 17, color: C.text },
  subtitle: { fontFamily: F.regular, fontSize: 11.5, color: C.muted },

  tabs: { flexDirection: 'row', gap: 7, marginBottom: 12 },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: C.surfaceDeep,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  searchText: { fontFamily: F.regular, fontSize: 13, color: C.muted },

  list: { gap: 9 },
  row: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  num: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  numText: { fontFamily: F.mono, fontSize: 11 },
  name: { fontFamily: F.semibold, fontSize: 14.5, color: C.text },
  meta: { fontFamily: F.regular, fontSize: 11, color: C.muted, marginTop: 2 },
  tag: { paddingVertical: 4, paddingHorizontal: 9, borderRadius: 7 },
  tagText: { fontFamily: F.semibold, fontSize: 9.5, letterSpacing: 0.6 },
  chevron: { fontSize: 16, color: C.muted },

  cta: { marginTop: 20 },
});
