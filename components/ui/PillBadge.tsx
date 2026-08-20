import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface PillBadgeProps {
  label: string;
  variant?: 'sage' | 'coral' | 'lavender' | 'stone' | 'white';
  icon?: React.ReactNode;
}

export function PillBadge({ label, variant = 'white', icon }: PillBadgeProps) {
  const { bg, text, border } = (() => {
    switch (variant) {
      case 'sage':   return { bg: Colors.sage.background,     text: Colors.stone.body,  border: 'rgba(180,195,180,0.5)' };
      case 'coral':  return { bg: Colors.coral.background,    text: Colors.coral.deep,  border: 'rgba(255,183,178,0.4)' };
      case 'lavender': return { bg: Colors.lavender.background, text: Colors.lavender.deep, border: 'rgba(200,194,216,0.5)' };
      case 'stone':  return { bg: Colors.stone.ink,           text: '#FFFFFF',           border: 'transparent' };
      default:       return { bg: 'rgba(255,255,255,0.85)',   text: Colors.stone.body,  border: 'rgba(214,211,208,0.6)' };
    }
  })();

  return (
    <View style={[styles.pill, { backgroundColor: bg, borderColor: border }]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  icon: { marginRight: 5 },
  label: { fontSize: 11, fontWeight: '600' },
});
