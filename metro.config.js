const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver configuration for better module resolution
config.resolver.platforms = ['native', 'web', 'ios', 'android'];

// Ensure proper asset extensions
config.resolver.assetExts.push('db', 'sqlite', 'sqlite3');

module.exports = config;