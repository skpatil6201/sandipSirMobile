/**
 * Login.
 *
 * @format
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppButton from '../../components/AppButton';
import AppTextInput from '../../components/AppTextInput';
import { PageTitle } from '../../components/Blocks';
import LinkLine, { OrDivider } from '../../components/LinkLine';
import Logo from '../../components/Logo';
import Screen from '../../components/Screen';
import { usePreferences } from '../../context/PreferencesContext';
import type { ScreenProps } from '../../navigation/types';

export default function LoginScreen({ navigation }: ScreenProps<'Login'>) {
  const { t, colors } = usePreferences();
  const signIn = () => navigation.reset({ index: 0, routes: [{ name: 'Main' }] });

  return (
    <Screen>
      <View style={s.logo}>
        <Logo size={56} />
      </View>
      <PageTitle
        title={t('Welcome back', 'Bon retour parmi nous')}
        subtitle={t(
          'Sign in to your Djawei account to send money to any bank or mobile money account, and track transfers.',
          'Connectez-vous à Djawei pour envoyer de l’argent vers un compte bancaire ou mobile money et suivre vos transferts.',
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
        <AppTextInput
          label={t('Password', 'Mot de passe')}
          placeholder={t('Enter your password', 'Saisissez votre mot de passe')}
          secure
          icon="lock"
        />
        <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={s.forgot}>
          <Text style={[s.forgotText, { color: colors.primary }]}>
            {t('Forgot password?', 'Mot de passe oublié ?')}
          </Text>
        </Pressable>
        <AppButton title={t('Sign in', 'Se connecter')} onPress={signIn} />
        <OrDivider label={t('or', 'ou')} />
        <AppButton
          title={t('Sign in with Google', 'Connexion avec Google')}
          variant="outline"
          icon="globe"
          onPress={() => navigation.navigate('PhoneNumber')}
        />
        <LinkLine
          text={t("Don't have an account?", 'Pas encore de compte ?')}
          action={t('Create one', 'S’inscrire')}
          onPress={() => navigation.navigate('Signup')}
        />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  logo: { marginTop: 16, marginBottom: 8 },
  form: { gap: 14 },
  forgot: { alignSelf: 'flex-end', marginTop: -4 },
  forgotText: { fontWeight: '600', fontSize: 13 },
});
