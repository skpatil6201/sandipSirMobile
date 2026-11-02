module.exports = {
  preset: '@react-native/jest-preset',
  // RN 0.87 moved the asset registry (same workaround as metro.config.js).
  moduleNameMapper: {
    '^@react-native/assets-registry/registry$': '<rootDir>/node_modules/react-native/src/asset-registry.js',
  },
  // React Navigation and react-native-screens ship untranspiled ESM.
  transformIgnorePatterns: [
    'node_modules/(?!(?:@react-native|react-native|@react-navigation|react-native-screens|react-native-safe-area-context|react-native-svg|react-native-qrcode-svg)/)',
  ],
};
