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
});
