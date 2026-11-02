/**
 * OTP code (SMS verification after sign up).
 *
 * @format
 */

import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../../components/AppButton';
import { InfoNote, PageTitle } from '../../components/Blocks';
import OtpInput from '../../components/OtpInput';
import Screen from '../../components/Screen';
import { usePreferences } from '../../context/PreferencesContext';
import { USER } from '../../data/mock';
import type { ScreenProps } from '../../navigation/types';

export default function OtpScreen({ navigation }: ScreenProps<'Otp'>) {
  const { t, colors } = usePreferences();
  const [code, setCode] = useState('482');
  const [seconds, setSeconds] = useState(24);

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }
    const id = setTimeout(() => setSeconds(x => x - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  return (
    <Screen
      title={t('Verification', 'Vérification')}
      footer={
        <AppButton
          title={t('Verify', 'Vérifier')}
          disabled={code.length < 6}
          onPress={() => navigation.navigate('KycPersonal')}
        />
      }
    >
      <PageTitle
        title={t('Enter your code', 'Saisissez votre code')}
        subtitle={t(
          `We sent a 6-digit code by SMS to ${USER.phone}.`,
          `Un code à 6 chiffres a été envoyé par SMS au ${USER.phone}.`,
        )}
      />
      <OtpInput value={code} onChange={setCode} autoFocus />
      <Text
        style={[s.resend, { color: seconds > 0 ? colors.textMuted : colors.primary }]}
        onPress={() => seconds <= 0 && setSeconds(24)}
      >
        {seconds > 0
          ? t(`Resend code in ${seconds}s`, `Renvoyer le code dans ${seconds} s`)
          : t('Resend code', 'Renvoyer le code')}
      </Text>
      <View style={s.note}>
        <InfoNote
          text={t(
            "Didn't get it? Check your signal, then try resending. Standard carrier rates may apply.",
            'Rien reçu ? Vérifiez le réseau, puis renvoyez le code. Les tarifs habituels de votre opérateur peuvent s’appliquer.',
          )}
        />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  resend: { textAlign: 'center', marginTop: 20, fontWeight: '600' },
  note: { marginTop: 24 },
});
