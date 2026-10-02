const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure audio assets are included in the production bundle (release APK/IPA).
// Without this, Metro may omit .mp3 files and expo-av silently fails on device.
const { assetExts } = config.resolver;
if (!assetExts.includes('mp3')) {
  config.resolver.assetExts = [...assetExts, 'mp3'];
}

module.exports = config;
