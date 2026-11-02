/**
 * History (tab) + Transaction sheet.
 *
 * @format
 */

import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../../components/AppButton';
import AppTextInput from '../../components/AppTextInput';
import AppDialog from '../../components/AppDialog';
import BottomSheet from '../../components/BottomSheet';
import { Card, Chip, IconCircle, SummaryRow, StatusPill, TransactionRow } from '../../components/Blocks';
import Screen from '../../components/Screen';
import { usePreferences, useThemedStyles } from '../../context/PreferencesContext';
import { TRANSACTIONS, type Transaction, type TxStatus } from '../../data/mock';
import type { ThemeColors } from '../../theme';
import { xof } from '../../utils/format';
import { layout } from '../../theme/layout';

type Filter = 'all' | TxStatus;

export default function HistoryScreen() {
  const s = useThemedStyles(makeStyles);
  const { t, language } = usePreferences();
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<Transaction | null>(null);
  const [saved, setSaved] = useState(false);

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t('All', 'Tous') },
    { key: 'completed', label: t('Completed', 'Terminé') },
    { key: 'pending', label: t('Pending', 'En attente') },
    { key: 'failed', label: t('Failed', 'Échec') },
  ];

  const list = TRANSACTIONS.filter(
    tx =>
      (filter === 'all' || tx.status === filter) &&
      (t(tx.title.en, tx.title.fr) + tx.reference).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <Screen title={t('History', 'Historique')} back={false} tabs>
      <AppTextInput
        icon="search"
        placeholder={t('Search name or reference', 'Rechercher un nom ou une référence')}
        value={q}
        onChangeText={setQ}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
        {filters.map(f => (
          <Chip key={f.key} label={f.label} active={filter === f.key} onPress={() => setFilter(f.key)} />
        ))}
      </ScrollView>
      <Text style={s.month}>{t('August 2026', 'Août 2026')}</Text>
      <Card>
        {list.length === 0 ? (
          <Text style={s.empty}>{t('No transactions', 'Aucune transaction')}</Text>
        ) : (
          list.map((tx, i) => (
            <TransactionRow key={tx.id} tx={tx} showStatus last={i === list.length - 1} onPress={() => setOpen(tx)} />
          ))
        )}
      </Card>

      <BottomSheet visible={!!open} onClose={() => setOpen(null)}>
        {open ? (
          <View>
            <View style={s.sheetHead}>
              <IconCircle name={open.icon} size={56} tone={open.amount > 0 ? 'gold' : 'green'} />
              <Text style={s.sheetTitle}>{t(open.title.en, open.title.fr)}</Text>
              <Text style={s.sheetSub}>{t(open.subtitle.en, open.subtitle.fr)}</Text>
              <Text style={s.sheetAmount}>{xof(open.amount, language, { sign: true })}</Text>
            </View>
            <SummaryRow label={t('Status', 'Statut')} right={<StatusPill status={open.status} />} />
            <SummaryRow label={t('Date', 'Date')} value={t(open.date.en, open.date.fr)} />
            <SummaryRow label={t('Reference', 'Référence')} value={open.reference} last />
            <AppButton
              title={t('Download receipt', 'Télécharger le reçu')}
              icon="download"
              variant="outline"
              style={layout.mt16}
              onPress={() => {
                setOpen(null);
                setSaved(true);
              }}
            />
          </View>
        ) : null}
      </BottomSheet>

      <AppDialog
        visible={saved}
        title={t('Receipt saved', 'Reçu enregistré')}
        message={t('Your receipt was saved to your downloads.', 'Votre reçu a été enregistré dans vos téléchargements.')}
        primary={{ label: t('Done', 'Terminé'), onPress: () => setSaved(false) }}
        onClose={() => setSaved(false)}
      />
    </Screen>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    chips: { gap: 8, paddingVertical: 14 },
    month: { color: c.textMuted, fontSize: 13, fontWeight: '600', marginBottom: 10 },
    empty: { color: c.textMuted, textAlign: 'center', paddingVertical: 24 },
    sheetHead: { alignItems: 'center', gap: 4, marginBottom: 12 },
    sheetTitle: { color: c.text, fontSize: 18, fontWeight: '700', marginTop: 8 },
    sheetSub: { color: c.textMuted, fontSize: 13 },
    sheetAmount: { color: c.text, fontSize: 28, fontWeight: '700', marginTop: 8 },
  });
