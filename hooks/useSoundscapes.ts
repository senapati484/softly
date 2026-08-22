import { useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
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
    source: require('../assets/sounds/rain.mp3'),
  },
  {
    id: 'forest',
    name: 'Forest Wind',
    description: 'Pine needles rustling in a cool mountain breeze.',
    mood: 'Clarity',
    color: '#F4F8F4',
    source: require('../assets/sounds/forest.mp3'),
  },
  {
    id: 'library',
    name: 'Old Library',
    description: 'Warm acoustics, gentle room resonance, and deep focus.',
    mood: 'Focus',
    color: '#F2EFF8',
    source: require('../assets/sounds/library.mp3'),
  },
];

// Global audio sound instance persisting across tab navigations
let globalSound: Audio.Sound | null = null;
let isAudioModeConfigured = false;

async function configureAudio() {
  if (isAudioModeConfigured) return;
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    isAudioModeConfigured = true;
  } catch (e) {
    console.warn('[Softly] Audio mode configuration note:', e);
  }
}

export function useSoundscapes() {
  const { activeSound, isPlayingSound, soundVolume, setActiveSound, setIsPlayingSound } =
    useSoftlyStore();

  const isPlayingRef = useRef(isPlayingSound);
  isPlayingRef.current = isPlayingSound;

  const stopSound = useCallback(async () => {
    if (globalSound) {
      try {
        await globalSound.stopAsync();
        await globalSound.unloadAsync();
      } catch {
        // ignore unload error
      }
      globalSound = null;
    }
    setIsPlayingSound(false);
  }, [setIsPlayingSound]);

  const playSound = useCallback(
    async (trackName: string) => {
      try {
        await configureAudio();

        if (globalSound) {
          try {
            await globalSound.stopAsync();
            await globalSound.unloadAsync();
          } catch {
            // ignore
          }
          globalSound = null;
        }

        const track = SOUNDSCAPE_TRACKS.find((t) => t.name === trackName) || SOUNDSCAPE_TRACKS[0];
        const volume = soundVolume > 0 ? soundVolume : 0.8;

        const { sound } = await Audio.Sound.createAsync(
          track.source,
          {
            shouldPlay: true,
            isLooping: true,
            volume,
          }
        );

        globalSound = sound;
        await sound.setVolumeAsync(volume);
        await sound.setIsLoopingAsync(true);
        await sound.playAsync();

        setActiveSound(trackName);
        setIsPlayingSound(true);
      } catch (err) {
        console.warn('[Softly] playSound error:', err);
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
