const preset = require('jest-expo/jest-preset');

// The preset transforms .js/.ts only; Firebase ships one ESM `.mjs` helper.
const [babelJest, babelOptions] = preset.transform['\\.[jt]sx?$'];

module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: { '\\.mjs$': [babelJest, babelOptions] },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/.*|native-base|react-native-svg|firebase|@firebase/.*))',
  ],
};
