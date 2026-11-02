/**
 * Send money: 1 Recipient (+ Add recipient sheet) → 2 Amount →
 * 3 Payment method → 4 Review (+ redirect pop-up) → Transfer sent.
 *
 * @format
 */

import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AppButton from '../../components/AppButton';
import AppTextInput from '../../components/AppTextInput';
import Avatar from '../../components/Avatar';
import BottomSheet from '../../components/BottomSheet';
import {
  Card,
  Chip,
  InfoNote,
  PageTitle,
  RadioCard,
  ResultHero,
  StepHeader,
  SummaryRow,
} from '../../components/Blocks';
import Icon from '../../components/Icon';
import Screen from '../../components/Screen';
import { usePreferences, useThemedStyles } from '../../context/PreferencesContext';
import {
  AUTO_METHOD,
  COUNTRIES,
  PAYMENT_METHODS,
  RECIPIENTS,
  countryByCode,
  feeFor,
  methodByKey,
  recipientById,
  type PaymentMethodKey,
} from '../../data/mock';
import type { ScreenProps, TransferParams } from '../../navigation/types';
import type { ThemeColors } from '../../theme';
import { num, xof } from '../../utils/format';
import { useAppData } from '../../context/AppDataContext';
import { layout } from '../../theme/layout';

/* ---------- 1 · Recipient ---------- */

export function SendRecipientScreen({ navigation }: ScreenProps<'SendRecipient'>) {
  const { t } = usePreferences();
  const s = useThemedStyles(makeStyles);
  const { senderCountry, setSenderCountry } = useAppData();
  const [selected, setSelected] = useState(RECIPIENTS[0].id);
  const [adding, setAdding] = useState(false);
  const [country, setCountry] = useState('CI');
  const [method, setMethod] = useState('Orange Money');
  const c = countryByCode(country);

  return (
    <Screen
      title={t('Send money', 'Envoyer de l’argent')}
      footer={
        <AppButton
          title={t('Continue', 'Continuer')}
          onPress={() => navigation.navigate('SendAmount', { recipientId: selected })}
        />
      }
    >
      <StepHeader step={1} total={4} />
      <PageTitle
        title={t('Who are you sending to?', 'À qui envoyez-vous ?')}
        subtitle={t('Pick a saved recipient, or add someone new.', 'Choisissez un bénéficiaire enregistré ou ajoutez-en un nouveau.')}
      />
      <Text style={s.label}>{t('Sending from', 'Envoi depuis')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[s.chips, s.fromRow]}>
        {COUNTRIES.map(k => (
          <Chip
            key={k.code}
            label={`${k.flag} ${t(k.name.en, k.name.fr)}`}
            active={k.code === senderCountry}
            onPress={() => setSenderCountry(k.code)}
          />
        ))}
      </ScrollView>
      <Text style={s.label}>{t('To', 'Vers')}</Text>
      <View style={s.list}>
        {RECIPIENTS.map(r => {
          const rc = countryByCode(r.countryCode);
          return (
            <RadioCard
              key={r.id}
              leading={<Avatar initials={r.initials} tone={r.tone} />}
              title={r.name}
              subtitle={`${rc.flag} ${r.method} · ${r.phone}`}
              selected={selected === r.id}
              onPress={() => setSelected(r.id)}
            />
          );
        })}
        <AppButton
          title={t('Add a new recipient', 'Ajouter un bénéficiaire')}
          variant="outline"
          icon="plus"
          onPress={() => setAdding(true)}
        />
      </View>

      <BottomSheet
        visible={adding}
        onClose={() => setAdding(false)}
        title={t('Add a recipient', 'Ajouter un bénéficiaire')}
      >
        <Text style={s.label}>{t('Country', 'Pays')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
          {COUNTRIES.map(k => (
            <Chip
              key={k.code}
              label={`${k.flag} ${t(k.name.en, k.name.fr)}`}
              active={k.code === country}
              onPress={() => {
                setCountry(k.code);
                setMethod(k.methods[0]);
              }}
            />
          ))}
        </ScrollView>
        <AppTextInput label={t('Full name', 'Nom complet')} placeholder={t('e.g. Awa Cissé', 'Ex. : Awa Cissé')} />
        <AppTextInput
          label={t('Mobile money / phone number', 'Mobile money / numéro de téléphone')}
          placeholder={`${c.dial} 07 12 34 56 78`}
          keyboardType="phone-pad"
        />
        <Text style={s.label}>{t('Method', 'Moyen')}</Text>
        <View style={s.wrap}>
          {c.methods.map(m => (
            <Chip key={m} label={m} active={m === method} onPress={() => setMethod(m)} />
          ))}
        </View>
        <AppButton
          title={t('Save recipient', 'Enregistrer le bénéficiaire')}
          style={layout.mt8}
          onPress={() => setAdding(false)}
        />
      </BottomSheet>
    </Screen>
  );
}

/* ---------- 2 · Amount ---------- */

export function SendAmountScreen({ navigation, route }: ScreenProps<'SendAmount'>) {
  const { t, language, colors } = usePreferences();
  const s = useThemedStyles(makeStyles);
  const { senderCountry } = useAppData();
  const r = recipientById(route.params.recipientId);
  const c = countryByCode(r.countryCode);
  const from = countryByCode(senderCountry);
  const [text, setText] = useState('75000');
  const amount = Number(text) || 0;
  const fee = feeFor(amount);

  return (
    <Screen
      title={t('Send money', 'Envoyer de l’argent')}
      footer={
        <>
          <AppButton
            title={t('Continue', 'Continuer')}
            disabled={amount <= 0}
            onPress={() => navigation.navigate('SendPayment', { recipientId: r.id, amount })}
          />
          <AppButton title={t('Back', 'Retour')} variant="ghost" onPress={() => navigation.goBack()} />
        </>
      }
    >
      <StepHeader step={2} total={4} />
      <PageTitle
        title={t('How much?', 'Quel montant ?')}
        subtitle={t(
          `${from.flag} ${from.name.en} → ${c.flag} ${c.name.en} · to ${r.name}`,
          `${from.flag} ${from.name.fr} → ${c.flag} ${c.name.fr} · à ${r.name}`,
        )}
      />
      <Card style={s.amountCard}>
        <Text style={s.amountLabel}>{t('You send', 'Vous envoyez')}</Text>
        <View style={s.amountRow}>
          <TextInput
            value={text}
            onChangeText={v => setText(v.replace(/[^0-9]/g, '').slice(0, 9))}
            keyboardType="number-pad"
            style={s.amountInput}
            placeholder="0"
            placeholderTextColor={colors.textMuted}
          />
          <Text style={s.currency}>XOF</Text>
        </View>
        <Text style={s.amountHint}>
          {t('Choose a payment method on the next step', 'Moyen de paiement à l’étape suivante')}
        </Text>
      </Card>
      <Card style={layout.mt14}>
        <SummaryRow label={t('Transfer fee', 'Frais de transfert')} value={xof(fee, language)} />
        <SummaryRow label={t('Total charged', 'Total débité')} value={xof(amount + fee, language)} />
        <SummaryRow label={t('They receive', 'Montant reçu')} value={xof(amount, language)} strong last />
      </Card>
      <View style={s.quick}>
        {[10000, 25000, 50000, 100000].map(v => (
          <Chip key={v} label={num(v, language)} active={amount === v} onPress={() => setText(String(v))} />
        ))}
      </View>
      <View style={layout.mt12}>
        <InfoNote
          icon="globe"
          text={t(
            'Same currency in all 8 countries — no exchange rate. What you send is what they receive.',
            'Même monnaie dans les 8 pays — aucun taux de change. Le montant envoyé est le montant reçu.',
          )}
        />
      </View>
    </Screen>
  );
}

/* ---------- 3 · Payment method ---------- */

export function SendPaymentScreen({ navigation, route }: ScreenProps<'SendPayment'>) {
  const { t, language } = usePreferences();
  const s = useThemedStyles(makeStyles);
  const { recipientId, amount } = route.params;
  const r = recipientById(recipientId);
  const c = countryByCode(r.countryCode);
  const [method, setMethod] = useState<PaymentMethodKey>('auto');

  return (
    <Screen
      title={t('Send money', 'Envoyer de l’argent')}
      footer={
        <>
          <AppButton
            title={t('Continue', 'Continuer')}
            onPress={() => navigation.navigate('SendReview', { recipientId, amount, method })}
          />
          <AppButton title={t('Back', 'Retour')} variant="ghost" onPress={() => navigation.goBack()} />
        </>
      }
    >
      <StepHeader step={3} total={4} />
      <PageTitle
        title={t('How do you want to pay?', 'Comment souhaitez-vous payer ?')}
        subtitle={t(
          `Paying ${xof(amount, language)} to ${r.name} · ${c.flag} ${c.name.en}`,
          `Envoi de ${xof(amount, language)} à ${r.name} · ${c.flag} ${c.name.fr}`,
        )}
      />
      <View style={s.list}>
        <RadioCard
          icon={AUTO_METHOD.icon}
          title={t(AUTO_METHOD.label.en, AUTO_METHOD.label.fr)}
          subtitle={t(AUTO_METHOD.hint.en, AUTO_METHOD.hint.fr)}
          caption={t(`Cheapest route to ${c.flag} ${c.name.en}`, `Coût minimal vers ${c.flag} ${c.name.fr}`)}
          selected={method === 'auto'}
          onPress={() => setMethod('auto')}
        />
        {PAYMENT_METHODS.map(m => (
          <RadioCard
            key={m.key}
            icon={m.icon}
            title={t(m.label.en, m.label.fr)}
            subtitle={t(m.hint.en, m.hint.fr)}
            caption={t(m.rail.en, m.rail.fr)}
            selected={method === m.key}
            onPress={() => setMethod(m.key)}
          />
        ))}
      </View>
    </Screen>
  );
}

/* ---------- 4 · Review ---------- */

export function TransferSummary({ params }: { params: TransferParams }) {
  const { t, language } = usePreferences();
  const s = useThemedStyles(makeStyles);
  const { senderCountry } = useAppData();
  const r = recipientById(params.recipientId);
  const from = countryByCode(senderCountry);
  const to = countryByCode(r.countryCode);
  const m = methodByKey(params.method);
  const fee = feeFor(params.amount);
  const methodLabel =
    params.method === 'auto' ? t('Auto · mobile money', 'Auto · mobile money') : t(m.label.en, m.label.fr);
  return (
    <>
      <Card style={s.recipient}>
        <Avatar initials={r.initials} tone={r.tone} />
        <View style={layout.flex1}>
          <Text style={s.recipientName}>{r.name}</Text>
          <Text style={s.recipientSub}>{`${r.method} · ${r.phone}`}</Text>
        </View>
      </Card>
      <Card style={layout.mt12}>
        <SummaryRow
          label={t('Route', 'Trajet')}
          value={`${from.flag} ${t(from.name.en, from.name.fr)} → ${to.flag} ${t(to.name.en, to.name.fr)}`}
        />
        <SummaryRow label={t('You send', 'Vous envoyez')} value={xof(params.amount, language)} />
        <SummaryRow label={t('Fee', 'Frais')} value={xof(fee, language)} />
        <SummaryRow label={t('Total charged', 'Total débité')} value={xof(params.amount + fee, language)} />
        <SummaryRow label={t('Payment method', 'Moyen de paiement')} value={methodLabel} />
        <SummaryRow label={t('They receive', 'Montant reçu')} value={xof(params.amount, language)} strong last />
      </Card>
    </>
  );
}

export function SendReviewScreen({ navigation, route }: ScreenProps<'SendReview'>) {
  const { t, language, colors } = usePreferences();
  const s = useThemedStyles(makeStyles);
  const params = route.params;
  const [redirecting, setRedirecting] = useState(false);
  const total = xof(params.amount + feeFor(params.amount), language);
  const gateway =
    params.method === 'card' ? 'Visa / Mastercard' : params.method === 'bank' ? t('your bank', 'votre banque') : 'CinetPay';

  useEffect(() => {
    if (!redirecting) {
      return;
    }
    const id = setTimeout(() => {
      setRedirecting(false);
      if (params.method === 'card') {
        navigation.navigate('CardVerification', params);
      } else if (params.method === 'bank') {
        navigation.navigate('BankApp', params);
      } else {
        navigation.navigate('SecureGateway', params);
      }
    }, 1800);
    return () => clearTimeout(id);
  }, [redirecting, navigation, params]);

  return (
    <Screen
      title={t('Send money', 'Envoyer de l’argent')}
      footer={
        <>
          <AppButton title={t('Confirm and send', 'Confirmer et envoyer')} icon="lock" onPress={() => setRedirecting(true)} />
          <AppButton title={t('Back', 'Retour')} variant="ghost" onPress={() => navigation.goBack()} />
        </>
      }
    >
      <StepHeader step={4} total={4} />
      <PageTitle
        title={t('Review your transfer', 'Vérifiez votre transfert')}
        subtitle={t(
          "Check the details — transfers can't be recalled once sent.",
          'Vérifiez les détails : un transfert envoyé ne peut pas être annulé.',
        )}
      />
      <TransferSummary params={params} />
      <View style={layout.mt12}>
        <InfoNote
          icon="info"
          text={t(
            'Mobile money transfers usually arrive within minutes. Bank transfers can take longer if the receiving bank needs extra checks.',
            'Les transferts mobile money arrivent généralement en quelques minutes. Un virement bancaire peut prendre plus de temps si la banque du bénéficiaire fait des contrôles.',
          )}
        />
      </View>

      <Modal visible={redirecting} transparent animationType="fade" onRequestClose={() => setRedirecting(false)}>
        <View style={s.overlay}>
          <View style={s.redirect}>
            <View style={s.redirectIcon}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
            <Text style={s.redirectTitle}>{t('Redirecting to secure payment…', 'Redirection vers le paiement sécurisé…')}</Text>
            <Text style={s.redirectBody}>
              {t(
                `We're taking you to ${gateway} to authorise ${total}. Please don't close the app.`,
                `Nous vous redirigeons vers ${gateway} pour autoriser ${total}. Ne fermez pas l’application.`,
              )}
            </Text>
            <View style={s.secure}>
              <Icon name="shield" size={16} color={colors.primary} />
              <Text style={s.secureText}>{t('Secure, encrypted payment', 'Paiement sécurisé et chiffré')}</Text>
            </View>
            <AppButton title={t('Cancel', 'Annuler')} variant="outline" onPress={() => setRedirecting(false)} style={layout.stretch} />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

/* ---------- Transfer sent ---------- */

export function TransferSentScreen({ navigation, route }: ScreenProps<'TransferSent'>) {
  const { t, language } = usePreferences();
  const r = recipientById(route.params.recipientId);
  const amount = xof(route.params.amount, language);
  return (
    <Screen
      back={false}
      footer={
        <>
          <AppButton
            title={t('Track this transfer', 'Suivre ce transfert')}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main', params: { screen: 'History' } }] })}
          />
          <AppButton
            title={t('Send another', 'Effectuer un autre envoi')}
            variant="outline"
            onPress={() => navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'SendRecipient' }] })}
          />
        </>
      }
    >
      <ResultHero
        title={t('Transfer sent', 'Transfert envoyé')}
        message={t(
          `${amount} is on its way to ${r.name} via ${r.method}. No exchange rate — they receive the full amount.`,
          `${amount} sont en route vers ${r.name} via ${r.method}. Aucun taux de change — le montant arrive en entier.`,
        )}
      />
      <Card>
        <SummaryRow label={t('Reference', 'Référence')} value="DJW-8845102" />
        <SummaryRow label={t('Estimated arrival', 'Arrivée estimée')} value={t('Within 10 minutes', 'Sous 10 minutes')} last />
      </Card>
    </Screen>
  );
}

/* ---------- Scanned recipient ---------- */

export function ScannedRecipientScreen({ navigation, route }: ScreenProps<'ScannedRecipient'>) {
  const { t } = usePreferences();
  const s = useThemedStyles(makeStyles);
  const ok = route.params.hasAccount;
  const r = ok ? RECIPIENTS[0] : RECIPIENTS[1];
  return (
    <Screen
      title={t('Send money', 'Envoyer de l’argent')}
      footer={
        <>
          <AppButton
            title={t('Continue', 'Continuer')}
            disabled={!ok}
            onPress={() => navigation.navigate('SendAmount', { recipientId: r.id })}
          />
          {!ok ? (
            <AppButton
              title={t('Scan another code', 'Scanner un autre code')}
              variant="outline"
              icon="scan"
              onPress={() => navigation.navigate('QrScanner')}
            />
          ) : null}
        </>
      }
    >
      <PageTitle
        title={t("Who you're paying", 'Qui vous payez')}
        subtitle={t('Scanned from a Djawei QR code.', 'Scanné depuis un QR code Djawei.')}
      />
      <Card style={s.recipient}>
        <Avatar initials={r.initials} tone={r.tone} size={52} />
        <View style={layout.flex1}>
          <Text style={s.recipientName}>{r.name}</Text>
          <Text style={s.recipientSub}>{t('Djawei user', 'Utilisateur Djawei')}</Text>
        </View>
      </Card>
      {ok ? (
        <>
          <Card style={layout.mt12}>
            <SummaryRow label={t('Paid out to', 'Versé sur')} value="Wave" />
            <SummaryRow label={t('Account', 'Compte')} value="•••• 12" />
            <SummaryRow label={t('Country', 'Pays')} value={t('🇸🇳 Senegal', '🇸🇳 Sénégal')} />
            <SummaryRow label={t('They receive in', 'Reçoit en')} value="XOF" last />
          </Card>
          <View style={layout.mt12}>
            <InfoNote icon="lock" text={t('You only see the last 4 digits of their account.', 'Vous ne voyez que les 4 derniers chiffres de son compte.')} />
          </View>
        </>
      ) : (
        <View style={layout.mt12}>
          <InfoNote
            tone="gold"
            icon="alert"
            text={t(
              "This person hasn't set up a receiving account yet. Ask them to add a bank or mobile-money account in Djawei, then scan their code again.",
              'Cette personne n’a pas encore configuré de compte de réception. Demandez-lui d’ajouter un compte bancaire ou mobile money dans Djawei, puis scannez à nouveau son code.',
            )}
          />
        </View>
      )}
    </Screen>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    list: { gap: 10 },
    label: { color: c.text, fontSize: 13, fontWeight: '600', marginTop: 4, marginBottom: 8 },
    chips: { gap: 8 },
    fromRow: { paddingTop: 8, paddingBottom: 16 },
    wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    amountCard: { paddingVertical: 20, alignItems: 'center' },
    amountLabel: { color: c.textMuted, fontSize: 13, fontWeight: '600' },
    amountRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
    currency: { color: c.textMuted, fontSize: 24, fontWeight: '700', marginLeft: 8 },
    amountInput: { color: c.text, fontSize: 40, fontWeight: '700', minWidth: 60, padding: 0 },
    amountHint: { color: c.textMuted, fontSize: 12 },
    quick: { flexDirection: 'row', gap: 8, marginTop: 14, justifyContent: 'center' },
    recipient: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
    recipientName: { color: c.text, fontSize: 16, fontWeight: '600' },
    recipientSub: { color: c.textMuted, fontSize: 13, marginTop: 2 },
    overlay: { flex: 1, backgroundColor: c.overlay, justifyContent: 'center', padding: 24 },
    redirect: { backgroundColor: c.surface, borderRadius: 28, padding: 24, alignItems: 'center', gap: 10 },
    redirectIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: c.primaryTint,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6,
    },
    redirectTitle: { color: c.text, fontSize: 18, fontWeight: '700', textAlign: 'center' },
    redirectBody: { color: c.textMuted, fontSize: 14, lineHeight: 20, textAlign: 'center' },
    secure: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 6 },
    secureText: { color: c.primary, fontSize: 12, fontWeight: '600' },
  });
