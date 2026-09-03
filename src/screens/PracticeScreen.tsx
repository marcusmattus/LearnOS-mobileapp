import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenView } from '../components/ScreenView';
import { FadeInUp } from '../components/anim';
import { BackButton, PrimaryButton } from '../components/ui';
import { useAppState } from '../state/AppState';
import { ANSWERS, FEEDBACK, QUESTION } from '../data/content';
import { C, F, lh } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function PracticeScreen() {
  const nav = useNavigation<Nav>();
  const { pick, setPick } = useAppState();

  const revealed = pick !== null;
  const correct = pick === 'B';
  const feedback = correct ? FEEDBACK.correct : FEEDBACK.wrong;

  return (
    <ScreenView contentStyle={styles.content}>
      <FadeInUp>
        <View style={styles.header}>
          <BackButton onPress={() => nav.navigate('Lesson')} />
          <View style={styles.flex}>
            <Text style={styles.title}>Check Your Understanding</Text>
            <Text style={styles.subtitle}>Question 2 of 5</Text>
          </View>
        </View>

        <Text style={styles.question}>{QUESTION}</Text>

        <View style={styles.answers}>
          {ANSWERS.map(a => {
            const picked = pick === a.key;
            // The right answer is always revealed; a wrong pick is flagged too.
            const isCorrect = revealed && a.correct;
            const isWrongPick = picked && !a.correct;

            return (
              <Pressable
                key={a.key}
                style={[
                  styles.answer,
                  isCorrect && styles.answerCorrect,
                  isWrongPick && styles.answerWrong,
                ]}
                onPress={() => setPick(a.key)}
              >
                <View style={styles.answerKey}>
                  <Text
                    style={[
                      styles.answerKeyText,
                      isCorrect && { color: C.green },
                      isWrongPick && { color: C.amber },
                    ]}
                  >
                    {a.key}
                  </Text>
                </View>
                <Text style={styles.answerText}>{a.text}</Text>
                {(isCorrect || isWrongPick) && (
                  <Text style={[styles.mark, { color: isCorrect ? C.green : C.amber }]}>
                    {isCorrect ? '✓' : '△'}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {revealed && (
          <FadeInUp duration={300}>
            <View
              style={[
                styles.feedback,
                { backgroundColor: feedback.bg, borderColor: feedback.border },
              ]}
            >
              <Text style={[styles.feedbackTitle, { color: feedback.fg }]}>{feedback.title}</Text>
              <Text style={styles.feedbackBody}>{feedback.body}</Text>
            </View>
            <PrimaryButton
              label="Continue"
              onPress={() => nav.navigate('Teachback')}
              style={styles.cta}
              glow={false}
            />
          </FadeInUp>
        )}
      </FadeInUp>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingTop: 4 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  title: { fontFamily: F.semibold, fontSize: 17, color: C.text },
  subtitle: { fontFamily: F.regular, fontSize: 11.5, color: C.muted },

  question: {
    fontFamily: F.medium,
    fontSize: 19,
    lineHeight: lh(19, 1.45),
    letterSpacing: -0.2,
    color: C.text,
  },

  answers: { gap: 10, marginTop: 20 },
  answer: {
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  answerCorrect: { backgroundColor: 'rgba(71,215,158,0.1)', borderColor: C.greenA50 },
  answerWrong: { backgroundColor: 'rgba(255,200,87,0.08)', borderColor: 'rgba(255,200,87,0.5)' },
  answerKey: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerKeyText: { fontFamily: F.mono, fontSize: 11, color: C.muted },
  answerText: {
    flex: 1,
    fontFamily: F.regular,
    fontSize: 13.5,
    lineHeight: lh(13.5, 1.5),
    color: '#E4E4EC',
  },
  mark: { fontSize: 14 },

  feedback: { marginTop: 18, borderWidth: 1, borderRadius: 18, padding: 16 },
  feedbackTitle: { fontFamily: F.semibold, fontSize: 15 },
  feedbackBody: {
    fontFamily: F.regular,
    fontSize: 13,
    lineHeight: lh(13, 1.65),
    color: C.body,
    marginTop: 7,
  },
  cta: { marginTop: 14 },
});
