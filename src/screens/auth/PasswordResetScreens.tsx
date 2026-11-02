/**
 * Forgot password → Check your email → New password → Password updated.
 *
 * @format
 */

import { StyleSheet, View } from 'react-native';
import AppButton from '../../components/AppButton';
import AppTextInput from '../../components/AppTextInput';
import { IconCircle, PageTitle, ResultHero } from '../../components/Blocks';
import LinkLine from '../../components/LinkLine';
import Screen from '../../components/Screen';
import { usePreferences } from '../../context/PreferencesContext';
import type { ScreenProps } from '../../navigation/types';

export function ForgotPasswordScreen({ navigation }: ScreenProps<'ForgotPassword'>) {
  const { t } = usePreferences();
  return (
    <Screen title="">
      <View style={s.icon}>
        <IconCircle name="key" size={64} />
      </View>
      <PageTitle
        title={t('Forgot your password?', 'Mot de passe oublié ?')}
        subtitle={t(
          'Enter the email linked to your Djawei account. We’ll send you a link to reset your password.',
          'Saisissez l’e-mail associé à votre compte Djawei. Nous vous enverrons un lien pour réinitialiser votre mot de passe.',
        )}
      />
      <View style={s.form}>
        <AppTextInput
          label={t('Email address', 'Adresse e-mail')}
          placeholder={t('you@example.com', 'vous@example.com')}
          keyboardType="email-address"
          autoCapitalize="none"
          icon="mail"
        />
        <AppButton title={t('Send reset link', 'Envoyer le lien')} onPress={() => navigation.navigate('CheckEmail')} />
        <LinkLine
          text={t('Remember your password?', 'Vous vous en souvenez ?')}
          action={t('Log in', 'Se connecter')}
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </Screen>
  );
}

export function CheckEmailScreen({ navigation }: ScreenProps<'CheckEmail'>) {
  const { t } = usePreferences();
  return (
    <Screen
      title=""
      footer={
        <>
          <AppButton
            title={t('Open email app', 'Ouvrir l’app e-mail')}
            icon="mail"
            onPress={() => navigation.navigate('NewPassword')}
          />
          <LinkLine
            text={t('Wrong email?', 'Mauvaise adresse ?')}
            action={t('Change it', 'Modifier')}
            onPress={() => navigation.goBack()}
          />
        </>
      }
    >
      <ResultHero
        tone="success"
        icon="mail"
        title={t('Check your email', 'Vérifiez vos e-mails')}
        message={t(
          'We sent a password reset link to you@example.com. It expires in 30 minutes.',
          'Nous avons envoyé un lien de réinitialisation à vous@example.com. Il expire dans 30 minutes.',
        )}
      />
    </Screen>
  );
}

export function NewPasswordScreen({ navigation }: ScreenProps<'NewPassword'>) {
  const { t } = usePreferences();
  return (
    <Screen title="">
      <View style={s.icon}>
        <IconCircle name="lock" size={64} />
      </View>
      <PageTitle
        title={t('Create a new password', 'Nouveau mot de passe')}
        subtitle={t(
          'Use at least 8 characters, with a number and a symbol.',
          'Au moins 8 caractères, avec un chiffre et un symbole.',
        )}
      />
      <View style={s.form}>
        <AppTextInput label={t('New password', 'Nouveau mot de passe')} defaultValue="Djawei#2026" secure />
        <AppTextInput label={t('Confirm new password', 'Confirmer le mot de passe')} defaultValue="Djawei#2026" secure />
        <AppButton
          title={t('Reset password', 'Réinitialiser')}
          onPress={() => navigation.navigate('PasswordUpdated')}
        />
        <LinkLine
          text={t('Remember your password?', 'Vous vous en souvenez ?')}
          action={t('Log in', 'Se connecter')}
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </Screen>
  );
}

export function PasswordUpdatedScreen({ navigation }: ScreenProps<'PasswordUpdated'>) {
  const { t } = usePreferences();
  return (
    <Screen
      back={false}
      footer={
        <AppButton
          title={t('Back to log in', 'Retour à la connexion')}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
        />
      }
      contentStyle={s.center}
    >
      <ResultHero
        title={t('Password updated', 'Mot de passe modifié')}
        message={t(
          'Your password has been reset. Log in with your new password.',
          'Votre mot de passe a été réinitialisé. Connectez-vous avec le nouveau.',
        )}
      />
    </Screen>
  );
}

const s = StyleSheet.create({
  icon: { marginTop: 8 },
  form: { gap: 14 },
  center: { flexGrow: 1, justifyContent: 'center' },
});
