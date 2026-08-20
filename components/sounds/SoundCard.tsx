import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Volume2, Play, Pause } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { SoundscapeTrack } from '../../hooks/useSoundscapes';
import { Colors } from '../../theme/colors';

interface SoundCardProps {
  track: SoundscapeTrack;
  isActive: boolean;
  isPlaying: boolean;
  onToggle: () => void;
}

export function SoundCard({
  track,
  isActive,
  isPlaying,
  onToggle,
}: SoundCardProps) {
  const playing = isActive && isPlaying;

  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
    onToggle();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={[styles.card, playing && styles.cardActive]}
    >
      <View style={[styles.iconWrap, playing && styles.iconWrapActive]}>
        <Volume2
          size={18}
          color={playing ? Colors.coral.deep : Colors.stone.body}
          strokeWidth={2.2}
        />
      </View>

      <View style={styles.info}>
        <View style={styles.infoRow}>
          <Text style={styles.name}>{track.name}</Text>
          <View style={[styles.moodPill, playing && styles.moodPillActive]}>
            <Text style={[styles.moodText, playing && styles.moodTextActive]}>{track.mood}</Text>
          </View>
        </View>
        <Text style={styles.desc} numberOfLines={1}>
          {track.description}
        </Text>
      </View>

      <View style={[styles.playBtn, playing && styles.playBtnActive]}>
        {playing ? (
          <Pause size={14} color="#FFFFFF" strokeWidth={2.4} />
        ) : (
          <Play size={14} color={Colors.stone.ink} strokeWidth={2.4} style={{ marginLeft: 2 }} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2DFDA',
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  cardActive: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.coral.deep,
    borderWidth: 1.5,
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F4F2EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconWrapActive: {
    backgroundColor: Colors.coral.background,
  },
  info: { flex: 1, marginRight: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 13.5, fontWeight: '700', color: Colors.stone.ink },
  moodPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
    backgroundColor: '#F4F2EE',
    borderWidth: 1,
    borderColor: '#E2DFDA',
  },
  moodPillActive: {
    backgroundColor: Colors.coral.background,
    borderColor: Colors.coral.accent,
  },
  moodText: { fontSize: 10, fontWeight: '600', color: Colors.stone.body },
  moodTextActive: { color: Colors.coral.deep, fontWeight: '700' },
  desc: { fontSize: 11.5, color: Colors.stone.muted, marginTop: 2, fontWeight: '500' },
  playBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F0EEEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnActive: {
    backgroundColor: Colors.coral.deep,
  },
});
