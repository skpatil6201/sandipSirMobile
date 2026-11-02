/**
 * Phone linking · number and Phone linking · code
 * (shown after Google sign-in, before the first transfer).
 *
 * @format
 */

import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../../components/AppButton';
import AppTextInput from '../../components/AppTextInput';
import { IconCircle, PageTitle } from '../../components/Blocks';
import OtpInput from '../../components/OtpInput';
import Screen from '../../components/Screen';
import { usePreferences } from '../../context/PreferencesContext';
import { USER } from '../../data/mock';
import type { ScreenProps } from '../../navigation/types';

export function PhoneNumberScreen({ navigation }: ScreenProps<'PhoneNumber'>) {
  const { t } = usePreferences();
  const [phone, setPhone] = useState(USER.phone);
  return (
    <Screen
      title=""
      footer={
        <AppButton
          title={t('Send code', 'Envoyer le code')}
          disabled={phone.trim().length < 8}
          onPress={() => navigation.navigate('PhoneCode')}
        />
      }
    >
      <View style={s.icon}>
        <IconCircle name="phone" size={64} />
      </View>
      <PageTitle
        title={t('Verify your phone number', 'Vérifiez votre numéro')}
        subtitle={t(
          'A phone number is needed to receive money and secure your account. We’ll text you a code to confirm it.',
          'Un numéro est nécessaire pour recevoir de l’argent et sécuriser votre compte. Nous vous enverrons un code par SMS pour le confirmer.',
        )}
      />
      <AppTextInput
        label={t('Phone number', 'Numéro de téléphone')}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        icon="phone"
      />
    </Screen>
  );
}

export function PhoneCodeScreen({ navigation }: ScreenProps<'PhoneCode'>) {
  const { t, colors } = usePreferences();
  const [code, setCode] = useState('7105');
  return (
    <Screen
      title=""
      footer={
        <>
          <AppButton
            title={t('Verify & save', 'Vérifier et enregistrer')}
            disabled={code.length < 6}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
          />
          <AppButton
            title={t('Use a different number', 'Utiliser un autre numéro')}
            variant="ghost"
            onPress={() => navigation.goBack()}
          />
        </>
      }
    >
      <View style={s.icon}>
        <IconCircle name="lock" size={64} />
      </View>
      <PageTitle
        title={t('Enter your code', 'Saisissez votre code')}
        subtitle={t(
          `We sent a 6-digit code by SMS to ${USER.phone}.`,
          `Un code à 6 chiffres a été envoyé par SMS au ${USER.phone}.`,
        )}
      />
      <OtpInput value={code} onChange={setCode} autoFocus />
      <Text style={[s.resend, { color: colors.primary }]}>{t('Resend code', 'Renvoyer le code')}</Text>
    </Screen>
  );
}

const s = StyleSheet.create({
  icon: { marginTop: 8 },
  resend: { textAlign: 'center', marginTop: 20, fontWeight: '600' },
});
