/**
 * Buttons: primary (green), gold, outline, ghost (text) and danger.
 *
 * @format
 */

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { usePreferences, useThemedStyles } from '../context/PreferencesContext';
import type { ThemeColors } from '../theme';
import Icon, { type IconName } from './Icon';

type Variant = 'primary' | 'gold' | 'outline' | 'ghost' | 'danger' | 'dangerOutline';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  loading?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  iconRight,
  disabled,
  loading,
  small,
  style,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const { colors } = usePreferences();

  const fg: Record<Variant, string> = {
    primary: '#FFFFFF',
    gold: '#2B1D00',
    outline: colors.text,
    ghost: colors.primary,
    danger: '#FFFFFF',
    dangerOutline: colors.danger,
  };
  const color = fg[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        small && styles.small,
        styles[variant],
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={18} color={color} /> : null}
          <Text style={[styles.label, small && styles.labelSmall, { color }]}>
            {title}
          </Text>
          {iconRight ? <Icon name={iconRight} size={18} color={color} /> : null}
        </View>
      )}
    </Pressable>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    base: {
      height: 54,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    small: { height: 40, borderRadius: 12, paddingHorizontal: 14 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    label: { fontSize: 16, fontWeight: '600' },
    labelSmall: { fontSize: 14 },
    primary: { backgroundColor: c.primary },
    gold: { backgroundColor: c.accentLight },
    outline: {
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
    },
    ghost: { backgroundColor: 'transparent' },
    danger: { backgroundColor: c.danger },
    dangerOutline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: c.danger,
    },
    disabled: { opacity: 0.45 },
    pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  });
