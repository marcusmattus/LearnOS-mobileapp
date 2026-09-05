import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
// Imported per weight: the package root re-exports all 18 cuts of each family
// and would bundle every one of them.
import { Poppins_400Regular } from '@expo-google-fonts/poppins/400Regular';
import { Poppins_500Medium } from '@expo-google-fonts/poppins/500Medium';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins/600SemiBold';
import { Poppins_700Bold } from '@expo-google-fonts/poppins/700Bold';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono/400Regular';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono/500Medium';

import { AppStateProvider } from './src/state/AppState';
import { C } from './src/theme';
import type { RootStackParamList } from './src/navigation/types';

import { SplashScreen } from './src/screens/SplashScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { PaywallScreen } from './src/screens/PaywallScreen';
import { LimitScreen } from './src/screens/LimitScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ScanScreen } from './src/screens/ScanScreen';
import { CaptureScreen } from './src/screens/CaptureScreen';
import { ReviewScreen } from './src/screens/ReviewScreen';
import { AnalysingScreen } from './src/screens/AnalysingScreen';
import { CompleteScreen } from './src/screens/CompleteScreen';
import { ConceptsScreen } from './src/screens/ConceptsScreen';
import { ProfileMatchScreen } from './src/screens/ProfileMatchScreen';
import { BuildingScreen } from './src/screens/BuildingScreen';
import { MapScreen } from './src/screens/MapScreen';
import { LessonScreen } from './src/screens/LessonScreen';
import { AnotherScreen } from './src/screens/AnotherScreen';
import { PracticeScreen } from './src/screens/PracticeScreen';
import { TeachbackScreen } from './src/screens/TeachbackScreen';
import { AdaptScreen } from './src/screens/AdaptScreen';
import { MasteryScreen } from './src/screens/MasteryScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Keeps the dark ground behind screen transitions instead of flashing white. */
const navTheme: Theme = {
  dark: true,
  colors: {
    primary: C.purple,
    background: C.bg,
    card: C.bg,
    text: C.text,
    border: C.border,
    notification: C.purple,
  },
  fonts: {
    regular: { fontFamily: 'Poppins_400Regular', fontWeight: '400' },
    medium: { fontFamily: 'Poppins_500Medium', fontWeight: '500' },
    bold: { fontFamily: 'Poppins_600SemiBold', fontWeight: '600' },
    heavy: { fontFamily: 'Poppins_700Bold', fontWeight: '700' },
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: C.bg }} />;
  }

  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <StatusBar style="light" />
        <NavigationContainer theme={navTheme}>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: C.bg },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Paywall" component={PaywallScreen} />
            <Stack.Screen
              name="Limit"
              component={LimitScreen}
              options={{ animation: 'slide_from_bottom', contentStyle: { backgroundColor: 'transparent' } }}
            />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Scan" component={ScanScreen} />
            <Stack.Screen
              name="Capture"
              component={CaptureScreen}
              options={{ animation: 'fade' }}
            />
            <Stack.Screen name="Review" component={ReviewScreen} />
            <Stack.Screen name="Analysing" component={AnalysingScreen} />
            <Stack.Screen name="Complete" component={CompleteScreen} />
            <Stack.Screen name="Concepts" component={ConceptsScreen} />
            <Stack.Screen name="ProfileMatch" component={ProfileMatchScreen} />
            <Stack.Screen name="Building" component={BuildingScreen} />
            <Stack.Screen name="Map" component={MapScreen} options={{ animation: 'fade' }} />
            <Stack.Screen name="Lesson" component={LessonScreen} />
            <Stack.Screen name="Another" component={AnotherScreen} />
            <Stack.Screen name="Practice" component={PracticeScreen} />
            <Stack.Screen name="Teachback" component={TeachbackScreen} />
            <Stack.Screen name="Adapt" component={AdaptScreen} />
            <Stack.Screen name="Mastery" component={MasteryScreen} />
            <Stack.Screen name="Progress" component={ProgressScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Library" component={LibraryScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
