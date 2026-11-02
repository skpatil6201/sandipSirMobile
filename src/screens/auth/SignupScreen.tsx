/**
 * Sign up.
 *
 * @format
 */

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AppButton from '../../components/AppButton';
import AppTextInput from '../../components/AppTextInput';
import { CheckRow, PageTitle } from '../../components/Blocks';
import LinkLine, { OrDivider } from '../../components/LinkLine';
import Screen from '../../components/Screen';
import { usePreferences } from '../../context/PreferencesContext';
import type { ScreenProps } from '../../navigation/types';

export default function SignupScreen({ navigation }: ScreenProps<'Signup'>) {
  const { t } = usePreferences();
  const [agree, setAgree] = useState(true);

  return (
    <Screen title={t('Create account', 'Créer un compte')}>
      <PageTitle
        title={t('Create your account', 'Créez votre compte')}
        subtitle={t(
          "It takes about two minutes. You'll verify your identity before your first transfer.",
          'Deux minutes suffisent. Vous vérifierez votre identité avant votre premier transfert.',
        )}
      />
      <View style={s.form}>
        <AppTextInput label={t('Full name', 'Nom complet')} placeholder={t('As shown on your ID', 'Comme sur votre pièce d’identité')} />
        <AppTextInput
          label={t('Email address', 'Adresse e-mail')}
          placeholder={t('you@example.com', 'vous@example.com')}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <AppTextInput label={t('Phone number', 'Numéro de téléphone')} placeholder="+225 07 12 34 56 78" keyboardType="phone-pad" />
        <AppTextInput label={t('Password', 'Mot de passe')} placeholder={t('At least 8 characters', 'Au moins 8 caractères')} secure />
        <AppTextInput
          label={t('Confirm password', 'Confirmer le mot de passe')}
          placeholder={t('Re-enter your password', 'Ressaisissez votre mot de passe')}
          secure
        />
        <CheckRow
          checked={agree}
          onChange={setAgree}
          label={t(
            'I agree to the Terms of Service and Privacy Policy.',
            'J’accepte les conditions d’utilisation et la politique de confidentialité.',
          )}
        />
        <AppButton title={t('Create account', 'Créer un compte')} disabled={!agree} onPress={() => navigation.navigate('Otp')} />
        <OrDivider label={t('or', 'ou')} />
        <AppButton
          title={t('Sign up with Google', 'S’inscrire avec Google')}
          variant="outline"
          icon="globe"
          onPress={() => navigation.navigate('PhoneNumber')}
        />
        <LinkLine
          text={t('Already have an account?', 'Déjà un compte ?')}
          action={t('Sign in', 'Se connecter')}
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({ form: { gap: 14 } });
