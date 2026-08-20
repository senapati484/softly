# 🌿 Softly — Mindful Living & Digital Sanctuary

> **A quiet, unhurried space for intentional pauses, daily breathwork, and slow living.**  
> Built with Expo, React Native, Reanimated, and local-first device storage.

---

## 📱 App Highlights

- **🌬️ Quiet Room (Breathe)**: Structured 4-7-8, Box, and Gentle breathing rituals with smooth animated expanding circles, live cycle statistics, and tactile haptic transitions.
- **📖 Morning Pebble (Daily Notes & Ambient Soundscapes)**: Daily curated reflections, offline looping nature audio (*Rain on Cedar*, *Forest Wind*, *Old Library*), and private micro-journaling with mood tagging.
- **🌙 Night Sanctuary (Dusk Shift & Peace Dashboard)**: Blue-light candle amber warmth slider, screentime detox balance metrics, and bedtime wind-down principle.
- **🏝️ Floating Island Tab Dock**: Ultra-clean floating ivory capsule navigation with dynamic section-themed active highlights (Coral, Sage, Lavender) and live audio playing indicators.
- **🔒 100% On-Device Privacy**: 3-step mindful onboarding wizard and user profile preferences stored privately on the device using Zustand & AsyncStorage.

---

## 🎨 Design System (`/ui-ux-pro-max`)

Softly is designed with an organic, calm, and tactile visual identity inspired by sunlit cedar rooms and paper notebooks:

| Token | Hex / Value | Usage |
|---|---|---|
| **Canvas** | `#FDFCF8` | Primary background canvas |
| **Card Surface** | `#F8F6F0` | Gentle elevated containers |
| **Sage** | `#E8EFE8` / `#2F522F` | Reflections, journal cards, mindful streak |
| **Coral** | `#FFE4E1` / `#C04B43` | Breathwork, active audio highlights, primary accents |
| **Lavender** | `#EFEDF4` / `#4E4270` | Night sanctuary, dusk shift, evening rituals |
| **Stone Ink** | `#292524` | Primary high-contrast typography |

---

## 🛠️ Technology Stack

- **Framework**: [Expo SDK 52](https://expo.dev) with [Expo Router v4](https://docs.expo.dev/router/introduction/)
- **Core**: [React Native 0.76](https://reactnative.dev)
- **Animations**: [React Native Reanimated 3](https://docs.swmansion.com/react-native-reanimated/)
- **State & Local Storage**: [Zustand 5](https://github.com/pmndrs/zustand) with `@react-native-async-storage/async-storage`
- **Audio & Haptics**: `expo-av` & `expo-haptics`
- **Icons**: `lucide-react-native`
- **Styling**: Vanilla React Native StyleSheet + NativeWind Tailwind CSS

---

## 📂 Project Architecture

```
softly-mobile/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Tab router using CustomTabBar dock
│   │   ├── index.tsx        # Tab 1: Quiet Room (Breathe & Unplug)
│   │   ├── reflections.tsx  # Tab 2: Morning Pebble (Journal & Sounds)
│   │   └── sanctuary.tsx    # Tab 3: Night Sanctuary (Dusk & Peace)
│   ├── modal/
│   │   ├── new-entry.tsx    # New slow reflection entry modal
│   │   └── profile.tsx      # Personal profile & sanctuary settings
│   ├── onboarding.tsx       # 3-step first-time mindful setup wizard
│   └── _layout.tsx          # Root layout with automatic onboarding gate
├── components/
│   ├── breathe/             # Breathing circle & pattern selector
│   ├── navigation/          # Floating CustomTabBar dock
│   ├── sanctuary/           # DuskShiftCard & PeaceDashboard
│   ├── sounds/              # SoundCard nature audio player
│   └── ui/                  # GrainTexture, PillBadge, Card
├── hooks/
│   ├── useBreatheEngine.ts  # Drift-free breathwork state & timer engine
│   └── useSoundscapes.ts    # Persistent background audio manager
├── store/
│   └── useSoftlyStore.ts    # Zustand persisted store (AsyncStorage)
└── theme/
    └── colors.ts            # Global mindful color palette
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo Go app on iOS/Android or Xcode / Android Studio simulator

### Installation

```bash
# Clone the repository
git clone https://github.com/senapati484/softly.git
cd softly

# Install dependencies
npm install

# Start the Expo development server
npm run dev
```

### Running on Devices
- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Scan the QR code with **Expo Go** on your physical device

---

## 📄 License
MIT © [Sayan Senapati](https://github.com/senapati484)
