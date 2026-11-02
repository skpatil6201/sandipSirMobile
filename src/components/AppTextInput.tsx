/**
 * Labelled text field with optional show/hide toggle, prefix and error.
 *
 * @format
 */

import { useState, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { usePreferences, useThemedStyles } from '../context/PreferencesContext';
import type { ThemeColors } from '../theme';
import Icon, { type IconName } from './Icon';

type Props = TextInputProps & {
  label?: string;
  secure?: boolean;
  error?: string;
  hint?: string;
  icon?: IconName;
  prefix?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function AppTextInput({
  label,
  secure,
  error,
  hint,
  icon,
  prefix,
  style,
  ...rest
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const { colors, t } = usePreferences();
  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.field,
          focused && styles.focused,
          error ? styles.errorField : null,
        ]}
      >
        {icon ? <Icon name={icon} size={18} color={colors.textMuted} /> : null}
        {prefix}
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          secureTextEntry={secure && hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {secure ? (
          <Pressable onPress={() => setHidden(h => !h)} hitSlop={8}>
            <Text style={styles.show}>
              {hidden ? t('Show', 'Voir') : t('Hide', 'Masquer')}
            </Text>
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrap: { gap: 6 },
    label: { color: c.text, fontSize: 13, fontWeight: '600' },
    field: {
      minHeight: 52,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    focused: { borderColor: c.primary },
    errorField: { borderColor: c.danger },
    input: { flex: 1, color: c.text, fontSize: 15, paddingVertical: 12 },
    show: { color: c.primary, fontWeight: '600', fontSize: 13 },
    error: { color: c.danger, fontSize: 12 },
    hint: { color: c.textMuted, fontSize: 12 },
  });
