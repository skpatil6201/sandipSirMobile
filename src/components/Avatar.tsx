/**
 * Initials avatar (green or gold tint, as in Figma).
 *
 * @format
 */

import { StyleSheet, Text, View } from 'react-native';
import { usePreferences } from '../context/PreferencesContext';

type Props = {
  initials: string;
  tone?: 'green' | 'gold' | 'solid';
  size?: number;
};

export default function Avatar({ initials, tone = 'green', size = 44 }: Props) {
  const { colors } = usePreferences();
  const bg =
    tone === 'solid' ? colors.primary : tone === 'gold' ? colors.accentTintStrong : colors.primaryTintStrong;
  const fg = tone === 'solid' ? '#FFFFFF' : tone === 'gold' ? colors.accentDark : colors.primary;
  return (
    <View
      style={[
        s.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
      ]}
    >
      <Text style={[s.initials, { color: fg, fontSize: Math.round(size * 0.34) }]}>
        {initials}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
  initials: { fontWeight: '700' },
});
