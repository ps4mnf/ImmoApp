const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enhanced resolver configuration for better module resolution
config.resolver.platforms = ['web', 'native', 'ios', 'android'];
config.resolver.alias = {
  'expo-image': require.resolve('expo-image'),
};

// Ensure proper asset and source extensions
config.resolver.assetExts.push('db', 'sqlite', 'sqlite3');
config.resolver.sourceExts.push('ts', 'tsx', 'js', 'jsx', 'json', 'mjs');

// Clear metro cache on start
config.resetCache = true;

module.exports = config;