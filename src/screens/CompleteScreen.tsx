import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenView } from '../components/ScreenView';
import { FadeInUp } from '../components/anim';
import { BackButton, PrimaryButton, SecondaryButton, SectionLabel, StatTile, Stripes } from '../components/ui';
import { BOOK } from '../data/content';
import { C, F, lh } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function CompleteScreen() {
  const nav = useNavigation<Nav>();

  return (
    <ScreenView contentStyle={styles.content}>
      <FadeInUp>
        <View style={styles.header}>
          <BackButton onPress={() => nav.navigate('Scan')} />
          <Text style={styles.title}>Analysis Complete</Text>
          <View style={styles.doneBadge}>
            <Text style={styles.doneBadgeText}>✓</Text>
          </View>
        </View>

        <View style={styles.bookCard}>
          <Stripes variant="cover" style={styles.cover}>
            <Text style={styles.coverLabel}>cover</Text>
          </Stripes>
          <View style={styles.flex}>
            <Text style={styles.bookTitle}>{BOOK.title}</Text>
            <Text style={styles.bookSub}>{BOOK.subtitle}</Text>
            <Text style={styles.bookSub}>{BOOK.author}</Text>
            <View style={styles.difficulty}>
              <Text style={styles.difficultyText}>{BOOK.difficulty}</Text>
            </View>
          </View>
        </View>

        <View style={styles.stats}>
          <StatTile value={String(BOOK.pages)} label="Pages" />
          <StatTile value={String(BOOK.concepts)} label="Key concepts" color={C.purpleLight} />
          <StatTile value={String(BOOK.themes)} label="Major themes" color={C.teal} />
        </View>

        <SectionLabel style={styles.label}>Content overview</SectionLabel>
        <View style={styles.overview}>
          <Text style={styles.overviewText}>{BOOK.overview}</Text>
        </View>

        <SectionLabel style={styles.label}>Major themes</SectionLabel>
        <View style={styles.themes}>
          {BOOK.themeList.map(t => (
            <View key={t} style={styles.theme}>
              <Text style={styles.themeText}>{t}</Text>
            </View>
          ))}
        </View>

        <PrimaryButton
          label="Build My Learning Path"
          onPress={() => nav.navigate('Concepts')}
          style={styles.cta}
        />
        <SecondaryButton
          label="Explore Analysis"
          onPress={() => nav.navigate('Concepts')}
          style={styles.ctaAlt}
        />
      </FadeInUp>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingTop: 4 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  title: { fontFamily: F.semibold, fontSize: 17, color: C.text },
  doneBadge: {
    marginLeft: 'auto',
    width: 26,
    height: 26,
    borderRadius: 999,
    backgroundColor: C.greenA16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBadgeText: { fontSize: 13, color: C.green },

  bookCard: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
  },
  cover: {
    width: 78,
    height: 112,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 6,
  },
  coverLabel: { fontFamily: F.mono, fontSize: 8, color: C.muted },
  bookTitle: { fontFamily: F.semibold, fontSize: 20, letterSpacing: -0.3, color: C.text },
  bookSub: { fontFamily: F.regular, fontSize: 12.5, color: C.muted, marginTop: 2 },
  difficulty: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: C.amberA12,
    borderWidth: 1,
    borderColor: C.amberA30,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  difficultyText: { fontFamily: F.semibold, fontSize: 11, color: C.amber },

  stats: { flexDirection: 'row', gap: 10, marginTop: 12 },
  label: { marginTop: 18, marginBottom: 8 },
  overview: {
    backgroundColor: C.surfaceDeep,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 14,
  },
  overviewText: { fontFamily: F.regular, fontSize: 13, lineHeight: lh(13, 1.6), color: C.body },

  themes: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  theme: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: C.surfaceAlt,
    borderWidth: 1,
    borderColor: C.border,
  },
  themeText: { fontFamily: F.regular, fontSize: 12, color: C.text },

  cta: { marginTop: 22 },
  ctaAlt: { marginTop: 10 },
});
