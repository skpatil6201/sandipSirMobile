/**
 * Profile (tab) with preferences, settings rows and Sign out · Confirm.
 *
 * @format
 */

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppDialog from '../../components/AppDialog';
import Avatar from '../../components/Avatar';
import { Badge, Card, ListRow, Segmented, SectionHeader, ToggleRow } from '../../components/Blocks';
import Icon from '../../components/Icon';
import Screen from '../../components/Screen';
import { usePreferences, useThemedStyles } from '../../context/PreferencesContext';
import { USER } from '../../data/mock';
import type { RootStackParamList } from '../../navigation/types';
import type { ThemeColors } from '../../theme';
import { layout } from '../../theme/layout';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const s = useThemedStyles(makeStyles);
  const { t, colors, isDark, setThemeMode, language, setLanguage } = usePreferences();
  const navigation = useNavigation<Nav>();
  const [biometric, setBiometric] = useState(true);
  const [signOut, setSignOut] = useState(false);
  const go = (r: keyof RootStackParamList) => () => navigation.navigate(r as never);

  return (
    <Screen title={t('Profile', 'Profil')} back={false} tabs>
      <Card style={s.user}>
        <Avatar initials={USER.initials} size={60} />
        <View style={layout.flex1}>
          <Text style={s.name}>{USER.name}</Text>
          <Text style={s.sub}>{USER.email}</Text>
          <Text style={s.sub}>{USER.phoneMasked}</Text>
        </View>
        <Pressable onPress={go('PersonalDetails')} hitSlop={8}>
          <Icon name="edit" size={20} color={colors.primary} />
        </Pressable>
      </Card>

      <Pressable style={s.kyc} onPress={go('KycPersonal')}>
        <Icon name="shield" size={22} color={colors.accentDark} />
        <View style={layout.flex1}>
          <View style={s.kycHead}>
            <Text style={s.kycTitle}>{t('Identity verification', 'Vérification d’identité')}</Text>
            <Badge label={t('Action needed', 'Action requise')} tone="gold" />
          </View>
          <Text style={s.sub}>{t('Verify your identity to unlock transfers.', 'Vérifiez votre identité pour activer les transferts.')}</Text>
        </View>
        <Icon name="chevR" size={18} color={colors.textMuted} />
      </Pressable>

      <SectionHeader title={t('Preferences', 'Préférences')} />
      <Card style={s.prefs}>
        <View style={s.prefRow}>
          <Text style={s.prefLabel}>{t('Appearance', 'Apparence')}</Text>
          <Segmented
            style={s.seg}
            value={isDark ? 'dark' : 'light'}
            onChange={v => setThemeMode(v)}
            options={[
              { key: 'light', label: t('Light', 'Clair'), icon: 'sun' },
              { key: 'dark', label: t('Dark', 'Sombre'), icon: 'moon' },
            ]}
          />
        </View>
        <View style={s.prefRow}>
          <Text style={s.prefLabel}>{t('Language', 'Langue')}</Text>
          <Segmented
            style={s.seg}
            value={language}
            onChange={setLanguage}
            options={[
              { key: 'en', label: 'EN' },
              { key: 'fr', label: 'FR' },
            ]}
          />
        </View>
      </Card>

      <SectionHeader title={t('Account', 'Compte')} />
      <Card>
        <ListRow icon="user" title={t('Personal details', 'Informations personnelles')} onPress={go('PersonalDetails')} />
        <ListRow icon="users" title={t('Saved recipients', 'Bénéficiaires enregistrés')} onPress={go('SavedRecipients')} />
        <ListRow icon="qr" title={t('My QR code', 'Mon QR code')} onPress={go('MyQr')} />
        <ListRow icon="card" title={t('Payment methods', 'Moyens de paiement')} onPress={go('PaymentMethods')} />
        <ListRow icon="bank" title={t('Receiving accounts', 'Comptes de réception')} onPress={go('ReceivingAccounts')} />
        <ListRow icon="gift" tone="gold" title={t('Refer & earn', 'Parrainage')} onPress={go('ReferEarn')} />
        <ListRow icon="chart" title={t('Transfer limits', 'Plafonds de transfert')} value={t('2M XOF / mo', '2 M XOF / mois')} onPress={go('TransferLimits')} last />
      </Card>

      <SectionHeader title={t('Security', 'Sécurité')} />
      <Card>
        <ToggleRow icon="fp" title={t('Biometric unlock', 'Déverrouillage biométrique')} value={biometric} onChange={setBiometric} />
        <ListRow icon="lock" title={t('App unlock preview', 'Aperçu du déverrouillage')} onPress={go('UnlockFingerprint')} />
        <ListRow icon="bell" title={t('Transaction alerts', 'Alertes de transaction')} onPress={go('TransactionAlerts')} />
        <ListRow icon="key" title={t('Change password', 'Changer le mot de passe')} onPress={go('ChangePassword')} />
        <ListRow icon="mobile" title={t('Trusted devices', 'Appareils de confiance')} onPress={go('TrustedDevices')} last />
      </Card>

      <SectionHeader title={t('Support & legal', 'Aide et mentions légales')} />
      <Card>
        <ListRow icon="help" title={t('Help centre', 'Centre d’aide')} onPress={go('HelpCentre')} />
        <ListRow icon="chat" title={t('Contact support', 'Contacter l’assistance')} onPress={go('ContactSupport')} />
        <ListRow icon="file" title={t('Terms of Service', 'Conditions d’utilisation')} onPress={go('Terms')} />
        <ListRow icon="shield" title={t('Privacy Policy', 'Politique de confidentialité')} onPress={go('Privacy')} last />
      </Card>

      <Card style={layout.mt16}>
        <ListRow icon="logout" danger chevron={false} title={t('Sign out', 'Se déconnecter')} onPress={() => setSignOut(true)} last />
      </Card>
      <Text style={s.version}>Djawei · version 0.0.1</Text>

      <AppDialog
        visible={signOut}
        tone="danger"
        icon="logout"
        title={t('Sign out of Djawei?', 'Se déconnecter de Djawei ?')}
        message={t('You’ll need your fingerprint or PIN to sign back in.', 'Vous aurez besoin de votre empreinte ou de votre code PIN pour vous reconnecter.')}
        primary={{
          label: t('Sign out', 'Se déconnecter'),
          onPress: () => {
            setSignOut(false);
            navigation.reset({ index: 0, routes: [{ name: 'UnlockFingerprint' }] });
          },
        }}
        secondary={{ label: t('Cancel', 'Annuler'), onPress: () => setSignOut(false) }}
        onClose={() => setSignOut(false)}
      />
    </Screen>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    user: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16 },
    name: { color: c.text, fontSize: 18, fontWeight: '700' },
    sub: { color: c.textMuted, fontSize: 13, marginTop: 2 },
    kyc: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: c.accentTint,
      borderRadius: 16,
      padding: 14,
      marginTop: 12,
    },
    kycHead: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    kycTitle: { color: c.text, fontSize: 15, fontWeight: '600' },
    prefs: { paddingVertical: 8 },
    prefRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, gap: 12 },
    prefLabel: { color: c.text, fontSize: 15, fontWeight: '600' },
    seg: { width: 190 },
    version: { color: c.textMuted, fontSize: 12, textAlign: 'center', marginTop: 16 },
  });
