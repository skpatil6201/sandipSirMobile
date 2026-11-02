/**
 * Help centre, Help article, Live chat, Contact support, Terms, Privacy.
 *
 * @format
 */

import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import AppButton from '../../components/AppButton';
import AppTextInput from '../../components/AppTextInput';
import Avatar from '../../components/Avatar';
import { Card, InfoNote, ListRow, SectionHeader } from '../../components/Blocks';
import Icon from '../../components/Icon';
import Logo from '../../components/Logo';
import Screen from '../../components/Screen';
import { usePreferences, useThemedStyles } from '../../context/PreferencesContext';
import { HELP_TOPICS, USER, type L } from '../../data/mock';
import type { ScreenProps } from '../../navigation/types';
import type { ThemeColors } from '../../theme';
import { layout } from '../../theme/layout';

export function HelpCentreScreen({ navigation }: ScreenProps<'HelpCentre'>) {
  const { t } = usePreferences();
  const [q, setQ] = useState('');
  const list = HELP_TOPICS.filter(x => t(x.en, x.fr).toLowerCase().includes(q.toLowerCase()));
  return (
    <Screen
      title={t('Help centre', 'Centre d’aide')}
      footer={<AppButton title={t('Contact support', 'Contacter l’assistance')} variant="outline" icon="chat" onPress={() => navigation.navigate('ContactSupport')} />}
    >
      <AppTextInput icon="search" placeholder={t('Search help articles', 'Rechercher un article')} value={q} onChangeText={setQ} />
      <SectionHeader title={t('POPULAR TOPICS', 'SUJETS FRÉQUENTS')} caps />
      <Card>
        {list.map((x, i) => (
          <ListRow key={i} icon="file" title={t(x.en, x.fr)} onPress={() => navigation.navigate('HelpArticle')} last={i === list.length - 1} />
        ))}
      </Card>
    </Screen>
  );
}

export function HelpArticleScreen({ navigation }: ScreenProps<'HelpArticle'>) {
  const st = useThemedStyles(makeStyles);
  const { t } = usePreferences();
  return (
    <Screen
      title={t('Help article', 'Article d’aide')}
      footer={<AppButton title={t('Still need help? Chat with us', 'Besoin d’aide ? Discutez avec nous')} icon="chat" onPress={() => navigation.navigate('LiveChat')} />}
    >
      <Text style={st.h1}>{t('How long does a transfer take?', 'Combien de temps prend un transfert ?')}</Text>
      <Text style={st.p}>
        {t(
          'Most transfers arrive within minutes. You’ll get a notification as soon as the money is paid out.',
          'La plupart des transferts arrivent en quelques minutes. Vous êtes notifié dès que l’argent est versé.',
        )}
      </Text>
      <Card style={st.block}>
        <Text style={st.h3}>{t('Mobile money', 'Mobile money')}</Text>
        <Text style={st.p}>
          {t(
            'Orange Money, Wave and Moov Money accounts are usually credited within 5 minutes.',
            'Les comptes Orange Money, Wave et Moov Money sont généralement crédités en moins de 5 minutes.',
          )}
        </Text>
      </Card>
      <Card style={st.block}>
        <Text style={st.h3}>{t('Bank accounts', 'Comptes bancaires')}</Text>
        <Text style={st.p}>
          {t(
            'Bank transfers can take up to 1 business day depending on the receiving bank.',
            'Un virement bancaire peut prendre jusqu’à 1 jour ouvré selon la banque du bénéficiaire.',
          )}
        </Text>
      </Card>
    </Screen>
  );
}

type Msg = { id: number; me: boolean; text: string; time: string };

export function LiveChatScreen() {
  const st = useThemedStyles(makeStyles);
  const { t, colors } = usePreferences();
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const seed: Msg[] = [
    { id: 1, me: false, time: '09:41', text: t('Hi Aminata! How can we help you today?', 'Bonjour Aminata ! Comment pouvons-nous vous aider ?') },
    { id: 2, me: true, time: '09:42', text: t('My transfer to Fatou is still pending.', 'Mon transfert vers Fatou est toujours en attente.') },
    { id: 3, me: false, time: '09:43', text: t('It will arrive within 10 minutes. We’ll notify you.', 'Il arrivera d’ici 10 minutes. Nous vous préviendrons.') },
  ];
  const all = [...seed, ...msgs];
  const send = () => {
    if (!text.trim()) {
      return;
    }
    setMsgs(m => [...m, { id: Date.now(), me: true, time: '09:44', text: text.trim() }]);
    setText('');
  };

  return (
    <Screen
      title={t('Live chat', 'Chat en direct')}
      footer={
        <View style={st.composer}>
          <TextInput
            style={st.input}
            placeholder={t('Type a message…', 'Écrivez un message…')}
            placeholderTextColor={colors.textMuted}
            value={text}
            onChangeText={setText}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <Pressable style={st.sendBtn} onPress={send} accessibilityLabel={t('Send', 'Envoyer')}>
            <Icon name="send" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      }
    >
      {all.map(m => (
        <View key={m.id} style={[st.msgRow, m.me && st.msgRowMe]}>
          {m.me ? null : (
            <View style={st.agent}>
              <Logo size={22} />
            </View>
          )}
          <View style={st.bubbleWrap}>
            <Text style={[st.meta, m.me && st.metaMe]}>
              {m.me ? t('You', 'Vous') : t('Djawei Support', 'Support Djawei')} · {m.time}
            </Text>
            <View style={[st.bubble, m.me ? st.bubbleMe : st.bubbleThem]}>
              <Text style={[st.bubbleText, m.me && st.bubbleTextMe]}>{m.text}</Text>
            </View>
          </View>
          {m.me ? <Avatar initials={USER.initials} size={32} /> : null}
        </View>
      ))}
    </Screen>
  );
}

export function ContactSupportScreen({ navigation }: ScreenProps<'ContactSupport'>) {
  const { t } = usePreferences();
  return (
    <Screen title={t('Contact support', 'Contacter l’assistance')}>
      <Card>
        <ListRow icon="chat" title={t('Live chat', 'Chat en direct')} subtitle={t('Average reply in 2 minutes', 'Réponse moyenne en 2 minutes')} onPress={() => navigation.navigate('LiveChat')} />
        <ListRow icon="mail" title={t('Email', 'E-mail')} subtitle="support@djawei.com" onPress={() => Linking.openURL('mailto:support@djawei.com')} />
        <ListRow
          icon="phone"
          title={t('Phone', 'Téléphone')}
          subtitle={t('+225 27 20 00 00 00 · Mon–Sat 8:00–20:00', '+225 27 20 00 00 00 · lun–sam 8h–20h')}
          onPress={() => Linking.openURL('tel:+2252720000000')}
          last
        />
      </Card>
      <View style={layout.mt12}>
        <InfoNote
          icon="history"
          text={t(
            'We usually reply within 24 hours. Have your transfer reference ready.',
            'Nous répondons généralement sous 24 heures. Gardez la référence de votre transfert à portée de main.',
          )}
        />
      </View>
    </Screen>
  );
}

function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: [L, L][] }) {
  const st = useThemedStyles(makeStyles);
  const { t } = usePreferences();
  return (
    <Screen title={title}>
      <Text style={st.updated}>{updated}</Text>
      {sections.map(([h, p], i) => (
        <View key={i} style={st.legal}>
          <Text style={st.h3}>{t(h.en, h.fr)}</Text>
          <Text style={st.p}>{t(p.en, p.fr)}</Text>
        </View>
      ))}
    </Screen>
  );
}

const l = (en: string, fr: string): L => ({ en, fr });

export function TermsScreen() {
  const { t } = usePreferences();
  return (
    <LegalPage
      title={t('Terms of Service', 'Conditions d’utilisation')}
      updated={t('Last updated: 1 September 2026', 'Dernière mise à jour : 1er septembre 2026')}
      sections={[
        [l('1. Our service', '1. Notre service'), l('Djawei lets you send and receive money between bank and mobile money accounts in the 8 UEMOA countries.', 'Djawei vous permet d’envoyer et de recevoir de l’argent entre comptes bancaires et mobile money dans les 8 pays de l’UEMOA.')],
        [l('2. Your account', '2. Votre compte'), l('You must be 18 or older and verify your identity before sending money.', 'Vous devez avoir 18 ans ou plus et vérifier votre identité avant d’envoyer de l’argent.')],
        [l('3. Fees', '3. Frais'), l('All transfers are in XOF, so there is no exchange rate. The fee is shown before you confirm each transfer.', 'Tous les transferts sont en XOF, donc sans taux de change. Les frais sont affichés avant chaque confirmation.')],
        [l('4. Cancellations and refunds', '4. Annulations et remboursements'), l('You can cancel a transfer until it is paid out. Refunds go back to your original payment method.', 'Vous pouvez annuler un transfert tant qu’il n’est pas versé. Le remboursement revient sur votre moyen de paiement.')],
      ]}
    />
  );
}

export function PrivacyScreen() {
  const { t } = usePreferences();
  return (
    <LegalPage
      title={t('Privacy Policy', 'Politique de confidentialité')}
      updated={t('Last updated: 1 September 2026', 'Dernière mise à jour : 1er septembre 2026')}
      sections={[
        [l('What we collect', 'Données collectées'), l('Your identity details, contact information, recipients and transfer history.', 'Votre identité, vos coordonnées, vos bénéficiaires et l’historique de vos transferts.')],
        [l('How we use it', 'Utilisation'), l('To process transfers, prevent fraud and meet our legal obligations.', 'Traiter vos transferts, prévenir la fraude et respecter nos obligations légales.')],
        [l('Sharing', 'Partage'), l('Only with payment partners needed to complete your transfer, and regulators when required.', 'Uniquement avec les partenaires de paiement nécessaires et les autorités lorsque la loi l’exige.')],
        [l('Your rights', 'Vos droits'), l('You can access, correct or delete your data at any time from Profile.', 'Vous pouvez consulter, corriger ou supprimer vos données à tout moment depuis le Profil.')],
      ]}
    />
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    h1: { color: c.text, fontSize: 24, fontWeight: '700', lineHeight: 30, marginBottom: 10 },
    h3: { color: c.text, fontSize: 16, fontWeight: '600', marginBottom: 6 },
    p: { color: c.textMuted, fontSize: 14, lineHeight: 21 },
    block: { paddingVertical: 16, marginTop: 12 },
    updated: { color: c.textMuted, fontSize: 13, marginBottom: 8 },
    legal: { marginTop: 18 },
    msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 14 },
    msgRowMe: { justifyContent: 'flex-end' },
    agent: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    meta: { color: c.textMuted, fontSize: 11, marginBottom: 4 },
    bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
    bubbleThem: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, borderBottomLeftRadius: 6 },
    bubbleMe: { backgroundColor: c.primary, borderBottomRightRadius: 6 },
    bubbleText: { color: c.text, fontSize: 14, lineHeight: 20 },
    composer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    input: {
      flex: 1,
      height: 48,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      paddingHorizontal: 18,
      color: c.text,
      fontSize: 15,
    },
    sendBtn: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bubbleWrap: { maxWidth: '78%' },
    metaMe: { textAlign: 'right' },
    bubbleTextMe: { color: '#FFFFFF' },
  });
