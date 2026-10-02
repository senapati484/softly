/**
 * useSoundscapes.ts
 *
 * Ambient sound playback using expo-av.
 *
 * CRITICAL FIX — Android Release APK Asset Resolution:
 * ─────────────────────────────────────────────────────
 * In Android release builds AAPT2 renames bundled assets with short hashed names
 * (e.g. rain.mp3 → res/D3.mp3). Passing a raw `require()` module ID to expo-av
 * causes it to look up the original filename via Metro's asset registry, which
 * fails silently on physical devices.
 *
 * The fix: use `Asset.fromModule(source).downloadAsync()` to let expo-asset
 * resolve the correct on-device `file://` URI, then pass that URI string to
 * `Audio.Sound.createAsync`. This works in every build variant on both platforms.
 */

import { useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { Asset } from 'expo-asset';
import { useSoftlyStore } from '../store/useSoftlyStore';

export interface SoundscapeTrack {
  id: string;
  name: string;
  description: string;
  mood: string;
  color: string;
  source: number; // raw require() module id
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

// ─────────────────────────────────────────────────────────
// Resolve a require() module → file:// URI on the device
// ─────────────────────────────────────────────────────────
async function resolveAssetUri(source: number): Promise<string> {
  const asset = Asset.fromModule(source);
  await asset.downloadAsync();            // ensures it's on local flash storage
  if (!asset.localUri) {
    throw new Error(`[Softly] Could not resolve localUri for asset: ${source}`);
  }
  return asset.localUri;
}

// ─────────────────────────────────────────────────────────
// Configure audio session once
// ─────────────────────────────────────────────────────────
let audioModeReady = false;
async function ensureAudioMode(): Promise<void> {
  if (audioModeReady) return;
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    audioModeReady = true;
  } catch (e) {
    console.warn('[Softly] Audio mode error:', e);
  }
}

// ─────────────────────────────────────────────────────────
// Main hook
// ─────────────────────────────────────────────────────────
export function useSoundscapes() {
  const { activeSound, isPlayingSound, soundVolume, setActiveSound, setIsPlayingSound } =
    useSoftlyStore();

  const soundRef = useRef<Audio.Sound | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    ensureAudioMode();

    return () => {
      isMountedRef.current = false;
      // Note: intentionally NOT stopping sound on unmount so it keeps playing
      // when the user navigates away from the sounds screen.
    };
  }, []);

  // ── Stop ────────────────────────────────────────────────
  const stopSound = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (e) {
      console.warn('[Softly] stopSound error:', e);
      soundRef.current = null;
    }
    if (isMountedRef.current) setIsPlayingSound(false);
  }, [setIsPlayingSound]);

  // ── Play ────────────────────────────────────────────────
  const playSound = useCallback(
    async (trackName: string) => {
      const track = SOUNDSCAPE_TRACKS.find((t) => t.name === trackName);
      if (!track) return;

      try {
        await ensureAudioMode();

        // 1. Stop and unload any current track
        if (soundRef.current) {
          await soundRef.current.stopAsync().catch(() => {});
          await soundRef.current.unloadAsync().catch(() => {});
          soundRef.current = null;
        }

        // 2. Resolve the REAL on-device file:// URI
        //    This is the critical step that fixes Android release builds.
        const uri = await resolveAssetUri(track.source);
        console.log(`[Softly] Playing: ${trackName} → ${uri}`);

        const vol = soundVolume > 0 ? soundVolume : 0.8;

        // 3. Create and start the sound via resolved URI
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          {
            shouldPlay: true,
            isLooping: true,
            volume: vol,
          }
        );

        if (!isMountedRef.current) {
          await sound.unloadAsync();
          return;
        }

        soundRef.current = sound;
        setActiveSound(trackName);
        setIsPlayingSound(true);
      } catch (err) {
        console.warn('[Softly] playSound error:', err);
        soundRef.current = null;
        if (isMountedRef.current) {
          setActiveSound(trackName);
          setIsPlayingSound(false);
        }
      }
    },
    [soundVolume, setActiveSound, setIsPlayingSound]
  );

  // ── Toggle ──────────────────────────────────────────────
  const toggleSound = useCallback(
    async (trackName: string) => {
      if (activeSound === trackName && isPlayingSound) {
        await stopSound();
      } else {
        await playSound(trackName);
      }
    },
    [activeSound, isPlayingSound, playSound, stopSound]
  );

  // ── Sync volume ─────────────────────────────────────────
  useEffect(() => {
    if (soundRef.current && isPlayingSound) {
      const vol = soundVolume > 0 ? soundVolume : 0.8;
      soundRef.current.setVolumeAsync(vol).catch(() => {});
    }
  }, [soundVolume, isPlayingSound]);

  return {
    tracks: SOUNDSCAPE_TRACKS,
    activeSound,
    isPlayingSound,
    toggleSound,
    stopSound,
  };
}
