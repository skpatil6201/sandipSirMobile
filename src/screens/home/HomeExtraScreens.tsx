/**
 * Notifications (tab), Recipients and Support.
 *
 * @format
 */

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../../components/AppButton';
import AppTextInput from '../../components/AppTextInput';
import Avatar from '../../components/Avatar';
import { Card, IconCircle, ListRow, SectionHeader, StatusPill } from '../../components/Blocks';
import Screen from '../../components/Screen';
import { usePreferences, useThemedStyles } from '../../context/PreferencesContext';
import { HELP_TOPICS, NOTIFICATIONS, RECIPIENTS, countryByCode } from '../../data/mock';
import type { RootStackParamList, ScreenProps } from '../../navigation/types';
import type { ThemeColors } from '../../theme';
import { layout } from '../../theme/layout';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function NotificationsScreen() {
  const s = useThemedStyles(makeStyles);
  const { t } = usePreferences();
  const navigation = useNavigation<Nav>();
  const groups = [
    { key: 'today', label: t('TODAY', 'AUJOURD’HUI') },
    { key: 'earlier', label: t('EARLIER', 'PLUS TÔT') },
  ];
  const target = (id: string) => {
    if (id === 'n3') {
      navigation.navigate('KycPersonal');
    } else if (id === 'n5') {
      navigation.navigate('PaymentMethods');
    } else {
      navigation.navigate('Main', { screen: 'History' });
    }
  };
  return (
    <Screen title={t('Notifications', 'Notifications')} back={false} tabs>
      {groups.map(g => (
        <View key={g.key}>
          <SectionHeader title={g.label} caps />
          <Card>
            {NOTIFICATIONS.filter(n => n.group === g.key).map((n, i, arr) => (
              <ListRow
                key={n.id}
                leading={<IconCircle name={n.icon} tone={n.tone as 'green' | 'gold'} />}
                title={t(n.title.en, n.title.fr)}
                subtitle={t(n.body.en, n.body.fr)}
                right={<Text style={s.time}>{t(n.time.en, n.time.fr)}</Text>}
                onPress={() => target(n.id)}
                last={i === arr.length - 1}
              />
            ))}
          </Card>
        </View>
      ))}
    </Screen>
  );
}

export function RecipientsList({
  onPick,
  searchLabel,
}: {
  onPick: (id: string) => void;
  searchLabel: string;
}) {
  const { t } = usePreferences();
  const [q, setQ] = useState('');
  const list = RECIPIENTS.filter(r => r.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <AppTextInput icon="search" placeholder={searchLabel} value={q} onChangeText={setQ} />
      <Card style={layout.mt16}>
        {list.map((r, i) => {
          const c = countryByCode(r.countryCode);
          return (
            <ListRow
              key={r.id}
              leading={<Avatar initials={r.initials} tone={r.tone} />}
              title={r.name}
              subtitle={`${r.method} · ${t(c.name.en, c.name.fr)}`}
              onPress={() => onPick(r.id)}
              last={i === list.length - 1}
            />
          );
        })}
      </Card>
    </>
  );
}

export function RecipientsScreen({ navigation }: ScreenProps<'Recipients'>) {
  const { t } = usePreferences();
  return (
    <Screen
      title={t('Recipients', 'Bénéficiaires')}
      footer={
        <AppButton
          title={t('New recipient', 'Nouveau bénéficiaire')}
          icon="plus"
          onPress={() => navigation.navigate('SendRecipient')}
        />
      }
    >
      <RecipientsList
        searchLabel={t('Search name or number', 'Rechercher un nom ou un numéro')}
        onPick={id => navigation.navigate('SendAmount', { recipientId: id })}
      />
    </Screen>
  );
}

export function SupportScreen({ navigation }: ScreenProps<'Support'>) {
  const s = useThemedStyles(makeStyles);
  const { t } = usePreferences();
  return (
    <Screen title={t('Support', 'Assistance')}>
      <Card>
        <ListRow icon="chat" title={t('Live chat', 'Chat en direct')} subtitle={t('Average reply in 2 minutes', 'Réponse moyenne en 2 minutes')} onPress={() => navigation.navigate('LiveChat')} />
        <ListRow icon="help" title={t('Help centre', 'Centre d’aide')} subtitle={t('Answers to common questions', 'Réponses aux questions fréquentes')} onPress={() => navigation.navigate('HelpCentre')} />
        <ListRow icon="mail" title={t('Contact support', 'Contacter l’assistance')} subtitle={t('Email or phone', 'E-mail ou téléphone')} onPress={() => navigation.navigate('ContactSupport')} last />
      </Card>
      <SectionHeader title={t('POPULAR QUESTIONS', 'QUESTIONS FRÉQUENTES')} caps />
      <Card>
        {[HELP_TOPICS[0], HELP_TOPICS[1], HELP_TOPICS[3]].map((q, i) => (
          <ListRow key={i} title={t(q.en, q.fr)} onPress={() => navigation.navigate('HelpArticle')} last={i === 2} />
        ))}
      </Card>
      <SectionHeader title={t('YOUR RECENT TRANSFER', 'VOTRE DERNIER TRANSFERT')} caps />
      <Card style={s.recent}>
        <View style={s.recentRow}>
          <Avatar initials="FS" />
          <View style={layout.flex1}>
            <Text style={s.recentTitle}>{t('Fatou Sarr · 50,000 XOF', 'Fatou Sarr · 50 000 XOF')}</Text>
            <Text style={s.recentSub}>{t('Wave · Senegal', 'Wave · Sénégal')}</Text>
          </View>
          <StatusPill status="pending" />
        </View>
        <AppButton title={t('Get help', 'Aide')} variant="outline" small onPress={() => navigation.navigate('LiveChat')} />
      </Card>
    </Screen>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    time: { color: c.textMuted, fontSize: 12 },
    recent: { paddingVertical: 16, gap: 14 },
    recentRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    recentTitle: { color: c.text, fontSize: 15, fontWeight: '600' },
    recentSub: { color: c.textMuted, fontSize: 12, marginTop: 2 },
  });
