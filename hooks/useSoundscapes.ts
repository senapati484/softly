import { useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { useSoftlyStore } from '../store/useSoftlyStore';

export interface SoundscapeTrack {
  id: string;
  name: string;
  description: string;
  mood: string;
  color: string;
  uri: string;
  fallbackUri?: string;
}

export const SOUNDSCAPE_TRACKS: SoundscapeTrack[] = [
  {
    id: 'rain',
    name: 'Rain on Cedar',
    description: 'Gentle raindrops falling on wooden shingles and soft earth.',
    mood: 'Restful',
    color: '#E8EFE8',
    uri: 'https://moodist.mvze.net/sounds/rain/rain.mp3',
    fallbackUri: 'https://moodist.mvze.net/sounds/rain/light-rain.mp3',
  },
  {
    id: 'forest',
    name: 'Forest Wind',
    description: 'Pine needles rustling in a cool mountain breeze.',
    mood: 'Clarity',
    color: '#F2F6F2',
    uri: 'https://moodist.mvze.net/sounds/nature/wind.mp3',
    fallbackUri: 'https://moodist.mvze.net/sounds/nature/forest.mp3',
  },
  {
    id: 'library',
    name: 'Old Library',
    description: 'Warm acoustics, distant clock ticking, and soft page turns.',
    mood: 'Focus',
    color: '#EFEDF4',
    uri: 'https://moodist.mvze.net/sounds/places/library.mp3',
    fallbackUri: 'https://moodist.mvze.net/sounds/noise/white-noise.mp3',
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
      shouldDuckAndroid: true,
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
        if (!track.uri) return;

        let soundObj: Audio.Sound | null = null;

        try {
          const { sound } = await Audio.Sound.createAsync(
            { uri: track.uri },
            { isLooping: true, volume: soundVolume, shouldPlay: true },
            undefined,
            true // downloadFirst for smooth offline playback
          );
          soundObj = sound;
        } catch (primaryErr) {
          console.warn('Primary audio stream failed, trying fallback:', primaryErr);
          if (track.fallbackUri) {
            const { sound } = await Audio.Sound.createAsync(
              { uri: track.fallbackUri },
              { isLooping: true, volume: soundVolume, shouldPlay: true },
              undefined,
              true
            );
            soundObj = sound;
          }
        }

        if (soundObj) {
          globalSoundInstance = soundObj;
          setActiveSound(trackName);
          setIsPlayingSound(true);
        }
      } catch (err) {
        console.warn('Audio playback error:', err);
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
