const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Enhanced resolver configuration for better module resolution
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

// Set up path aliases
config.resolver.alias = {
  '@': path.resolve(__dirname, '.'),
};

// Ensure proper asset and source extensions
config.resolver.assetExts.push('db', 'sqlite', 'sqlite3');
config.resolver.sourceExts.push('ts', 'tsx', 'js', 'jsx', 'json', 'mjs');

// Enhanced module resolution
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
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