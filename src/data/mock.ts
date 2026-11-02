/**
 * Static demo data for every screen (EN + FR).
 *
 * TODO(Firebase): replace these exports with Firestore / provider queries.
 *
 * @format
 */

import type { IconName } from '../components/Icon';

/** A bilingual string. Use `t(x.en, x.fr)` or the `tl()` helper. */
export type L = { en: string; fr: string };
const l = (en: string, fr: string): L => ({ en, fr });

/** Demo fee: 1% of the amount, minimum 100 XOF. Same currency everywhere. */
export const feeFor = (amount: number) => Math.max(100, Math.round(amount * 0.01));

export const USER = {
  firstName: 'Aminata',
  name: 'Aminata Diallo',
  initials: 'AD',
  email: 'aminata@example.com',
  phone: '+225 07 12 34 56 78',
  phoneMasked: '+225 •••• 678',
  countryCode: 'CI',
  dob: l('14 March 1992', '14 mars 1992'),
  address: l('Rue des Jardins, Cocody, Abidjan', 'Rue des Jardins, Cocody, Abidjan'),
  referralCode: 'AMINATA25',
  kycVerified: false,
};

export type Country = {
  code: string;
  flag: string;
  name: L;
  dial: string;
  methods: string[];
};

export const COUNTRIES: Country[] = [
  { code: 'CI', flag: '🇨🇮', name: l("Côte d'Ivoire", "Côte d'Ivoire"), dial: '+225', methods: ['Orange Money', 'Wave', 'Moov Money', 'MTN Mobile Money'] },
  { code: 'SN', flag: '🇸🇳', name: l('Senegal', 'Sénégal'), dial: '+221', methods: ['Orange Money', 'Wave', 'Free Money'] },
  { code: 'BJ', flag: '🇧🇯', name: l('Benin', 'Bénin'), dial: '+229', methods: ['MTN Mobile Money', 'Moov Money'] },
  { code: 'TG', flag: '🇹🇬', name: l('Togo', 'Togo'), dial: '+228', methods: ['T-Money', 'Moov Money'] },
  { code: 'BF', flag: '🇧🇫', name: l('Burkina Faso', 'Burkina Faso'), dial: '+226', methods: ['Orange Money', 'Moov Money'] },
  { code: 'ML', flag: '🇲🇱', name: l('Mali', 'Mali'), dial: '+223', methods: ['Orange Money', 'Moov Money'] },
  { code: 'NE', flag: '🇳🇪', name: l('Niger', 'Niger'), dial: '+227', methods: ['Orange Money', 'Moov Money'] },
  { code: 'GW', flag: '🇬🇼', name: l('Guinea-Bissau', 'Guinée-Bissau'), dial: '+245', methods: ['Orange Money', 'MTN Mobile Money'] },
];

export const countryByCode = (code: string) =>
  COUNTRIES.find(c => c.code === code) ?? COUNTRIES[0];

export type Recipient = {
  id: string;
  name: string;
  short: string;
  initials: string;
  tone: 'green' | 'gold';
  countryCode: string;
  method: string;
  phone: string;
};

export const RECIPIENTS: Recipient[] = [
  { id: 'r1', name: 'Aminata Diallo', short: 'Aminata', initials: 'AD', tone: 'green', countryCode: 'SN', method: 'Orange Money', phone: '+221 77 ••• 4412' },
  { id: 'r2', name: 'Ibrahim Traoré', short: 'Ibrahim', initials: 'IT', tone: 'gold', countryCode: 'BJ', method: 'MTN Mobile Money', phone: '+229 97 ••• 5560' },
  { id: 'r3', name: 'Fatou Sarr', short: 'Fatou', initials: 'FS', tone: 'green', countryCode: 'SN', method: 'Wave', phone: '+221 78 ••• 9021' },
  { id: 'r4', name: 'Awa Cissé', short: 'Awa', initials: 'AC', tone: 'gold', countryCode: 'ML', method: 'Orange Money', phone: '+223 66 ••• 2317' },
  { id: 'r5', name: 'Sara Koné', short: 'Sara', initials: 'SK', tone: 'green', countryCode: 'TG', method: 'Moov Money', phone: '+228 90 ••• 8830' },
];

export const recipientById = (id?: string) =>
  RECIPIENTS.find(r => r.id === id) ?? RECIPIENTS[0];

export type TxStatus = 'completed' | 'pending' | 'failed';

export type Transaction = {
  id: string;
  title: L;
  subtitle: L;
  amount: number;
  status: TxStatus;
  date: L;
  reference: string;
  icon: IconName;
};

export const TRANSACTIONS: Transaction[] = [
  { id: 't1', title: l('Aminata Diallo', 'Aminata Diallo'), subtitle: l('Orange Money · Senegal', 'Orange Money · Sénégal'), amount: -75000, status: 'completed', date: l('24 Aug 2026', '24 août 2026'), reference: 'DJW-8842013', icon: 'send' },
  { id: 't2', title: l('Moussa Ouédraogo', 'Moussa Ouédraogo'), subtitle: l('Received · Orange Money · Burkina Faso', 'Reçu · Orange Money · Burkina Faso'), amount: 200000, status: 'completed', date: l('23 Aug 2026', '23 août 2026'), reference: 'DJW-8841876', icon: 'receive' },
  { id: 't3', title: l('Fatou Sarr', 'Fatou Sarr'), subtitle: l('Wave · Senegal', 'Wave · Sénégal'), amount: -50000, status: 'pending', date: l('22 Aug 2026', '22 août 2026'), reference: 'DJW-8841540', icon: 'send' },
  { id: 't4', title: l('Refund', 'Remboursement'), subtitle: l('Transfer reversed · Moov Money · Togo', 'Transfert annulé · Moov Money · Togo'), amount: 30000, status: 'completed', date: l('19 Aug 2026', '19 août 2026'), reference: 'DJW-8840912', icon: 'refresh' },
  { id: 't5', title: l('Awa Cissé', 'Awa Cissé'), subtitle: l('Orange Money · Mali', 'Orange Money · Mali'), amount: -140000, status: 'completed', date: l('15 Aug 2026', '15 août 2026'), reference: 'DJW-8840133', icon: 'send' },
  { id: 't6', title: l('Ibrahim Traoré', 'Ibrahim Traoré'), subtitle: l('MTN Mobile Money · Benin', 'MTN Mobile Money · Bénin'), amount: -40000, status: 'failed', date: l('11 Aug 2026', '11 août 2026'), reference: 'DJW-8839507', icon: 'send' },
];

export type PaymentMethodKey = 'auto' | 'mobileMoney' | 'bank' | 'card';

export type PaymentMethod = {
  key: PaymentMethodKey;
  icon: IconName;
  label: L;
  hint: L;
  rail: L;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  { key: 'mobileMoney', icon: 'mobile', label: l('Mobile money', 'Mobile money'), hint: l('Instant · Orange, MTN, Moov, Wave', 'Instantané · Orange, MTN, Moov, Wave'), rail: l('Paid from your mobile-money wallet', 'Payé depuis votre compte mobile money') },
  { key: 'bank', icon: 'bank', label: l('Bank account', 'Compte bancaire'), hint: l('Instant bank transfer', 'Virement bancaire instantané'), rail: l('Bank-to-bank across UEMOA', 'De banque à banque dans l’UEMOA') },
  { key: 'card', icon: 'card', label: l('Debit / credit card', 'Carte de débit / crédit'), hint: l('Visa, Mastercard, GIM-UEMOA', 'Visa, Mastercard, GIM-UEMOA'), rail: l('Secured by 3-D Secure', 'Sécurisé par 3-D Secure') },
];

export const AUTO_METHOD: PaymentMethod = {
  key: 'auto',
  icon: 'zap',
  label: l('Auto · lowest fee', 'Auto · frais réduits'),
  hint: l('Uses your mobile money', 'Utilise votre mobile money'),
  rail: l('Cheapest route to', 'Coût minimal vers'),
};

export const methodByKey = (key: PaymentMethodKey) =>
  key === 'auto' ? AUTO_METHOD : PAYMENT_METHODS.find(m => m.key === key) ?? AUTO_METHOD;

export const NOTIFICATIONS = [
  { id: 'n1', group: 'today', icon: 'receive' as IconName, tone: 'green', title: l('Money received', 'Argent reçu'), time: l('2 min', '2 min'), body: l('+200,000 XOF from Moussa Ouédraogo · Burkina Faso', '+200 000 XOF de Moussa Ouédraogo · Burkina Faso') },
  { id: 'n2', group: 'today', icon: 'check' as IconName, tone: 'green', title: l('Transfer completed', 'Transfert terminé'), time: l('1 h', '1 h'), body: l('75,000 XOF to Aminata Diallo · Senegal', '75 000 XOF à Aminata Diallo · Sénégal') },
  { id: 'n3', group: 'earlier', icon: 'shield' as IconName, tone: 'gold', title: l('Verify your identity', 'Vérifiez votre identité'), time: l('1 d', '1 j'), body: l('Raise your monthly limit to 10,000,000 XOF', 'Passez à 10 000 000 XOF par mois') },
  { id: 'n4', group: 'earlier', icon: 'globe' as IconName, tone: 'green', title: l('Now live in 8 countries', 'Disponible dans 8 pays'), time: l('2 d', '2 j'), body: l('Send to Guinea-Bissau and Niger too', 'Envoyez aussi vers la Guinée-Bissau et le Niger') },
  { id: 'n5', group: 'earlier', icon: 'card' as IconName, tone: 'green', title: l('Payment method added', 'Moyen de paiement ajouté'), time: l('5 d', '5 j'), body: l('Visa •••• 4417', 'Visa •••• 4417') },
];

export type ReceivingAccount = {
  id: string;
  type: 'bank' | 'mobile';
  provider: string;
  holder: string;
  last: string;
  countryCode: string;
};

export const RECEIVING_ACCOUNTS: ReceivingAccount[] = [
  { id: 'a1', type: 'mobile', provider: 'Orange Money', holder: 'Awa Cissé', last: '78', countryCode: 'CI' },
  { id: 'a2', type: 'bank', provider: 'Ecobank', holder: 'Awa Cissé', last: '4021', countryCode: 'SN' },
  { id: 'a3', type: 'mobile', provider: 'Wave', holder: 'Awa Cissé', last: '12', countryCode: 'SN' },
];

export const TRUSTED_DEVICES = [
  { id: 'd1', name: 'iPhone 15 Pro', icon: 'mobile' as IconName, current: true, detail: l('This device · Abidjan', 'Cet appareil · Abidjan') },
  { id: 'd2', name: 'MacBook Air', icon: 'laptop' as IconName, current: false, detail: l('Chrome · Abidjan · 2 days ago', 'Chrome · Abidjan · il y a 2 jours') },
  { id: 'd3', name: 'Samsung Galaxy S23', icon: 'mobile' as IconName, current: false, detail: l('Dakar · 3 weeks ago', 'Dakar · il y a 3 semaines') },
];

export const HELP_TOPICS: L[] = [
  l('How long does a transfer take?', 'Combien de temps prend un transfert ?'),
  l('What are the fees?', 'Quels sont les frais ?'),
  l('How do I verify my identity?', 'Comment vérifier mon identité ?'),
  l('Why was my payment declined?', 'Pourquoi mon paiement a-t-il échoué ?'),
  l('How do I add a recipient?', 'Comment ajouter un bénéficiaire ?'),
];

export const ONBOARDING = [
  {
    icon: 'globe' as IconName,
    title: l('Send money across West Africa', 'Envoyez de l’argent en Afrique de l’Ouest'),
    body: l(
      'Send and receive between Côte d’Ivoire, Senegal, Benin, Togo, Burkina Faso, Mali, Niger and Guinea-Bissau — arriving in minutes.',
      'Envoyez et recevez entre la Côte d’Ivoire, le Sénégal, le Bénin, le Togo, le Burkina Faso, le Mali, le Niger et la Guinée-Bissau — en quelques minutes.',
    ),
  },
  {
    icon: 'trend' as IconName,
    title: l('One currency, one clear fee', 'Une monnaie, des frais clairs'),
    body: l(
      'Everything stays in XOF — no exchange rate. See the fee and exactly what your recipient gets before you confirm.',
      'Tout reste en XOF — aucun taux de change. Voyez les frais et le montant exact reçu avant de confirmer.',
    ),
  },
  {
    icon: 'lock' as IconName,
    title: l('Direct to bank or mobile money', 'Directement sur un compte bancaire ou mobile money'),
    body: l(
      'Send from mobile money, a bank account or a card, straight to the recipient’s Orange, MTN, Moov, Wave or bank account. No wallet, no top-ups.',
      'Envoyez depuis votre mobile money, votre banque ou une carte, directement sur le compte Orange, MTN, Moov, Wave ou bancaire du bénéficiaire. Sans portefeuille ni recharge.',
    ),
  },
];
