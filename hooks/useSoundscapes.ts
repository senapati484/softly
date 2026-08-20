import { useRef, useCallback } from 'react';
import { Audio, AVPlaybackSource } from 'expo-av';
import { Asset } from 'expo-asset';
import { useSoftlyStore } from '../store/useSoftlyStore';

export interface SoundscapeTrack {
  id: string;
  name: string;
  description: string;
  mood: string;
  color: string;
  source: number;
}

export const SOUNDSCAPE_TRACKS: SoundscapeTrack[] = [
  {
    id: 'rain',
    name: 'Rain on Cedar',
    description: 'Gentle raindrops falling on wooden shingles and soft earth.',
    mood: 'Restful',
    color: '#EDF4ED',
    source: require('../assets/sounds/rain.wav'),
  },
  {
    id: 'forest',
    name: 'Forest Wind',
    description: 'Pine needles rustling in a cool mountain breeze.',
    mood: 'Clarity',
    color: '#F4F8F4',
    source: require('../assets/sounds/forest.wav'),
  },
  {
    id: 'library',
    name: 'Old Library',
    description: 'Warm acoustics, gentle room resonance, and deep focus.',
    mood: 'Focus',
    color: '#F2EFF8',
    source: require('../assets/sounds/library.wav'),
  },
];

// Global audio player instance to persist across tab switches
let globalSoundInstance: Audio.Sound | null = null;
let isAudioConfigured = false;

async function setupAudioMode() {
  if (isAudioConfigured) return;
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
    });
    isAudioConfigured = true;
  } catch (e) {
    console.warn('Could not configure Audio mode:', e);
  }
}

export function useSoundscapes() {
  const { activeSound, isPlayingSound, soundVolume, setActiveSound, setIsPlayingSound } = useSoftlyStore();
  const isPlayingRef = useRef(isPlayingSound);
  isPlayingRef.current = isPlayingSound;

  const stopSound = useCallback(async () => {
    if (globalSoundInstance) {
      try {
        await globalSoundInstance.stopAsync();
        await globalSoundInstance.unloadAsync();
      } catch {
        // ignore unload errors
      }
      globalSoundInstance = null;
    }
    setIsPlayingSound(false);
  }, [setIsPlayingSound]);

  const playSound = useCallback(
    async (trackName: string) => {
      try {
        await setupAudioMode();

        if (globalSoundInstance) {
          try {
            await globalSoundInstance.stopAsync();
            await globalSoundInstance.unloadAsync();
          } catch {
            // ignore
          }
          globalSoundInstance = null;
        }

        const track = SOUNDSCAPE_TRACKS.find((t) => t.name === trackName) || SOUNDSCAPE_TRACKS[0];

        // Ensure asset is downloaded and local on physical device storage
        try {
          const asset = Asset.fromModule(track.source);
          if (!asset.downloaded) {
            await asset.downloadAsync();
          }
        } catch {
          // fallback to raw source if asset download is not needed
        }

        const { sound } = await Audio.Sound.createAsync(
          track.source,
          { isLooping: true, volume: soundVolume, shouldPlay: true }
        );

        globalSoundInstance = sound;
        await sound.playAsync();
        setActiveSound(trackName);
        setIsPlayingSound(true);
      } catch (err) {
        console.warn('Audio playback error on device:', err);
        setActiveSound(trackName);
        setIsPlayingSound(false);
      }
    },
    [soundVolume, setActiveSound, setIsPlayingSound]
  );

  const toggleSound = useCallback(
    async (trackName: string) => {
      if (activeSound === trackName && isPlayingRef.current) {
        await stopSound();
      } else {
        await playSound(trackName);
      }
    },
    [activeSound, playSound, stopSound]
  );

  return {
    tracks: SOUNDSCAPE_TRACKS,
    activeSound,
    isPlayingSound,
    toggleSound,
    stopSound,
  };
}
