import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type MoodTag = 'Peaceful' | 'Grounded' | 'Reflective' | 'Restful' | 'Gentle';
export type BreathePattern = '4-7-8' | 'box' | 'gentle';

export interface ReflectionEntry {
  id: string;
  createdAt: string; // ISO date
  quote?: string;
  userNotes: string;
  moodTag: MoodTag;
  isFavorite: boolean;
}

export interface PeaceStats {
  totalBreathingMinutes: number;
  sessionsCompleted: number;
  estimatedSavedHours: number;
}

export interface UserProfileData {
  userName: string;
  userIntention: string;
  dailyGoalMinutes: number;
  preferredSound: string;
  windDownTime: string;
}

interface SoftlyState {
  // Onboarding & Profile State
  hasCompletedOnboarding: boolean;
  userName: string;
  userIntention: string;
  dailyGoalMinutes: number;
  preferredSound: string;
  windDownTime: string;
  setUserName: (name: string) => void;
  setUserIntention: (intention: string) => void;
  setDailyGoalMinutes: (mins: number) => void;
  completeOnboarding: (data: {
    userName: string;
    userIntention: string;
    dailyGoalMinutes: number;
    preferredSound: string;
  }) => void;
  updateProfile: (data: Partial<UserProfileData>) => void;
  resetOnboarding: () => void;

  // Reflections & Diary
  reflections: ReflectionEntry[];
  addReflection: (notes: string, moodTag?: MoodTag, quote?: string) => void;
  toggleFavorite: (id: string) => void;
  deleteReflection: (id: string) => void;

  // Mindful streak
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string;
  };
  recordDailyActivity: () => void;

  // Peace statistics
  peaceStats: PeaceStats;
  recordBreathingSession: (minutes: number) => void;

  // Breathing configuration
  breathePattern: BreathePattern;
  setBreathePattern: (pattern: BreathePattern) => void;
  hapticsEnabled: boolean;
  setHapticsEnabled: (enabled: boolean) => void;

  // Ambient soundscapes
  activeSound: string | null;
  isPlayingSound: boolean;
  soundVolume: number;
  setActiveSound: (sound: string | null) => void;
  setIsPlayingSound: (playing: boolean) => void;
  setSoundVolume: (volume: number) => void;

  // Unplug detox window
  unplugRemainingMinutes: number;
  isUnplugActive: boolean;
  toggleUnplug: () => void;

  // Night sanctuary
  amberShiftLevel: number;
  setAmberShiftLevel: (level: number) => void;
  sleepGuardEnabled: boolean;
  toggleSleepGuard: () => void;
}

const INITIAL_REFLECTIONS: ReflectionEntry[] = [
  {
    id: 'ref-1',
    createdAt: new Date().toISOString(),
    quote: 'Notice the way the light hits the floorboards. You do not have to conquer today; simply be in it.',
    userNotes: 'Took a morning walk before checking notifications. The cold crisp air cleared my head.',
    moodTag: 'Grounded',
    isFavorite: true,
  },
  {
    id: 'ref-2',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    quote: 'Rest is not something we earn after exhaustion; it is the space where life gently continues.',
    userNotes: 'Brewed a cup of chamomile tea and listened to the rain without touching my phone.',
    moodTag: 'Peaceful',
    isFavorite: false,
  },
  {
    id: 'ref-3',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    quote: 'Step away from the urgency of others. Your peace is your only quiet sanctuary.',
    userNotes: 'Finished 5 minutes of 4-7-8 breathing before bed. Fell asleep easily.',
    moodTag: 'Restful',
    isFavorite: true,
  },
];

export const useSoftlyStore = create<SoftlyState>()(
  persist(
    (set, get) => ({
      // Onboarding & Profile
      hasCompletedOnboarding: false,
      userName: '',
      userIntention: 'Stillness & Stress Relief',
      dailyGoalMinutes: 10,
      preferredSound: 'Rain on Cedar',
      windDownTime: '22:30',

      setUserName: (name) => set({ userName: name.trim() }),
      setUserIntention: (intention) => set({ userIntention: intention }),
      setDailyGoalMinutes: (mins) => set({ dailyGoalMinutes: mins }),

      completeOnboarding: (data) => {
        set({
          hasCompletedOnboarding: true,
          userName: data.userName.trim() || 'Friend',
          userIntention: data.userIntention,
          dailyGoalMinutes: data.dailyGoalMinutes,
          preferredSound: data.preferredSound,
          activeSound: data.preferredSound,
        });
        get().recordDailyActivity();
      },

      updateProfile: (data) =>
        set((state) => ({
          ...state,
          ...data,
          userName: data.userName !== undefined ? data.userName.trim() : state.userName,
        })),

      resetOnboarding: () =>
        set({
          hasCompletedOnboarding: false,
          userName: '',
        }),

      reflections: INITIAL_REFLECTIONS,
      addReflection: (notes, moodTag = 'Peaceful', quote) => {
        const newEntry: ReflectionEntry = {
          id: `ref-${Date.now()}`,
          createdAt: new Date().toISOString(),
          userNotes: notes,
          moodTag,
          quote,
          isFavorite: false,
        };
        set((state) => ({
          reflections: [newEntry, ...state.reflections],
        }));
        get().recordDailyActivity();
      },
      toggleFavorite: (id) =>
        set((state) => ({
          reflections: state.reflections.map((item) =>
            item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
          ),
        })),
      deleteReflection: (id) =>
        set((state) => ({
          reflections: state.reflections.filter((item) => item.id !== id),
        })),

      streak: {
        current: 14,
        longest: 21,
        lastActiveDate: new Date().toISOString().split('T')[0],
      },
      recordDailyActivity: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastActiveDate, current, longest } = get().streak;
        if (lastActiveDate === today) return;

        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const isConsecutive = lastActiveDate === yesterday;
        const newCurrent = isConsecutive ? current + 1 : 1;
        const newLongest = Math.max(longest, newCurrent);

        set({
          streak: {
            current: newCurrent,
            longest: newLongest,
            lastActiveDate: today,
          },
        });
      },

      peaceStats: {
        totalBreathingMinutes: 48,
        sessionsCompleted: 16,
        estimatedSavedHours: 4.2,
      },
      recordBreathingSession: (minutes) => {
        set((state) => ({
          peaceStats: {
            totalBreathingMinutes: state.peaceStats.totalBreathingMinutes + minutes,
            sessionsCompleted: state.peaceStats.sessionsCompleted + 1,
            estimatedSavedHours: +(state.peaceStats.estimatedSavedHours + minutes * 0.08).toFixed(1),
          },
        }));
        get().recordDailyActivity();
      },

      breathePattern: '4-7-8',
      setBreathePattern: (pattern) => set({ breathePattern: pattern }),
      hapticsEnabled: true,
      setHapticsEnabled: (enabled) => set({ hapticsEnabled: enabled }),

      activeSound: 'Rain on Cedar',
      isPlayingSound: false,
      soundVolume: 0.7,
      setActiveSound: (sound) => set({ activeSound: sound }),
      setIsPlayingSound: (playing) => set({ isPlayingSound: playing }),
      setSoundVolume: (volume) => set({ soundVolume: volume }),

      unplugRemainingMinutes: 45,
      isUnplugActive: true,
      toggleUnplug: () => set((state) => ({ isUnplugActive: !state.isUnplugActive })),

      amberShiftLevel: 85,
      setAmberShiftLevel: (level) => set({ amberShiftLevel: level }),
      sleepGuardEnabled: true,
      toggleSleepGuard: () => set((state) => ({ sleepGuardEnabled: !state.sleepGuardEnabled })),
    }),
    {
      name: 'softly-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
