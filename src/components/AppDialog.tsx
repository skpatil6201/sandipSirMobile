/**
 * Centered pop-up used for confirmations and success messages.
 *
 * @format
 */

import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { usePreferences, useThemedStyles } from '../context/PreferencesContext';
import { typography, type ThemeColors } from '../theme';
import AppButton from './AppButton';
import Icon, { type IconName } from './Icon';

type Action = { label: string; onPress: () => void };

type Props = {
  visible: boolean;
  tone?: 'success' | 'danger' | 'neutral';
  icon?: IconName;
  title: string;
  message?: string;
  primary: Action;
  secondary?: Action;
  onClose?: () => void;
};

export default function AppDialog({
  visible,
  tone = 'success',
  icon,
  title,
  message,
  primary,
  secondary,
  onClose,
}: Props) {
  const s = useThemedStyles(makeStyles);
  const { colors } = usePreferences();
  const fg = tone === 'success' ? colors.primary : tone === 'danger' ? colors.danger : colors.accentDark;
  const bg =
    tone === 'success'
      ? colors.primaryTintStrong
      : tone === 'danger'
      ? 'rgba(214,69,69,0.14)'
      : colors.accentTintStrong;
  const iconName: IconName = icon ?? (tone === 'success' ? 'check' : tone === 'danger' ? 'alert' : 'info');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose}>
        <Pressable style={s.card} onPress={() => {}}>
          <View style={[s.iconWrap, { backgroundColor: bg }]}>
            <Icon name={iconName} size={30} color={fg} strokeWidth={2.6} />
          </View>
          <Text style={s.title}>{title}</Text>
          {message ? <Text style={s.message}>{message}</Text> : null}
          <View style={s.actions}>
            <AppButton
              title={primary.label}
              onPress={primary.onPress}
              variant={tone === 'danger' ? 'danger' : 'primary'}
            />
            {secondary ? (
              <AppButton title={secondary.label} onPress={secondary.onPress} variant="outline" />
            ) : null}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: c.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    card: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: c.surface,
      borderRadius: 28,
      padding: 24,
      alignItems: 'center',
    },
    iconWrap: {
      width: 68,
      height: 68,
      borderRadius: 34,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    title: { color: c.text, ...typography.heading, fontSize: 20, textAlign: 'center' },
    message: {
      color: c.textMuted,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
      marginTop: 8,
    },
    actions: { alignSelf: 'stretch', gap: 10, marginTop: 22 },
  });
