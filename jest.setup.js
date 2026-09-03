/* eslint-env jest */

// Fonts are loaded at the App level; screens under test assume they are ready.
jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
  isLoaded: () => true,
  loadAsync: jest.fn(),
}));
