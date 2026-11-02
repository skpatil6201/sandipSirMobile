/**
 * Profile sub-pages: Personal details, Saved recipients, Transfer limits,
 * Change password, Trusted devices, Transaction alerts, Refer & earn.
 *
 * @format
 */

import { useState } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import AppButton from '../../components/AppButton';
import AppDialog from '../../components/AppDialog';
import AppTextInput from '../../components/AppTextInput';
import { Badge, Card, IconCircle, InfoNote, SummaryRow, ToggleRow } from '../../components/Blocks';
import Screen from '../../components/Screen';
import { useAppData } from '../../context/AppDataContext';
import { usePreferences, useThemedStyles } from '../../context/PreferencesContext';
import { USER } from '../../data/mock';
import type { ScreenProps } from '../../navigation/types';
import type { ThemeColors } from '../../theme';
import { RecipientsList } from '../home/HomeExtraScreens';
import { layout } from '../../theme/layout';

/* ---------- Personal details ---------- */

export function PersonalDetailsScreen({ navigation }: ScreenProps<'PersonalDetails'>) {
  const { t } = usePreferences();
  const [saved, setSaved] = useState(false);
  return (
    <Screen
      title={t('Personal details', 'Informations personnelles')}
      footer={<AppButton title={t('Save changes', 'Enregistrer')} onPress={() => setSaved(true)} />}
    >
      <View style={s.form}>
        <AppTextInput label={t('Full name', 'Nom complet')} defaultValue={USER.name} />
        <AppTextInput label={t('Email', 'E-mail')} defaultValue={USER.email} keyboardType="email-address" autoCapitalize="none" />
        <AppTextInput label={t('Phone', 'Téléphone')} defaultValue={USER.phone} keyboardType="phone-pad" />
        <AppTextInput label={t('Date of birth', 'Date de naissance')} value={t(USER.dob.en, USER.dob.fr)} editable={false} />
        <AppTextInput label={t('Address', 'Adresse')} defaultValue={t(USER.address.en, USER.address.fr)} />
      </View>
      <AppDialog
        visible={saved}
        title={t('Details saved', 'Informations enregistrées')}
        message={t('Your personal details have been updated.', 'Vos informations personnelles ont été mises à jour.')}
        primary={{ label: t('Done', 'Terminé'), onPress: () => { setSaved(false); navigation.goBack(); } }}
        onClose={() => setSaved(false)}
      />
    </Screen>
  );
}

/* ---------- Saved recipients ---------- */

export function SavedRecipientsScreen({ navigation }: ScreenProps<'SavedRecipients'>) {
  const { t } = usePreferences();
  return (
    <Screen
      title={t('Saved recipients', 'Bénéficiaires')}
      footer={<AppButton title={t('Add recipient', 'Ajouter un bénéficiaire')} icon="plus" onPress={() => navigation.navigate('SendRecipient')} />}
    >
      <RecipientsList
        searchLabel={t('Search recipients', 'Rechercher un bénéficiaire')}
        onPick={id => navigation.navigate('SendAmount', { recipientId: id })}
      />
    </Screen>
  );
}

/* ---------- Transfer limits ---------- */

export function TransferLimitsScreen({ navigation }: ScreenProps<'TransferLimits'>) {
  const st = useThemedStyles(makeStyles);
  const { t } = usePreferences();
  return (
    <Screen
      title={t('Transfer limits', 'Plafonds de transfert')}
      footer={<AppButton title={t('Verify identity', 'Vérifier l’identité')} icon="shield" onPress={() => navigation.navigate('KycPersonal')} />}
    >
      <Card style={st.usage}>
        <Text style={st.usageLabel}>{t('Used this month', 'Utilisé ce mois-ci')}</Text>
        <Text style={st.usageValue}>{t('750,000 of 2,000,000 XOF', '750 000 sur 2 000 000 XOF')}</Text>
        <View style={st.track}>
          <View style={[st.fill, st.fillUsed]} />
        </View>
        <Text style={st.usageLabel}>{t('Resets on 1 November', 'Remise à zéro le 1er novembre')}</Text>
      </Card>
      <Card style={layout.mt12}>
        <SummaryRow label={t('Daily limit', 'Plafond journalier')} value={t('500,000 XOF', '500 000 XOF')} />
        <SummaryRow label={t('Per transfer', 'Par transfert')} value={t('1,000,000 XOF', '1 000 000 XOF')} />
        <SummaryRow label={t('Monthly limit', 'Plafond mensuel')} value={t('2,000,000 XOF', '2 000 000 XOF')} last />
      </Card>
      <View style={layout.mt12}>
        <InfoNote tone="gold" icon="trend" text={t('Verify your identity to raise your limit to 10,000,000 XOF per month.', 'Vérifiez votre identité pour passer à 10 000 000 XOF par mois.')} />
      </View>
    </Screen>
  );
}

/* ---------- Change password ---------- */

export function ChangePasswordScreen({ navigation }: ScreenProps<'ChangePassword'>) {
  const { t } = usePreferences();
  const [done, setDone] = useState(false);
  return (
    <Screen
      title={t('Change password', 'Mot de passe')}
      footer={<AppButton title={t('Update password', 'Mettre à jour')} onPress={() => setDone(true)} />}
    >
      <View style={s.form}>
        <AppTextInput label={t('Current password', 'Mot de passe actuel')} defaultValue="password" secure />
        <AppTextInput label={t('New password', 'Nouveau mot de passe')} defaultValue="Djawei#2026" secure />
        <AppTextInput
          label={t('Confirm new password', 'Confirmer le mot de passe')}
          defaultValue="Djawei#2026"
          secure
          hint={t('At least 8 characters, with one number and one symbol.', '8 caractères minimum, dont un chiffre et un symbole.')}
        />
      </View>
      <AppDialog
        visible={done}
        icon="lock"
        title={t('Password changed', 'Mot de passe changé')}
        message={t('Your password has been updated. Use it the next time you log in.', 'Votre mot de passe a été mis à jour. Utilisez-le à votre prochaine connexion.')}
        primary={{ label: t('Done', 'Terminé'), onPress: () => { setDone(false); navigation.goBack(); } }}
        onClose={() => setDone(false)}
      />
    </Screen>
  );
}

/* ---------- Trusted devices ---------- */

export function TrustedDevicesScreen() {
  const st = useThemedStyles(makeStyles);
  const { t } = usePreferences();
  const { devices, removeDevice, signOutOtherDevices } = useAppData();
  const [confirm, setConfirm] = useState<(typeof devices)[number] | null>(null);
  const [removed, setRemoved] = useState<string | null>(null);
  const [allOut, setAllOut] = useState(false);

  return (
    <Screen
      title={t('Trusted devices', 'Appareils de confiance')}
      footer={
        <AppButton
          title={t('Sign out of all other devices', 'Déconnecter les autres appareils')}
          variant="dangerOutline"
          icon="logout"
          disabled={devices.length <= 1}
          onPress={() => {
            signOutOtherDevices();
            setAllOut(true);
          }}
        />
      }
    >
      <Card>
        {devices.map((d, i) => (
          <View key={d.id} style={[st.device, i < devices.length - 1 && st.divider]}>
            <IconCircle name={d.icon} />
            <View style={layout.flex1}>
              <Text style={st.deviceName}>{d.name}</Text>
              <Text style={st.deviceSub}>{t(d.detail.en, d.detail.fr)}</Text>
            </View>
            {d.current ? (
              <Badge label={t('Active', 'Actif')} />
            ) : (
              <AppButton small variant="dangerOutline" title={t('Remove', 'Retirer')} onPress={() => setConfirm(d)} />
            )}
          </View>
        ))}
      </Card>
      <View style={layout.mt12}>
        <InfoNote icon="shield" text={t('Only trusted devices can approve transfers without a one-time code.', 'Seuls les appareils de confiance peuvent valider un transfert sans code à usage unique.')} />
      </View>

      <AppDialog
        visible={!!confirm}
        tone="danger"
        icon="trash"
        title={t('Remove this device?', 'Retirer cet appareil ?')}
        message={
          confirm
            ? t(
                `${confirm.name} will be signed out and will need a one-time code to approve transfers again.`,
                `${confirm.name} sera déconnecté et devra utiliser un code à usage unique pour valider les virements.`,
              )
            : ''
        }
        primary={{
          label: t('Remove device', 'Retirer l’appareil'),
          onPress: () => {
            if (confirm) {
              removeDevice(confirm.id);
              setRemoved(confirm.name);
            }
            setConfirm(null);
          },
        }}
        secondary={{ label: t('Cancel', 'Annuler'), onPress: () => setConfirm(null) }}
        onClose={() => setConfirm(null)}
      />
      <AppDialog
        visible={!!removed}
        title={t(`${removed} removed`, `${removed} retiré`)}
        primary={{ label: t('Done', 'Terminé'), onPress: () => setRemoved(null) }}
        onClose={() => setRemoved(null)}
      />
      <AppDialog
        visible={allOut}
        title={t('Other devices signed out', 'Autres appareils déconnectés')}
        message={t('All other devices have been signed out. Only this iPhone stays trusted.', 'Tous les autres appareils ont été déconnectés. Seul cet iPhone reste de confiance.')}
        primary={{ label: t('Done', 'Terminé'), onPress: () => setAllOut(false) }}
        onClose={() => setAllOut(false)}
      />
    </Screen>
  );
}

/* ---------- Transaction alerts ---------- */

export function TransactionAlertsScreen() {
  const { t } = usePreferences();
  const [v, setV] = useState({ push: true, email: true, sms: false, large: true, news: false });
  const set = (k: keyof typeof v) => (x: boolean) => setV(p => ({ ...p, [k]: x }));
  return (
    <Screen title={t('Transaction alerts', 'Alertes de transaction')}>
      <Card>
        <ToggleRow icon="bell" title={t('Push notifications', 'Notifications push')} subtitle={t('Instant alerts on this phone', 'Alertes instantanées sur ce téléphone')} value={v.push} onChange={set('push')} />
        <ToggleRow icon="mail" title={t('Email alerts', 'Alertes e-mail')} subtitle={USER.email} value={v.email} onChange={set('email')} />
        <ToggleRow icon="chat" title={t('SMS alerts', 'Alertes SMS')} subtitle={USER.phone} value={v.sms} onChange={set('sms')} />
        <ToggleRow icon="trend" title={t('Large transfers', 'Gros transferts')} subtitle={t('Alert me above 300,000 XOF', 'M’alerter au-delà de 300 000 XOF')} value={v.large} onChange={set('large')} />
        <ToggleRow icon="gift" title={t('News & offers', 'Actualités et offres')} value={v.news} onChange={set('news')} last />
      </Card>
    </Screen>
  );
}

/* ---------- Refer & earn ---------- */

export function ReferEarnScreen() {
  const st = useThemedStyles(makeStyles);
  const { t } = usePreferences();
  const [copied, setCopied] = useState(false);
  const steps = [
    t('Share your link or code with friends', 'Partagez votre lien ou votre code'),
    t('They sign up and send 25,000 XOF or more', 'Vos amis s’inscrivent et envoient 25 000 XOF ou plus'),
    t('You both get 2,000 XOF off your next transfer', 'Vous recevez chacun 2 000 XOF sur votre prochain transfert'),
  ];
  const share = () =>
    Share.share({
      message: t(
        `Join me on Djawei and we both get 2,000 XOF. Use my code ${USER.referralCode}.`,
        `Rejoins-moi sur Djawei et recevons chacun 2 000 XOF. Utilise mon code ${USER.referralCode}.`,
      ),
    });

  return (
    <Screen
      title={t('Refer & earn', 'Parrainage')}
      footer={<AppButton title={t('Share invite link', 'Partager mon lien')} icon="share" onPress={share} />}
    >
      <View style={st.hero}>
        <View style={st.gift}>
          <Text style={st.giftEmoji}>🎁</Text>
        </View>
        <Text style={st.heroTitle}>{t('Give 2,000 XOF, get 2,000 XOF', 'Offrez 2 000 XOF, recevez 2 000 XOF')}</Text>
        <Text style={st.heroSub}>
          {t(
            'Invite friends to Djawei. When they send their first transfer of 25,000 XOF or more, you both get 2,000 XOF.',
            'Invitez vos amis sur Djawei. Lorsqu’ils envoient leur premier transfert de 25 000 XOF ou plus, vous recevez chacun 2 000 XOF.',
          )}
        </Text>
      </View>
      <Card style={st.code}>
        <View style={layout.flex1}>
          <Text style={st.codeLabel}>{t('Your referral code', 'Votre code de parrainage')}</Text>
          <Text style={st.codeValue}>{USER.referralCode}</Text>
        </View>
        <AppButton small variant="outline" icon={copied ? 'check' : 'copy'} title={copied ? t('Copied', 'Copié') : t('Copy', 'Copier')} onPress={() => setCopied(true)} />
      </Card>
      <Text style={st.howTitle}>{t('How it works', 'Comment ça marche')}</Text>
      <Card>
        {steps.map((x, i) => (
          <View key={i} style={[st.step, i < steps.length - 1 && st.divider]}>
            <View style={st.num}>
              <Text style={st.numText}>{i + 1}</Text>
            </View>
            <Text style={st.stepText}>{x}</Text>
          </View>
        ))}
      </Card>
      <View style={st.stats}>
        <Card style={st.stat}>
          <Text style={st.statLabel}>{t('Friends invited', 'Amis invités')}</Text>
          <Text style={st.statValue}>3</Text>
        </Card>
        <Card style={st.stat}>
          <Text style={st.statLabel}>{t('You earned', 'Vous avez gagné')}</Text>
          <Text style={st.statValue}>{t('6,000 XOF', '6 000 XOF')}</Text>
        </Card>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({ form: { gap: 14 } });

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border },
    usage: { paddingVertical: 18, gap: 8 },
    usageLabel: { color: c.textMuted, fontSize: 13 },
    usageValue: { color: c.text, fontSize: 24, fontWeight: '700' },
    track: { height: 8, borderRadius: 4, backgroundColor: c.surfaceMuted, overflow: 'hidden' },
    fill: { height: 8, borderRadius: 4, backgroundColor: c.primary },
    device: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
    deviceName: { color: c.text, fontSize: 15, fontWeight: '600' },
    deviceSub: { color: c.textMuted, fontSize: 12, marginTop: 2 },
    hero: { alignItems: 'center', paddingVertical: 12, gap: 8 },
    gift: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: c.accentTintStrong,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6,
    },
    heroTitle: { color: c.text, fontSize: 26, fontWeight: '700' },
    heroSub: { color: c.textMuted, fontSize: 14, lineHeight: 21, textAlign: 'center' },
    code: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      marginTop: 16,
      borderStyle: 'dashed',
      borderColor: c.accent,
      backgroundColor: c.accentTint,
    },
    codeLabel: { color: c.textMuted, fontSize: 12 },
    codeValue: { color: c.text, fontSize: 22, fontWeight: '800', letterSpacing: 2, marginTop: 2 },
    howTitle: { color: c.text, fontSize: 17, fontWeight: '600', marginTop: 24, marginBottom: 12 },
    step: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
    num: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    numText: { color: '#FFFFFF', fontWeight: '700' },
    stepText: { flex: 1, color: c.text, fontSize: 14 },
    stats: { flexDirection: 'row', gap: 12, marginTop: 12 },
    stat: { flex: 1, paddingVertical: 16, gap: 4 },
    statLabel: { color: c.textMuted, fontSize: 12 },
    statValue: { color: c.primary, fontSize: 24, fontWeight: '700' },
    fillUsed: { width: '38%' },
    giftEmoji: { fontSize: 40 },
  });
