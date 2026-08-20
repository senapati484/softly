import { useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { useSoftlyStore } from '../store/useSoftlyStore';

export interface SoundscapeTrack {
  id: string;
  name: string;
  description: string;
  mood: string;
  color: string;
  uri?: string;
}

export const SOUNDSCAPE_TRACKS: SoundscapeTrack[] = [
  {
    id: 'rain',
    name: 'Rain on Cedar',
    description: 'Gentle raindrops falling on wooden shingles and soft earth.',
    mood: 'Restful',
    color: '#E8EFE8',
    uri: 'https://cdn.freesound.org/previews/530/530415_11861866-lq.mp3',
  },
  {
    id: 'forest',
    name: 'Forest Wind',
    description: 'Pine needles rustling in a cool mountain breeze.',
    mood: 'Clarity',
    color: '#F2F6F2',
    uri: 'https://cdn.freesound.org/previews/268/268916_4921277-lq.mp3',
  },
  {
    id: 'library',
    name: 'Old Library',
    description: 'Warm acoustics, distant clock ticking, and soft page turns.',
    mood: 'Focus',
    color: '#EFEDF4',
    uri: 'https://cdn.freesound.org/previews/415/415804_5121236-lq.mp3',
  },
];

// Global audio player instance to persist across tab switches
let globalSoundInstance: Audio.Sound | null = null;
let isAudioConfigured = false;

async function setupAudioMode() {
  if (isAudioConfigured) return;
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });
    isAudioConfigured = true;
  } catch {
    // ignore
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
        if (!track.uri) return;

        const { sound } = await Audio.Sound.createAsync(
          { uri: track.uri },
          { isLooping: true, volume: soundVolume, shouldPlay: true }
        );

        globalSoundInstance = sound;
        setActiveSound(trackName);
        setIsPlayingSound(true);
      } catch (err) {
        console.warn('Audio playback error (using silent fallback):', err);
        setActiveSound(trackName);
        setIsPlayingSound(true);
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
