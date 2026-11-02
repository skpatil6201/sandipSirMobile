/**
 * Payment redirect & result: Mobile-money checkout (CinetPay), Bank app,
 * Card verification, Processing and Payment successful / failed.
 *
 * @format
 */

import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import AppButton from '../../components/AppButton';
import { Card, InfoNote, ResultHero, SummaryRow } from '../../components/Blocks';
import Icon from '../../components/Icon';
import OtpInput from '../../components/OtpInput';
import Screen from '../../components/Screen';
import { usePreferences, useThemedStyles } from '../../context/PreferencesContext';
import { USER, feeFor, recipientById } from '../../data/mock';
import type { ScreenProps, TransferParams } from '../../navigation/types';
import type { ThemeColors } from '../../theme';
import { xof } from '../../utils/format';
import { layout } from '../../theme/layout';

/** Full-screen "Processing payment…" overlay. */
function Processing({ visible }: { visible: boolean }) {
  const s = useThemedStyles(makeStyles);
  const { t, colors } = usePreferences();
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={s.overlay}>
        <View style={s.processing}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={s.procTitle}>{t('Processing payment…', 'Paiement en cours…')}</Text>
          <Text style={s.procBody}>
            {t(
              'Confirming with your operator or bank. This usually takes a few seconds.',
              'Confirmation auprès de votre opérateur ou banque. Cela prend généralement quelques secondes.',
            )}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

type Replacer = { replace: (name: 'PaymentResult', p: TransferParams & { success: boolean }) => void };

function useProcess(navigation: Replacer, params: TransferParams) {
  const [state, setState] = useState<null | boolean>(null);
  useEffect(() => {
    if (state === null) {
      return;
    }
    const id = setTimeout(() => {
      navigation.replace('PaymentResult', { ...params, success: state });
      setState(null);
    }, 1800);
    return () => clearTimeout(id);
  }, [state, navigation, params]);
  return { processing: state !== null, run: (success: boolean) => setState(success) };
}

/* ---------- Mobile-money checkout (CinetPay) ---------- */

export function SecureGatewayScreen({ navigation, route }: ScreenProps<'SecureGateway'>) {
  const s = useThemedStyles(makeStyles);
  const { t, language, colors } = usePreferences();
  const params = route.params;
  const total = xof(params.amount + feeFor(params.amount), language);
  const [code, setCode] = useState('4829');
  const { processing, run } = useProcess(navigation, params);

  const browserBar = (
    <View style={s.browser}>
      <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
        <Text style={s.cancel}>{t('Cancel', 'Annuler')}</Text>
      </Pressable>
      <View style={s.url}>
        <Icon name="lock" size={12} color={colors.success} />
        <Text style={s.urlText}>checkout.cinetpay.com</Text>
      </View>
      <View style={s.browserSpacer} />
    </View>
  );

  return (
    <>
      <Screen header={browserBar} contentStyle={layout.pt16}>
        <View style={s.merchant}>
          <View style={s.tpLogo}>
            <Text style={s.tpLetter}>C</Text>
          </View>
          <View>
            <Text style={s.merchantName}>CinetPay</Text>
            <Text style={s.merchantSub}>{t('Secure checkout', 'Paiement sécurisé')}</Text>
          </View>
        </View>
        <Card style={layout.mt16}>
          <SummaryRow label={t('Pay to', 'Bénéficiaire')} value="Djawei" />
          <SummaryRow label={t('Amount', 'Montant')} value={total} strong />
          <SummaryRow label={t('Method', 'Moyen')} value={`Orange Money · ${USER.phoneMasked}`} last />
        </Card>
        <Text style={s.h2}>{t('Confirm with your PIN', 'Confirmez avec votre code')}</Text>
        <Text style={s.body}>
          {t(
            'Enter your Orange Money secret code to authorise this payment. Djawei never sees it.',
            'Saisissez votre code secret Orange Money pour autoriser ce paiement. Djawei ne le voit jamais.',
          )}
        </Text>
        <OtpInput length={4} value={code} onChange={setCode} />
        <Text style={s.expires}>
          {t('Code expires in 04:59 · ', 'Le code expire dans 04:59 · ')}
          <Text style={s.resend}>{t('Resend code', 'Renvoyer le code')}</Text>
        </Text>
        <View style={s.actions}>
          <AppButton title={t(`Authorise ${total}`, `Autoriser ${total}`)} disabled={code.length < 4} onPress={() => run(true)} />
          <AppButton title={t('Simulate declined payment', 'Simuler un paiement refusé')} variant="dangerOutline" onPress={() => run(false)} />
        </View>
        <View style={s.pci}>
          <Icon name="shield" size={14} color={colors.textMuted} />
          <Text style={s.pciText}>{t('Secured payment · approved by BCEAO partners', 'Paiement sécurisé · partenaires agréés BCEAO')}</Text>
        </View>
      </Screen>
      <Processing visible={processing} />
    </>
  );
}

/* ---------- Bank app (instant bank transfer) ---------- */

export function BankAppScreen({ navigation, route }: ScreenProps<'BankApp'>) {
  const s = useThemedStyles(makeStyles);
  const { t, language } = usePreferences();
  const params = route.params;
  const { processing, run } = useProcess(navigation, params);
  return (
    <>
      <Screen
        back={false}
        title=""
        footer={
          <>
            <AppButton title={t('Approve payment', 'Valider le paiement')} icon="fp" onPress={() => run(true)} />
            <AppButton title={t('Decline', 'Refuser')} variant="dangerOutline" onPress={() => run(false)} />
          </>
        }
      >
        <View style={s.bankHead}>
          <View style={[s.tpLogo, s.tpLogoBank]}>
            <Text style={s.tpLetter}>N</Text>
          </View>
          <Text style={s.merchantName}>Ecobank</Text>
        </View>
        <Text style={s.h1}>{t('Payment request', 'Demande de paiement')}</Text>
        <Text style={s.body}>
          {t('Djawei wants to collect a payment from your account.', 'Djawei souhaite prélever un paiement sur votre compte.')}
        </Text>
        <Card style={layout.mt8}>
          <SummaryRow label={t('Amount', 'Montant')} value={xof(params.amount + feeFor(params.amount), language)} strong />
          <SummaryRow label={t('To', 'Bénéficiaire')} value="Djawei SAS" />
          <SummaryRow label={t('From', 'Compte')} value={t('Current account •••• 4417', 'Compte courant •••• 4417')} />
          <SummaryRow label={t('Reference', 'Référence')} value="DJW-88421" />
          <SummaryRow label={t('Type', 'Type')} value={t('Instant transfer', 'Virement instantané')} last />
        </Card>
        <View style={layout.mt12}>
          <InfoNote icon="fp" text={t('Approve with Face ID or your banking PIN.', 'Validez avec Face ID ou votre code bancaire.')} />
        </View>
      </Screen>
      <Processing visible={processing} />
    </>
  );
}

/* ---------- Card verification (3-D Secure) ---------- */

export function CardVerificationScreen({ navigation, route }: ScreenProps<'CardVerification'>) {
  const s = useThemedStyles(makeStyles);
  const { t, language } = usePreferences();
  const params = route.params;
  const [code, setCode] = useState('4829');
  const { processing, run } = useProcess(navigation, params);
  return (
    <>
      <Screen
        title={t('Card verification', 'Vérification carte')}
        footer={
          <>
            <AppButton title={t('Confirm', 'Confirmer')} disabled={code.length < 6} onPress={() => run(true)} />
            <AppButton title={t('Cancel payment', 'Annuler le paiement')} variant="ghost" onPress={() => run(false)} />
          </>
        }
      >
        <Text style={s.h1}>{t('Confirm it’s you', 'Confirmez votre identité')}</Text>
        <Text style={s.body}>
          {t('Enter the 6-digit code sent to +225 07 •• •• •• 78.', 'Saisissez le code à 6 chiffres envoyé au +225 07 •• •• •• 78.')}
        </Text>
        <Card style={layout.mb20}>
          <SummaryRow label={t('Amount', 'Montant')} value={xof(params.amount + feeFor(params.amount), language)} strong />
          <SummaryRow label={t('Merchant', 'Marchand')} value="Djawei SAS" />
          <SummaryRow label={t('Card', 'Carte')} value="•••• 4417" />
          <SummaryRow label={t('Date', 'Date')} value={t('31 Oct 2026', '31 oct. 2026')} last />
        </Card>
        <OtpInput value={code} onChange={setCode} />
        <Text style={s.expires}>
          {t('Didn’t get a code? ', 'Code non reçu ? ')}
          <Text style={s.resend}>{t('Resend', 'Renvoyer')}</Text>
        </Text>
      </Screen>
      <Processing visible={processing} />
    </>
  );
}

/* ---------- Result ---------- */

export function PaymentResultScreen({ navigation, route }: ScreenProps<'PaymentResult'>) {
  const { t, language } = usePreferences();
  const { success, ...params } = route.params;
  const r = recipientById(params.recipientId);
  const amount = xof(params.amount, language);

  if (success) {
    return (
      <Screen
        back={false}
        footer={
          <>
            <AppButton title={t('Continue', 'Continuer')} onPress={() => navigation.replace('TransferSent', params)} />
            <AppButton
              title={t('View receipt', 'Voir le reçu')}
              variant="outline"
              icon="file"
              onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main', params: { screen: 'History' } }] })}
            />
          </>
        }
      >
        <ResultHero
          title={t('Payment successful', 'Paiement réussi')}
          message={t(
            `Your payment was approved. ${amount} is on its way to ${r.name}.`,
            `Votre paiement a été accepté. ${amount} sont en route vers ${r.name}.`,
          )}
        />
        <Card>
          <SummaryRow label={t('Amount paid', 'Montant payé')} value={xof(params.amount + feeFor(params.amount), language)} />
          <SummaryRow label={t('Reference', 'Référence')} value="DJW-8845102" />
          <SummaryRow label={t('They receive', 'Montant reçu')} value={xof(params.amount, language)} strong last />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen
      back={false}
      footer={
        <>
          <AppButton title={t('Try again', 'Réessayer')} icon="refresh" onPress={() => navigation.goBack()} />
          <AppButton
            title={t('Change payment method', 'Changer de moyen de paiement')}
            variant="outline"
            onPress={() => navigation.navigate('SendPayment', { recipientId: params.recipientId, amount: params.amount })}
          />
          <AppButton
            title={t('Cancel transfer', 'Annuler le transfert')}
            variant="ghost"
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
          />
        </>
      }
    >
      <ResultHero
        tone="danger"
        title={t('Payment not successful', 'Paiement non abouti')}
        message={t(
          'Your bank declined this payment. No money has been taken from your account.',
          'Votre banque a refusé ce paiement. Aucun montant n’a été débité de votre compte.',
        )}
      />
      <InfoNote tone="danger" icon="alert" text={t('Reason: insufficient funds (code 51)', 'Motif : fonds insuffisants (code 51)')} />
    </Screen>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.background },
    browser: {
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
      backgroundColor: c.surface,
    },
    cancel: { color: c.primary, fontSize: 15, fontWeight: '600', width: 52 },
    url: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: c.surfaceMuted,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    urlText: { color: c.text, fontSize: 13, fontWeight: '500' },
    merchant: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    tpLogo: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: '#0B5CAD',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tpLetter: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
    merchantName: { color: c.text, fontSize: 17, fontWeight: '700' },
    merchantSub: { color: c.textMuted, fontSize: 13 },
    h1: { color: c.text, fontSize: 24, fontWeight: '700', marginTop: 8, marginBottom: 6 },
    h2: { color: c.text, fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 6 },
    body: { color: c.textMuted, fontSize: 14, lineHeight: 20, marginBottom: 16 },
    expires: { color: c.textMuted, fontSize: 13, textAlign: 'center', marginTop: 14 },
    actions: { gap: 10, marginTop: 24 },
    pci: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20 },
    pciText: { color: c.textMuted, fontSize: 12 },
    bankHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    overlay: { flex: 1, backgroundColor: c.overlay, justifyContent: 'center', padding: 24 },
    processing: { backgroundColor: c.surface, borderRadius: 28, padding: 28, alignItems: 'center', gap: 12 },
    procTitle: { color: c.text, fontSize: 18, fontWeight: '700' },
    procBody: { color: c.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 20 },
    browserSpacer: { width: 52 },
    tpLogoBank: { backgroundColor: '#1D3A8A' },
    resend: { color: c.primary, fontWeight: '600' },
  });
