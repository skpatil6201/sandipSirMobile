/**
 * My QR code, QR scanner (camera placeholder), Scanned account,
 * Payment methods and Receive money.
 *
 * @format
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppButton from '../../components/AppButton';
import Avatar from '../../components/Avatar';
import { Card, IconCircle, InfoNote, ListRow, PageTitle, SectionHeader } from '../../components/Blocks';
import Icon from '../../components/Icon';
import Screen from '../../components/Screen';
import { useAppData } from '../../context/AppDataContext';
import { usePreferences, useThemedStyles } from '../../context/PreferencesContext';
import { PAYMENT_METHODS, USER, countryByCode } from '../../data/mock';
import type { ScreenProps } from '../../navigation/types';
import type { ThemeColors } from '../../theme';
import { layout } from '../../theme/layout';

/* ---------- My QR code ---------- */

export function MyQrScreen({ navigation }: ScreenProps<'MyQr'>) {
  const s = useThemedStyles(makeStyles);
  const { t } = usePreferences();
  return (
    <Screen
      title={t('My QR code', 'Mon QR code')}
      footer={
        <AppButton title={t('Scan a QR', 'Scanner un QR code')} icon="scan" onPress={() => navigation.navigate('QrScanner')} />
      }
    >
      <Text style={s.center}>
        {t('Scan me with the Djawei app to send money to this account.', 'Scannez ce code avec l’application Djawei pour envoyer de l’argent sur ce compte.')}
      </Text>
      <Card style={s.qrCard}>
        <Avatar initials={USER.initials} size={56} />
        <Text style={s.name}>{USER.name}</Text>
        <Text style={s.email}>{USER.email}</Text>
        <View style={s.qrBox}>
          <QRCode value="djawei://pay/aminata-diallo" size={200} color="#0A0F0B" backgroundColor="#FFFFFF" />
        </View>
      </Card>
      <InfoNote
        icon="shield"
        text={t(
          'The code links the person scanning it to this account. Only share it with people you want to send money to you.',
          'Ce code renvoie vers ce compte. Partagez-le uniquement avec les personnes dont vous souhaitez recevoir de l’argent.',
        )}
      />
    </Screen>
  );
}

/* ---------- QR scanner ---------- */

export function QrScannerScreen({ navigation }: ScreenProps<'QrScanner'>) {
  const s = useThemedStyles(makeStyles);
  const { t } = usePreferences();
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.scanner, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }]}>
      <View style={s.scanTop}>
        <Pressable style={s.scanBtn} onPress={() => navigation.goBack()}>
          <Icon name="x" size={22} color="#FFFFFF" />
        </Pressable>
        <Pressable style={s.scanBtn} onPress={() => navigation.navigate('MyQr')}>
          <Icon name="qr" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
      <View style={s.scanCenter}>
        <Text style={s.preview}>{t('CAMERA PREVIEW', 'APERÇU DE LA CAMÉRA')}</Text>
        {/* Tap the frame to simulate a successful scan (camera is wired later). */}
        <Pressable style={s.frame} onPress={() => navigation.replace('ScannedAccount')}>
          <View style={[s.corner, s.tl]} />
          <View style={[s.corner, s.tr]} />
          <View style={[s.corner, s.bl]} />
          <View style={[s.corner, s.br]} />
          <View style={s.laser} />
        </Pressable>
        <Text style={s.scanHint}>
          {t('Point your camera at a Djawei QR code', 'Visez un QR code Djawei avec votre appareil photo')}
        </Text>
      </View>
      <View style={s.demoRow}>
        <AppButton small variant="gold" title={t('Demo: user with account', 'Démo : avec compte')} onPress={() => navigation.replace('ScannedRecipient', { hasAccount: true })} />
        <AppButton small variant="outline" title={t('Demo: no account', 'Démo : sans compte')} onPress={() => navigation.replace('ScannedRecipient', { hasAccount: false })} />
      </View>
    </View>
  );
}

/* ---------- Scanned account ---------- */

export function ScannedAccountScreen({ navigation }: ScreenProps<'ScannedAccount'>) {
  const s = useThemedStyles(makeStyles);
  const { t } = usePreferences();
  return (
    <Screen
      title={t('Account', 'Compte')}
      footer={
        <AppButton
          title={t('Send money', 'Envoyer de l’argent')}
          icon="send"
          onPress={() => navigation.navigate('ScannedRecipient', { hasAccount: true })}
        />
      }
    >
      <Card style={s.qrCard}>
        <Avatar initials="IT" tone="gold" size={72} />
        <Text style={s.name}>Ibrahim Traoré</Text>
        <Text style={s.email}>ibrahim.traore@example.com</Text>
      </Card>
    </Screen>
  );
}

/* ---------- Payment methods ---------- */

export function PaymentMethodsScreen() {
  const { t } = usePreferences();
  return (
    <Screen title={t('Payment methods', 'Moyens de paiement')}>
      <PageTitle
        title={t('Payment methods', 'Moyens de paiement')}
        subtitle={t(
          "Pay from mobile money, a bank account or a card. The money goes straight to the recipient's bank or mobile-money account in any of the 8 UEMOA countries — nothing sits in a wallet.",
          'Payez par mobile money, compte bancaire ou carte. L’argent arrive directement sur le compte bancaire ou mobile money du bénéficiaire, dans l’un des 8 pays de l’UEMOA, sans portefeuille.',
        )}
      />
      <Card>
        {PAYMENT_METHODS.map((m, i) => (
          <ListRow
            key={m.key}
            icon={m.icon}
            title={t(m.label.en, m.label.fr)}
            subtitle={`${t(m.hint.en, m.hint.fr)}\n${t(m.rail.en, m.rail.fr)}`}
            last={i === PAYMENT_METHODS.length - 1}
          />
        ))}
      </Card>
    </Screen>
  );
}

/* ---------- Receive money ---------- */

export function ReceiveMoneyScreen({ navigation }: ScreenProps<'ReceiveMoney'>) {
  const s = useThemedStyles(makeStyles);
  const { t, colors } = usePreferences();
  const { accounts, defaultAccountId } = useAppData();
  const acc = accounts.find(a => a.id === defaultAccountId);
  const c = acc ? countryByCode(acc.countryCode) : null;

  return (
    <Screen
      title={t('Receive money', 'Recevoir de l’argent')}
      footer={
        <AppButton title={t('Show my QR code', 'Afficher mon QR code')} icon="qr" onPress={() => navigation.navigate('MyQr')} />
      }
    >
      <PageTitle
        title={t('Receive money', 'Recevoir de l’argent')}
        subtitle={t(
          "Money comes straight to your bank or mobile-money account. There's no wallet to load or balance to keep.",
          'L’argent arrive directement sur votre compte bancaire ou mobile money. Aucun portefeuille à recharger ni solde à conserver.',
        )}
      />
      {acc && c ? (
        <Card style={s.dest}>
          <Text style={s.destLabel}>{t('Money will be sent to', 'L’argent sera envoyé à')}</Text>
          <View style={s.destRow}>
            <IconCircle name={acc.type === 'bank' ? 'bank' : 'mobile'} />
            <View style={layout.flex1}>
              <Text style={s.destTitle}>{`${acc.provider} •••• ${acc.last}`}</Text>
              <Text style={s.destSub}>{`${acc.holder} · ${c.flag} ${t(c.name.en, c.name.fr)} · XOF`}</Text>
            </View>
            <Pressable onPress={() => navigation.navigate('ReceivingAccounts')} hitSlop={8}>
              <Text style={s.link}>{t('Change', 'Modifier')}</Text>
            </Pressable>
          </View>
        </Card>
      ) : (
        <Card style={s.dest}>
          <View style={s.destRow}>
            <IconCircle name="alert" tone="gold" />
            <View style={layout.flex1}>
              <Text style={s.destTitle}>
                {t('Add a receiving account to receive money', 'Ajoutez un compte de réception pour recevoir de l’argent')}
              </Text>
              <Text style={s.destSub}>
                {t(
                  "People can't pay you until you choose where the money should land.",
                  'Personne ne peut vous payer tant que vous n’avez pas choisi où l’argent doit arriver.',
                )}
              </Text>
            </View>
          </View>
          <AppButton
            small
            title={t('Add receiving account', 'Ajouter un compte de réception')}
            icon="plus"
            onPress={() => navigation.navigate('AddAccountType')}
          />
        </Card>
      )}
      <SectionHeader title={t('From another Djawei user', 'D’un autre utilisateur Djawei')} />
      <Card style={s.dest}>
        <View style={s.destRow}>
          <Avatar initials={USER.initials} />
          <View style={layout.flex1}>
            <Text style={s.destTitle}>{USER.name}</Text>
            <Text style={s.destSub}>{USER.phoneMasked}</Text>
          </View>
          <Icon name="qr" size={22} color={colors.primary} />
        </View>
        <Text style={s.destSub}>
          {t(
            'Share your QR code with someone on Djawei. When they scan it, they can transfer money straight to your chosen bank or mobile-money account — it never sits in a wallet.',
            'Partagez votre QR code avec un utilisateur Djawei. En le scannant, il peut envoyer de l’argent directement sur le compte bancaire ou mobile money de votre choix, sans passer par un portefeuille.',
          )}
        </Text>
      </Card>
    </Screen>
  );
}

const CORNER = 34;

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    center: { color: c.textMuted, fontSize: 15, lineHeight: 22, textAlign: 'center', marginBottom: 16 },
    qrCard: { alignItems: 'center', paddingVertical: 24, gap: 4, marginBottom: 16 },
    name: { color: c.text, fontSize: 18, fontWeight: '700', marginTop: 8 },
    email: { color: c.textMuted, fontSize: 13 },
    qrBox: { marginTop: 18, padding: 14, backgroundColor: '#FFFFFF', borderRadius: 20 },
    scanner: { flex: 1, backgroundColor: '#050505', paddingHorizontal: 20 },
    scanTop: { flexDirection: 'row', justifyContent: 'space-between' },
    scanBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255,255,255,0.14)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    scanCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 },
    preview: { color: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: '700', letterSpacing: 2 },
    frame: { width: 250, height: 250, justifyContent: 'center' },
    corner: { position: 'absolute', width: CORNER, height: CORNER, borderColor: '#EEC352' },
    tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 20 },
    tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 20 },
    bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 20 },
    br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 20 },
    laser: { height: 2, marginHorizontal: 20, backgroundColor: '#2FAE57' },
    scanHint: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', textAlign: 'center' },
    demoRow: { gap: 10 },
    dest: { paddingVertical: 16, gap: 12 },
    destLabel: { color: c.textMuted, fontSize: 12, fontWeight: '600' },
    destRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    destTitle: { color: c.text, fontSize: 15, fontWeight: '600' },
    destSub: { color: c.textMuted, fontSize: 13, lineHeight: 19, marginTop: 2 },
    link: { color: c.primary, fontWeight: '600', fontSize: 13 },
  });
