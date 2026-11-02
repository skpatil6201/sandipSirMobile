const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // react-native-svg (15.15.5) still imports `@react-native/assets-registry`,
    // which React Native 0.87 removed. `react-native/asset-registry` is the
    // replacement entry point and exports the same registerAsset/getAssetByID.
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName.startsWith('@react-native/assets-registry/registry')) {
        return context.resolveRequest(
          context,
          'react-native/asset-registry',
          platform,
        );
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
