/**
 * App unlock: Fingerprint (→ Success) and PIN keypad.
 *
 * @format
 */

import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppButton from '../../components/AppButton';
import Avatar from '../../components/Avatar';
import Icon from '../../components/Icon';
import Logo from '../../components/Logo';
import { usePreferences, useThemedStyles } from '../../context/PreferencesContext';
import { USER } from '../../data/mock';
import type { ScreenProps } from '../../navigation/types';
import { typography, type ThemeColors } from '../../theme';

function Brand() {
  const s = useThemedStyles(makeStyles);
  return (
    <View style={s.brand}>
      <Logo size={32} />
      <Text style={s.brandText}>Djawei</Text>
    </View>
  );
}

export function UnlockFingerprintScreen({ navigation }: ScreenProps<'UnlockFingerprint'>) {
  const s = useThemedStyles(makeStyles);
  const { t, colors } = usePreferences();
  const insets = useSafeAreaInsets();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!ok) {
      return;
    }
    const id = setTimeout(() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] }), 1200);
    return () => clearTimeout(id);
  }, [ok, navigation]);

  return (
    <View style={[s.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
      <Brand />
      <View style={s.center}>
        <Avatar initials="A" size={72} tone="solid" />
        <Text style={s.hello}>{t('Welcome back,', 'Bon retour,')}</Text>
        <Text style={s.name}>{USER.firstName}</Text>

        <Pressable onPress={() => setOk(true)} style={[s.sensor, ok && s.sensorOk]}>
          <Icon name={ok ? 'check' : 'fp'} size={56} color={ok ? '#FFFFFF' : colors.primary} strokeWidth={ok ? 3 : 1.8} />
        </Pressable>

        <Text style={s.title}>
          {ok
            ? t('Fingerprint recognised', 'Empreinte reconnue')
            : t('Touch the sensor to unlock', 'Touchez le capteur pour déverrouiller')}
        </Text>
        <Text style={s.sub}>
          {ok
            ? t('Unlocking your account…', 'Déverrouillage de votre compte…')
            : t('Use your fingerprint to open Djawei securely.', 'Utilisez votre empreinte pour ouvrir Djawei en toute sécurité.')}
        </Text>
      </View>
      {!ok ? (
        <View style={s.actions}>
          <AppButton
            title={t('Use PIN instead', 'Utiliser le code PIN')}
            variant="outline"
            onPress={() => navigation.navigate('UnlockPin')}
          />
          <Text style={s.switch} onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}>
            {t(`Not ${USER.firstName}? `, `Pas ${USER.firstName} ? `)}
            <Text style={s.link}>
              {t('Switch account', 'Changer de compte')}
            </Text>
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

export function UnlockPinScreen({ navigation }: ScreenProps<'UnlockPin'>) {
  const s = useThemedStyles(makeStyles);
  const { t, colors } = usePreferences();
  const insets = useSafeAreaInsets();
  const [pin, setPin] = useState('');

  const press = (k: string) => {
    if (k === 'del') {
      setPin(p => p.slice(0, -1));
      return;
    }
    if (!k) {
      return;
    }
    const next = (pin + k).slice(0, 4);
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] }), 250);
    }
  };

  return (
    <View style={[s.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
      <Brand />
      <View style={s.pinHead}>
        <Avatar initials="A" size={64} tone="solid" />
        <Text style={s.title}>{t('Enter your PIN', 'Saisissez votre code PIN')}</Text>
        <Text style={s.sub}>{t('Enter your 4-digit Djawei PIN', 'Code à 4 chiffres Djawei')}</Text>
        <View style={s.dots}>
          {[0, 1, 2, 3].map(i => (
            <View key={i} style={[s.dot, i < pin.length && s.dotOn]} />
          ))}
        </View>
      </View>
      <View style={s.pad}>
        {KEYS.map((k, i) => (
          <Pressable
            key={i}
            onPress={() => press(k)}
            disabled={!k}
            style={({ pressed }) => [s.key, !k && s.keyEmpty, pressed && k ? s.keyPressed : null]}
          >
            {k === 'del' ? (
              <Icon name="del" size={26} color={colors.text} />
            ) : (
              <Text style={s.keyText}>{k}</Text>
            )}
          </Pressable>
        ))}
      </View>
      <Text style={[s.switch, s.link]} onPress={() => navigation.navigate('ForgotPassword')}>
        {t('Forgot PIN?', 'Code PIN oublié ?')}
      </Text>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.background, paddingHorizontal: 24 },
    brand: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'center' },
    brandText: { color: c.text, fontSize: 18, fontWeight: '800' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    hello: { color: c.textMuted, fontSize: 15, marginTop: 14 },
    name: { color: c.text, ...typography.title },
    sensor: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 2,
      borderColor: c.primary,
      backgroundColor: c.primaryTint,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 36,
    },
    sensorOk: { backgroundColor: c.primary },
    title: { color: c.text, ...typography.heading, textAlign: 'center', marginTop: 12 },
    sub: { color: c.textMuted, fontSize: 14, textAlign: 'center', marginTop: 6 },
    actions: { gap: 16 },
    switch: { color: c.textMuted, textAlign: 'center', fontSize: 14 },
    pinHead: { alignItems: 'center', marginTop: 32 },
    dots: { flexDirection: 'row', gap: 16, marginTop: 24 },
    dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: c.border },
    dotOn: { backgroundColor: c.primary, borderColor: c.primary },
    pad: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignContent: 'center',
      gap: 18,
      paddingHorizontal: 12,
    },
    key: {
      width: 74,
      height: 74,
      borderRadius: 37,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    keyEmpty: { backgroundColor: 'transparent', borderWidth: 0 },
    keyPressed: { backgroundColor: c.primaryTintStrong },
    keyText: { color: c.text, fontSize: 26, fontWeight: '600' },
    link: { color: c.primary, fontWeight: '700' },
  });
