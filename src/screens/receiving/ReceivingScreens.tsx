/**
 * Receiving accounts: list / empty / options, and the 3-step add flow
 * (type & country → bank or mobile-money details → review → added).
 *
 * @format
 */

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppButton from '../../components/AppButton';
import AppDialog from '../../components/AppDialog';
import AppTextInput from '../../components/AppTextInput';
import BottomSheet from '../../components/BottomSheet';
import {
  Badge,
  Card,
  CheckRow,
  Chip,
  IconCircle,
  InfoNote,
  ListRow,
  PageTitle,
  ResultHero,
  Segmented,
  StepHeader,
  SummaryRow,
  ToggleRow,
} from '../../components/Blocks';
import Icon from '../../components/Icon';
import Screen from '../../components/Screen';
import { useAppData } from '../../context/AppDataContext';
import { usePreferences, useThemedStyles } from '../../context/PreferencesContext';
import { COUNTRIES, countryByCode, type ReceivingAccount } from '../../data/mock';
import type { ScreenProps } from '../../navigation/types';
import type { ThemeColors } from '../../theme';
import { layout } from '../../theme/layout';

const INTRO = {
  en: 'Where your transfers land. Money goes straight to this account — there is no wallet.',
  fr: 'Là où arrivent vos transferts. L’argent va directement sur ce compte — il n’y a pas de portefeuille.',
};

function AccountCard({
  acc,
  isDefault,
  onMore,
}: {
  acc: ReceivingAccount;
  isDefault: boolean;
  onMore?: () => void;
}) {
  const s = useThemedStyles(makeStyles);
  const { t, colors } = usePreferences();
  const c = countryByCode(acc.countryCode);
  const number = acc.type === 'bank' ? `${t('Bank', 'Banque')} •••• ${acc.last}` : `•••• ${acc.last}`;
  return (
    <Card style={s.acc}>
      <IconCircle name={acc.type === 'bank' ? 'bank' : 'mobile'} size={44} />
      <View style={layout.flex1}>
        <View style={s.accHead}>
          <Text style={s.accTitle}>{acc.provider}</Text>
          {isDefault ? <Badge label={t('Default', 'Par défaut')} /> : null}
        </View>
        <Text style={s.accSub}>{acc.holder}</Text>
        <Text style={s.accSub}>{`${number} · ${c.flag} ${t(c.name.en, c.name.fr)}`}</Text>
      </View>
      {onMore ? (
        <Pressable onPress={onMore} hitSlop={10} style={s.more}>
          <Icon name="more" size={20} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </Card>
  );
}

/* ---------- List / Empty / Options ---------- */

export function ReceivingAccountsScreen({ navigation }: ScreenProps<'ReceivingAccounts'>) {
  const s = useThemedStyles(makeStyles);
  const { t } = usePreferences();
  const { accounts, defaultAccountId, setDefaultAccount, removeAccount } = useAppData();
  const [options, setOptions] = useState<ReceivingAccount | null>(null);
  const [confirm, setConfirm] = useState<ReceivingAccount | null>(null);
  const [removed, setRemoved] = useState(false);

  return (
    <Screen
      title={t('Receiving accounts', 'Comptes de réception')}
      footer={
        <AppButton
          title={t('Add receiving account', 'Ajouter un compte de réception')}
          icon="plus"
          onPress={() => navigation.navigate('AddAccountType')}
        />
      }
    >
      <PageTitle title={t('Receiving accounts', 'Comptes de réception')} subtitle={t(INTRO.en, INTRO.fr)} />
      {accounts.length === 0 ? (
        <View style={s.empty}>
          <IconCircle name="bank" size={80} />
          <Text style={s.emptyTitle}>{t('No receiving account yet', 'Aucun compte de réception')}</Text>
          <Text style={s.emptySub}>
            {t('Add a bank or mobile-money account to receive money.', 'Ajoutez un compte bancaire ou mobile money pour recevoir de l’argent.')}
          </Text>
        </View>
      ) : (
        <View style={layout.gap10}>
          {accounts.map(a => (
            <AccountCard key={a.id} acc={a} isDefault={a.id === defaultAccountId} onMore={() => setOptions(a)} />
          ))}
          <View style={layout.mt6}>
            <InfoNote
              icon="lock"
              text={t(
                'People who pay you only ever see the last 4 digits. Full numbers are never shared.',
                'Les personnes qui vous paient ne voient que les 4 derniers chiffres. Les numéros complets ne sont jamais partagés.',
              )}
            />
          </View>
        </View>
      )}

      <BottomSheet
        visible={!!options}
        onClose={() => setOptions(null)}
        title={options ? `${options.provider} •••• ${options.last}` : ''}
        subtitle={
          options
            ? `${options.holder} · ${countryByCode(options.countryCode).flag} ${t(
                countryByCode(options.countryCode).name.en,
                countryByCode(options.countryCode).name.fr,
              )} · XOF`
            : ''
        }
      >
        {options ? (
          <>
            <Card>
              <ListRow
                icon="check"
                title={t('Set as default', 'Définir par défaut')}
                chevron={false}
                onPress={() => {
                  setDefaultAccount(options.id);
                  setOptions(null);
                }}
              />
              <ListRow
                icon="trash"
                danger
                title={t('Remove account', 'Supprimer le compte')}
                chevron={false}
                last
                onPress={() => {
                  setConfirm(options);
                  setOptions(null);
                }}
              />
            </Card>
            <Text style={s.sheetNote}>
              {t(
                'Removing asks for confirmation. If you remove your default, your oldest remaining account becomes the default.',
                'La suppression demande une confirmation. Si vous supprimez votre compte par défaut, le plus ancien compte restant le devient.',
              )}
            </Text>
            <AppButton title={t('Cancel', 'Annuler')} variant="outline" onPress={() => setOptions(null)} />
          </>
        ) : null}
      </BottomSheet>

      <AppDialog
        visible={!!confirm}
        tone="danger"
        icon="trash"
        title={t('Remove this account?', 'Supprimer ce compte ?')}
        message={confirm ? `${confirm.provider} •••• ${confirm.last}` : ''}
        primary={{
          label: t('Remove account', 'Supprimer le compte'),
          onPress: () => {
            if (confirm) {
              removeAccount(confirm.id);
            }
            setConfirm(null);
            setRemoved(true);
          },
        }}
        secondary={{ label: t('Cancel', 'Annuler'), onPress: () => setConfirm(null) }}
        onClose={() => setConfirm(null)}
      />
      <AppDialog
        visible={removed}
        title={t('Account removed', 'Compte supprimé')}
        primary={{ label: t('Done', 'Terminé'), onPress: () => setRemoved(false) }}
        onClose={() => setRemoved(false)}
      />
    </Screen>
  );
}

/* ---------- 1 · Type & country (+ country picker) ---------- */

export function AddAccountTypeScreen({ navigation }: ScreenProps<'AddAccountType'>) {
  const s = useThemedStyles(makeStyles);
  const { t, colors } = usePreferences();
  const [type, setType] = useState<'bank' | 'mobile'>('mobile');
  const [country, setCountry] = useState('CI');
  const [picker, setPicker] = useState(false);
  const [q, setQ] = useState('');
  const c = countryByCode(country);

  return (
    <Screen
      title={t('Add receiving account', 'Nouveau compte')}
      footer={
        <AppButton
          title={t('Continue', 'Continuer')}
          onPress={() =>
            navigation.navigate(type === 'bank' ? 'AddBankDetails' : 'AddMobileDetails', { countryCode: country })
          }
        />
      }
    >
      <StepHeader step={1} total={3} />
      <PageTitle
        title={t('Where should we send your money?', 'Où devons-nous envoyer votre argent ?')}
        subtitle={t('Choose the type of account and the country it is in.', 'Choisissez le type de compte et son pays.')}
      />
      <Text style={s.label}>{t('Account type', 'Type de compte')}</Text>
      <Segmented
        value={type}
        onChange={v => {
          setType(v);
          if (v === 'bank') {
            setCountry('SN');
          }
        }}
        options={[
          { key: 'bank', label: t('Bank account', 'Compte bancaire'), icon: 'bank' },
          { key: 'mobile', label: t('Mobile money', 'Mobile money'), icon: 'mobile' },
        ]}
      />
      <Text style={[s.label, layout.mt18]}>{t('Country', 'Pays')}</Text>
      <Pressable style={s.select} onPress={() => setPicker(true)}>
        <Text style={s.selectText}>{`${c.flag}  ${t(c.name.en, c.name.fr)}`}</Text>
        <Text style={s.selectMuted}>XOF</Text>
        <Icon name="chevD" size={18} color={colors.textMuted} />
      </Pressable>
      <View style={layout.mt16}>
        <InfoNote
          icon="globe"
          text={t(
            "Receiving works in 8 WAEMU countries: Côte d'Ivoire, Senegal, Benin, Togo, Burkina Faso, Mali, Niger and Guinea-Bissau. Money always arrives in XOF.",
            "La réception est disponible dans 8 pays de l’UEMOA : Côte d'Ivoire, Sénégal, Bénin, Togo, Burkina Faso, Mali, Niger et Guinée-Bissau. L’argent arrive toujours en XOF.",
          )}
        />
      </View>

      <BottomSheet visible={picker} onClose={() => setPicker(false)} title={t('Choose country', 'Choisir le pays')}>
        <AppTextInput icon="search" placeholder={t('Search country', 'Rechercher un pays')} value={q} onChangeText={setQ} />
        <Card>
          {COUNTRIES.filter(k => t(k.name.en, k.name.fr).toLowerCase().includes(q.toLowerCase())).map((k, i, arr) => (
            <ListRow
              key={k.code}
              leading={<Text style={s.flagEmoji}>{k.flag}</Text>}
              title={t(k.name.en, k.name.fr)}
              value="XOF"
              chevron={false}
              right={k.code === country ? <Icon name="check" size={18} color={colors.primary} /> : undefined}
              last={i === arr.length - 1}
              onPress={() => {
                setCountry(k.code);
                setPicker(false);
              }}
            />
          ))}
        </Card>
      </BottomSheet>
    </Screen>
  );
}

/* ---------- 2 · Bank details ---------- */

export function AddBankDetailsScreen({ navigation, route }: ScreenProps<'AddBankDetails'>) {
  const { t } = usePreferences();
  const c = countryByCode(route.params.countryCode);
  const [iban, setIban] = useState('SN08 SN01 0015 2000 0253 0001 4021');
  const [confirmIban, setConfirmIban] = useState('SN08 SN01 0015 2000 0253 0001 4012');
  const [mine, setMine] = useState(true);
  const mismatch = confirmIban.length > 0 && iban.replace(/\s/g, '') !== confirmIban.replace(/\s/g, '');

  return (
    <Screen
      title={t('Add receiving account', 'Nouveau compte')}
      footer={
        <AppButton
          title={t('Continue', 'Continuer')}
          disabled={mismatch || !mine}
          onPress={() =>
            navigation.navigate('AddAccountReview', { type: 'bank', countryCode: c.code, provider: 'Ecobank' })
          }
        />
      }
    >
      <StepHeader step={2} total={3} />
      <PageTitle
        title={t('Bank account details', 'Coordonnées bancaires')}
        subtitle={`${c.flag} ${t(c.name.en, c.name.fr)} · XOF · ${t('Bank account', 'Compte bancaire')}`}
      />
      <View style={s.form}>
        <AppTextInput label={t('Account holder name', 'Nom du titulaire')} defaultValue="Awa Cissé" />
        <AppTextInput label={t('Bank name', 'Nom de la banque')} defaultValue="Ecobank Sénégal" icon="bank" />
        <AppTextInput label={t('IBAN or account number', 'IBAN ou numéro de compte')} value={iban} onChangeText={setIban} autoCapitalize="characters" />
        <AppTextInput
          label={t('Confirm account number', 'Confirmer le numéro de compte')}
          value={confirmIban}
          onChangeText={setConfirmIban}
          autoCapitalize="characters"
          error={mismatch ? t("The account numbers don't match", 'Les numéros de compte ne correspondent pas') : undefined}
        />
        <AppTextInput label={t('Currency', 'Devise')} value={t('XOF — West African CFA franc', 'XOF — franc CFA ouest-africain')} editable={false} />
        <CheckRow label={t('I confirm this account belongs to me', 'Je confirme que ce compte m’appartient')} checked={mine} onChange={setMine} />
      </View>
    </Screen>
  );
}

/* ---------- 2 · Mobile money details ---------- */

export function AddMobileDetailsScreen({ navigation, route }: ScreenProps<'AddMobileDetails'>) {
  const st = useThemedStyles(makeStyles);
  const { t } = usePreferences();
  const c = countryByCode(route.params.countryCode);
  const providers = ['Orange Money', 'MTN MoMo', 'Moov Money', 'Wave'];
  const [provider, setProvider] = useState(providers[0]);
  const [mine, setMine] = useState(false);

  return (
    <Screen
      title={t('Add receiving account', 'Nouveau compte')}
      footer={
        <AppButton
          title={t('Continue', 'Continuer')}
          disabled={!mine}
          onPress={() => navigation.navigate('AddAccountReview', { type: 'mobile', countryCode: c.code, provider })}
        />
      }
    >
      <StepHeader step={2} total={3} />
      <PageTitle
        title={t('Mobile money details', 'Détails mobile money')}
        subtitle={`${c.flag} ${t(c.name.en, c.name.fr)} · XOF · Mobile money`}
      />
      <View style={s.form}>
        <AppTextInput label={t('Account holder name', 'Nom du titulaire')} defaultValue="Awa Cissé" />
        <Text style={st.label}>{t('Provider', 'Opérateur')}</Text>
        <View style={st.wrap}>
          {providers.map(p => (
            <Chip key={p} label={p} active={p === provider} onPress={() => setProvider(p)} />
          ))}
        </View>
        <AppTextInput
          label={t('Phone number', 'Numéro de téléphone')}
          defaultValue="07 12 34 56 78"
          keyboardType="phone-pad"
          prefix={<Text style={st.prefix}>{`${c.flag} ${c.dial}`}</Text>}
          hint={t('This is the number your provider pays out to.', 'Votre opérateur versera l’argent sur ce numéro.')}
        />
        <AppTextInput label={t('Currency', 'Devise')} value={t('XOF — West African CFA franc', 'XOF — franc CFA ouest-africain')} editable={false} />
        <CheckRow label={t('I confirm this account belongs to me', 'Je confirme que ce compte m’appartient')} checked={mine} onChange={setMine} />
        {!mine ? (
          <Text style={st.warn}>{t('Confirm this account belongs to you', 'Confirmez que ce compte vous appartient')}</Text>
        ) : null}
      </View>
    </Screen>
  );
}

/* ---------- 3 · Review ---------- */

export function AddAccountReviewScreen({ navigation, route }: ScreenProps<'AddAccountReview'>) {
  const { t } = usePreferences();
  const { accounts, addAccount } = useAppData();
  const { type, countryCode, provider } = route.params;
  const c = countryByCode(countryCode);
  const first = accounts.length === 0;
  const [makeDefault, setMakeDefault] = useState(first);
  const last = type === 'bank' ? '4021' : '78';

  return (
    <Screen
      title={t('Add receiving account', 'Nouveau compte')}
      footer={
        <AppButton
          title={t('Add account', 'Ajouter le compte')}
          onPress={() => {
            addAccount({ type, provider, holder: 'Awa Cissé', last, countryCode }, makeDefault);
            navigation.navigate('AccountAdded', { provider, countryCode });
          }}
        />
      }
    >
      <StepHeader step={3} total={3} />
      <PageTitle
        title={t('Review account', 'Vérifier le compte')}
        subtitle={t(
          'Check the details before you save. Only the last 4 digits are shown to people who pay you.',
          'Vérifiez les informations avant d’enregistrer. Seuls les 4 derniers chiffres sont visibles par les personnes qui vous paient.',
        )}
      />
      <Card>
        <SummaryRow label={t('Type', 'Type')} value={type === 'bank' ? t('Bank account', 'Compte bancaire') : 'Mobile money'} />
        <SummaryRow label={type === 'bank' ? t('Bank', 'Banque') : t('Provider', 'Opérateur')} value={provider} />
        <SummaryRow label={t('Account holder', 'Titulaire')} value="Awa Cissé" />
        <SummaryRow label={t('Number', 'Numéro')} value={`•••• ${last}`} />
        <SummaryRow label={t('Country', 'Pays')} value={`${c.flag} ${t(c.name.en, c.name.fr)}`} />
        <SummaryRow label={t('Currency', 'Devise')} value="XOF" last />
      </Card>
      <View style={layout.mt12}>
        <InfoNote
          text={t(
            'Money sent to you will arrive in this account. Bank transfers can take 1–2 business days; mobile money is usually instant.',
            'L’argent qui vous est envoyé arrivera sur ce compte. Les virements bancaires peuvent prendre 1 à 2 jours ouvrés ; le mobile money est généralement instantané.',
          )}
        />
      </View>
      <Card style={layout.mt12}>
        <ToggleRow
          title={t('Make this my default receiving account', 'Définir comme compte de réception par défaut')}
          subtitle={first ? t('Your first account is always the default.', 'Votre premier compte est toujours celui par défaut.') : undefined}
          value={makeDefault}
          onChange={v => !first && setMakeDefault(v)}
          last
        />
      </Card>
    </Screen>
  );
}

/* ---------- Added ---------- */

export function AccountAddedScreen({ navigation }: ScreenProps<'AccountAdded'>) {
  const { t } = usePreferences();
  const { accounts, defaultAccountId } = useAppData();
  const acc = accounts[accounts.length - 1];
  return (
    <Screen
      back={false}
      footer={
        <>
          <AppButton
            title={t('Go to Receive money', 'Aller à Recevoir de l’argent')}
            onPress={() => navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'ReceiveMoney' }] })}
          />
          <AppButton
            title={t('Done', 'Terminé')}
            variant="outline"
            onPress={() => navigation.reset({ index: 1, routes: [{ name: 'Main', params: { screen: 'Profile' } }, { name: 'ReceivingAccounts' }] })}
          />
        </>
      }
    >
      <ResultHero
        title={t('Receiving account added', 'Compte de réception ajouté')}
        message={t('Transfers to you will now land straight in this account.', 'Les transferts qui vous sont destinés arriveront désormais directement sur ce compte.')}
      />
      {acc ? <AccountCard acc={acc} isDefault={acc.id === defaultAccountId} /> : null}
    </Screen>
  );
}

const s = StyleSheet.create({ form: { gap: 14 } });

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    acc: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16 },
    accHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    accTitle: { color: c.text, fontSize: 16, fontWeight: '600' },
    accSub: { color: c.textMuted, fontSize: 13, marginTop: 2 },
    more: { padding: 4 },
    empty: { alignItems: 'center', paddingVertical: 40, gap: 10 },
    emptyTitle: { color: c.text, fontSize: 18, fontWeight: '700', marginTop: 8 },
    emptySub: { color: c.textMuted, fontSize: 14, textAlign: 'center' },
    sheetNote: { color: c.textMuted, fontSize: 12, lineHeight: 17 },
    label: { color: c.text, fontSize: 13, fontWeight: '600', marginBottom: 8 },
    select: {
      height: 52,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    selectText: { flex: 1, color: c.text, fontSize: 15 },
    selectMuted: { color: c.textMuted, fontSize: 13, fontWeight: '600' },
    wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: -6 },
    prefix: { color: c.text, fontSize: 15, fontWeight: '600' },
    warn: { color: c.danger, fontSize: 12, marginTop: -6 },
    flagEmoji: { fontSize: 26 },
  });
