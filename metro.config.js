const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enhanced resolver configuration for better module resolution
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

// Module alias resolution for problematic packages
config.resolver.alias = {
  'expo-image': require.resolve('expo-image'),
  'expo-image/src/Image': require.resolve('expo-image'),
};

// Ensure proper asset and source extensions
config.resolver.assetExts.push('db', 'sqlite', 'sqlite3');
config.resolver.sourceExts.push('ts', 'tsx', 'js', 'jsx', 'json', 'mjs');

// Enhanced module resolution
config.resolver.nodeModulesPaths = [
  require('path').resolve(__dirname, 'node_modules'),
];

// Clear metro cache on start
config.resetCache = true;

// Transformer configuration
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;