/**
 * Smoke test: every screen in the flow renders without throwing, in both the
 * pre- and post-adaptation states of the learning map.
 */
import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppStateProvider } from '../src/state/AppState';
import type { RootStackParamList } from '../src/navigation/types';
import type { ScanAnalysis } from '../src/api/scanApi';

import { SplashScreen } from '../src/screens/SplashScreen';
import { WelcomeScreen } from '../src/screens/WelcomeScreen';
import { PaywallScreen } from '../src/screens/PaywallScreen';
import { LimitScreen } from '../src/screens/LimitScreen';
import { HomeScreen } from '../src/screens/HomeScreen';
import { ScanScreen } from '../src/screens/ScanScreen';
import { CaptureScreen } from '../src/screens/CaptureScreen';
import { ReviewScreen } from '../src/screens/ReviewScreen';
import { AnalysingScreen } from '../src/screens/AnalysingScreen';
import { CompleteScreen } from '../src/screens/CompleteScreen';
import { ConceptsScreen } from '../src/screens/ConceptsScreen';
import { ProfileMatchScreen } from '../src/screens/ProfileMatchScreen';
import { BuildingScreen } from '../src/screens/BuildingScreen';
import { MapScreen } from '../src/screens/MapScreen';
import { LessonScreen } from '../src/screens/LessonScreen';
import { AnotherScreen } from '../src/screens/AnotherScreen';
import { PracticeScreen } from '../src/screens/PracticeScreen';
import { TeachbackScreen } from '../src/screens/TeachbackScreen';
import { AdaptScreen } from '../src/screens/AdaptScreen';
import { MasteryScreen } from '../src/screens/MasteryScreen';
import { ProgressScreen } from '../src/screens/ProgressScreen';
import { ProfileScreen } from '../src/screens/ProfileScreen';
import { LibraryScreen } from '../src/screens/LibraryScreen';

const SCREENS: [keyof RootStackParamList, React.ComponentType<any>][] = [
  ['Splash', SplashScreen],
  ['Welcome', WelcomeScreen],
  ['Paywall', PaywallScreen],
  ['Limit', LimitScreen],
  ['Home', HomeScreen],
  ['Scan', ScanScreen],
  ['Capture', CaptureScreen],
  ['Review', ReviewScreen],
  ['Analysing', AnalysingScreen],
  ['Complete', CompleteScreen],
  ['Concepts', ConceptsScreen],
  ['ProfileMatch', ProfileMatchScreen],
  ['Building', BuildingScreen],
  ['Map', MapScreen],
  ['Lesson', LessonScreen],
  ['Another', AnotherScreen],
  ['Practice', PracticeScreen],
  ['Teachback', TeachbackScreen],
  ['Adapt', AdaptScreen],
  ['Mastery', MasteryScreen],
  ['Progress', ProgressScreen],
  ['Profile', ProfileScreen],
  ['Library', LibraryScreen],
];

const mockCheck = (question: string) => ({
  question,
  answers: [
    { key: 'A' as const, text: 'Wrong one', correct: false },
    { key: 'B' as const, text: 'Right one', correct: true },
    { key: 'C' as const, text: 'Wrong two', correct: false },
    { key: 'D' as const, text: 'Wrong three', correct: false },
  ],
  correctFeedback: 'Nice work.',
  incorrectFeedback: 'Not quite — try again.',
});

/**
 * A minimal real-shaped scan result: two independent roots that merge into a
 * third concept, then a fourth on top — enough to exercise the map's
 * prerequisite-depth layout (branch + merge), not just a straight chain.
 */
const MOCK_ANALYSIS: ScanAnalysis = {
  book: {
    title: 'Test Book',
    author: 'A. Author',
    subtitle: 'A Subtitle',
    estimatedPages: 200,
    difficulty: 'Moderate difficulty',
  },
  overview: 'A test overview.',
  themes: ['Theme One', 'Theme Two'],
  concepts: [
    {
      name: 'Concept A',
      tag: 'CORE',
      minutes: 10,
      summary: 'Summary A',
      explanation: 'Explanation A',
      keyTerms: ['Term A1', 'Term A2'],
      prerequisites: [],
      check: mockCheck('Question A?'),
    },
    {
      name: 'Concept B',
      tag: 'FOUNDATION',
      minutes: 12,
      summary: 'Summary B',
      explanation: 'Explanation B',
      keyTerms: ['Term B1'],
      prerequisites: [],
      check: mockCheck('Question B?'),
    },
    {
      name: 'Concept C',
      tag: 'INTERMEDIATE',
      minutes: 15,
      summary: 'Summary C',
      explanation: 'Explanation C',
      keyTerms: ['Term C1'],
      prerequisites: ['Concept A', 'Concept B'],
      check: mockCheck('Question C?'),
    },
    {
      name: 'Concept D',
      tag: 'ADVANCED',
      minutes: 20,
      summary: 'Summary D',
      explanation: 'Explanation D',
      keyTerms: ['Term D1'],
      prerequisites: ['Concept C'],
      check: mockCheck('Question D?'),
    },
  ],
  recommendedApproach: 'written',
  recommendationNote: 'A note.',
};

const METRICS = {
  frame: { x: 0, y: 0, width: 393, height: 852 },
  insets: { top: 59, left: 0, right: 0, bottom: 34 },
};

const Stack = createNativeStackNavigator();

function renderScreen(
  name: keyof RootStackParamList,
  Component: React.ComponentType<any>,
  initial?: Parameters<typeof AppStateProvider>[0]['initial'],
) {
  let tree: renderer.ReactTestRenderer;
  act(() => {
    tree = renderer.create(
      <SafeAreaProvider initialMetrics={METRICS}>
        <AppStateProvider initial={initial}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name={name} component={Component} />
            </Stack.Navigator>
          </NavigationContainer>
        </AppStateProvider>
      </SafeAreaProvider>,
    );
  });
  return tree!;
}

describe('LearnOS screens', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it.each(SCREENS)('%s renders', (name, Component) => {
    const tree = renderScreen(name, Component);
    expect(tree.toJSON()).toBeTruthy();
    act(() => {
      tree.unmount();
    });
  });

  it('Map renders the adapted route', () => {
    const tree = renderScreen('Map', MapScreen, { adapted: true });
    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Food Surplus');
    expect(json).toContain('NEW SUPPORT PATH');
    act(() => {
      tree.unmount();
    });
  });

  it('Map opens the concept sheet', () => {
    const tree = renderScreen('Map', MapScreen, { sheetOpen: true });
    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('PREREQUISITES');
    expect(json).toContain('LEARNOS RECOMMENDATION');
    act(() => {
      tree.unmount();
    });
  });

  it('Practice reveals feedback once an answer is picked', () => {
    const tree = renderScreen('Practice', PracticeScreen, { pick: 'B' });
    expect(JSON.stringify(tree.toJSON())).toContain('Exactly right.');
    act(() => {
      tree.unmount();
    });
  });

  it('Teachback shows the score after submitting', () => {
    const tree = renderScreen('Teachback', TeachbackScreen, { tbDone: true });
    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('UNDERSTANDING');
    expect(json).toContain('STRENGTHEN');
    act(() => {
      tree.unmount();
    });
  });

  it('Lesson switches to the visual explanation', () => {
    const tree = renderScreen('Lesson', LessonScreen, { approach: 'visual' });
    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('VISUAL TIMELINE');
    expect(json).toContain('THE CHAIN');
    act(() => {
      tree.unmount();
    });
  });

  describe('live scan data', () => {
    it('Map lays out a real scanned path with a branch and a merge', () => {
      const tree = renderScreen('Map', MapScreen, { analysis: MOCK_ANALYSIS, activeConceptIndex: 1 });
      const json = JSON.stringify(tree.toJSON());
      expect(json).toContain('Test Book');
      expect(json).toContain('Concept A');
      expect(json).toContain('Concept D');
      act(() => {
        tree.unmount();
      });
    });

    it('Lesson shows the live concept’s written explanation and key terms', () => {
      const tree = renderScreen('Lesson', LessonScreen, { analysis: MOCK_ANALYSIS, activeConceptIndex: 2 });
      const json = JSON.stringify(tree.toJSON());
      expect(json).toContain('Concept C');
      expect(json).toContain('Explanation C');
      expect(json).toContain('Term C1');
      act(() => {
        tree.unmount();
      });
    });

    it('Practice shows the live comprehension check', () => {
      const tree = renderScreen('Practice', PracticeScreen, {
        analysis: MOCK_ANALYSIS,
        activeConceptIndex: 0,
        pick: 'B',
      });
      const json = JSON.stringify(tree.toJSON());
      expect(json).toContain('Question A?');
      expect(json).toContain('Nice work.');
      act(() => {
        tree.unmount();
      });
    });

    it('Mastery names the concept just finished and what unlocks next', () => {
      const tree = renderScreen('Mastery', MasteryScreen, { analysis: MOCK_ANALYSIS, activeConceptIndex: 0 });
      const json = JSON.stringify(tree.toJSON());
      expect(json).toContain('Concept A');
      expect(json).toContain('Concept B unlocked');
      act(() => {
        tree.unmount();
      });
    });

    it('Home shows the live scanned book and its real progress', () => {
      const tree = renderScreen('Home', HomeScreen, { analysis: MOCK_ANALYSIS, activeConceptIndex: 1 });
      const json = JSON.stringify(tree.toJSON());
      expect(json).toContain('Test Book');
      expect(json).toContain('1 of 4 concepts mastered');
      act(() => {
        tree.unmount();
      });
    });
  });
});
