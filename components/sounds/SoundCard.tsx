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
        <Volume2 size={18} color={playing ? Colors.coral.active : Colors.stone.body} />
      </View>

      <View style={styles.info}>
        <View style={styles.infoRow}>
          <Text style={styles.name}>{track.name}</Text>
          <View style={styles.moodPill}>
            <Text style={styles.moodText}>{track.mood}</Text>
          </View>
        </View>
        <Text style={styles.desc} numberOfLines={1}>
          {track.description}
        </Text>
      </View>

      <View style={[styles.playBtn, playing && styles.playBtnActive]}>
        {playing ? (
          <Pause size={14} color={Colors.stone.ink} />
        ) : (
          <Play size={14} color={Colors.stone.ink} style={{ marginLeft: 2 }} />
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
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(214, 211, 208, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    marginBottom: 10,
  },
  cardActive: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.coral.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F2F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconWrapActive: { backgroundColor: Colors.coral.background },
  info: { flex: 1, marginRight: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 13, fontWeight: '600', color: Colors.stone.ink },
  moodPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#F3F2F0',
    borderWidth: 1,
    borderColor: 'rgba(214, 211, 208, 0.5)',
  },
  moodText: { fontSize: 10, color: Colors.stone.body },
  desc: { fontSize: 11, color: Colors.stone.muted, marginTop: 2 },
  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(168, 162, 158, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnActive: { backgroundColor: Colors.coral.accent },
});
