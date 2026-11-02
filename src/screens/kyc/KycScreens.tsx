/**
 * Identity verification (KYC): personal details → document → selfie.
 *
 * @format
 */

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppButton from '../../components/AppButton';
import AppTextInput from '../../components/AppTextInput';
import AppDialog from '../../components/AppDialog';
import { Card, InfoNote, PageTitle, RadioCard, StepHeader } from '../../components/Blocks';
import Icon from '../../components/Icon';
import Screen from '../../components/Screen';
import { usePreferences, useThemedStyles } from '../../context/PreferencesContext';
import { USER } from '../../data/mock';
import type { ScreenProps } from '../../navigation/types';
import type { ThemeColors } from '../../theme';

const goHome = (navigation: { reset: (s: any) => void }) =>
  navigation.reset({ index: 0, routes: [{ name: 'Main' }] });

export function KycPersonalScreen({ navigation }: ScreenProps<'KycPersonal'>) {
  const { t } = usePreferences();
  return (
    <Screen
      title={t('Identity verification', 'Vérification d’identité')}
      footer={
        <>
          <AppButton title={t('Continue', 'Continuer')} onPress={() => navigation.navigate('KycDocument')} />
          <AppButton title={t('Do this later', 'Plus tard')} variant="ghost" onPress={() => goHome(navigation)} />
        </>
      }
    >
      <StepHeader step={1} total={3} />
      <PageTitle
        title={t(`A few details, ${USER.firstName}`, `Quelques détails, ${USER.firstName}`)}
        subtitle={t(
          'Money transfer regulations require us to verify who you are before your first transfer.',
          'La réglementation nous impose de vérifier votre identité avant votre premier transfert.',
        )}
      />
      <View style={s.form}>
        <AppTextInput label={t('Date of birth', 'Date de naissance')} placeholder={t('DD/MM/YYYY', 'JJ/MM/AAAA')} keyboardType="numbers-and-punctuation" />
        <AppTextInput label={t('Nationality', 'Nationalité')} placeholder={t('e.g. Ivorian', 'Ex. : ivoirienne')} />
        <AppTextInput label={t('Residential address', 'Adresse de résidence')} placeholder={t('Street and number', 'Numéro et rue')} />
        <View style={s.row}>
          <AppTextInput style={s.flex} label={t('City', 'Ville')} placeholder={t('e.g. Abidjan', 'Ex. : Abidjan')} />
          <AppTextInput style={s.flex} label={t('District', 'Quartier')} placeholder={t('e.g. Cocody', 'Ex. : Cocody')} />
        </View>
        <AppTextInput label={t('Occupation', 'Profession')} placeholder={t('e.g. Nurse', 'Ex. : infirmière')} />
      </View>
    </Screen>
  );
}

export function KycDocumentScreen({ navigation }: ScreenProps<'KycDocument'>) {
  const { t } = usePreferences();
  const st = useThemedStyles(makeStyles);
  const { colors } = usePreferences();
  const [doc, setDoc] = useState<'passport' | 'id' | 'permit'>('passport');
  const [photo, setPhoto] = useState(false);
  const docs = [
    { key: 'passport' as const, icon: 'passport' as const, title: t('Passport', 'Passeport'), sub: t('Photo page', 'Page avec photo') },
    { key: 'id' as const, icon: 'idcard' as const, title: t('National ID', 'Carte d’identité'), sub: t('Front and back', 'Recto et verso') },
    { key: 'permit' as const, icon: 'file' as const, title: t('Consular card', 'Carte consulaire'), sub: t('Front and back', 'Recto et verso') },
  ];
  return (
    <Screen
      title={t('Identity verification', 'Vérification d’identité')}
      footer={
        <>
          <AppButton title={t('Continue', 'Continuer')} onPress={() => navigation.navigate('KycSelfie')} />
          <AppButton title={t('Back', 'Retour')} variant="ghost" onPress={() => navigation.goBack()} />
        </>
      }
    >
      <StepHeader step={2} total={3} />
      <PageTitle
        title={t('Identity document', 'Pièce d’identité')}
        subtitle={t(
          'Choose a government-issued document. Make sure every corner is visible and the text is readable.',
          'Choisissez une pièce officielle. Tous les coins doivent être visibles et le texte lisible.',
        )}
      />
      <View style={s.form}>
        {docs.map(d => (
          <RadioCard key={d.key} icon={d.icon} title={d.title} subtitle={d.sub} selected={doc === d.key} onPress={() => setDoc(d.key)} />
        ))}
        <Pressable style={[st.upload, photo && st.uploadDone]} onPress={() => setPhoto(true)}>
          <Icon name={photo ? 'check' : 'camera'} size={28} color={colors.primary} />
          <Text style={st.uploadText}>
            {photo ? t('Photo added', 'Photo ajoutée') : t('Take a photo of your document', 'Photographiez votre document')}
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

export function KycSelfieScreen({ navigation }: ScreenProps<'KycSelfie'>) {
  const { t, colors } = usePreferences();
  const st = useThemedStyles(makeStyles);
  const [done, setDone] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  return (
    <Screen
      title={t('Identity verification', 'Vérification d’identité')}
      footer={
        <>
          <AppButton title={t('Submit for review', 'Soumettre à vérification')} onPress={() => setSubmitted(true)} />
          <AppButton title={t('Back', 'Retour')} variant="ghost" onPress={() => navigation.goBack()} />
        </>
      }
    >
      <StepHeader step={3} total={3} />
      <PageTitle
        title={t('Selfie check', 'Vérification par selfie')}
        subtitle={t(
          'A short liveness check confirms the document belongs to you. Find good lighting and remove hats or glasses.',
          'Un bref contrôle de présence confirme que le document vous appartient. Placez-vous à la lumière et retirez chapeau et lunettes.',
        )}
      />
      <View style={st.selfie}>
        <View style={[st.face, done && { borderColor: colors.primary }]}>
          <Icon name={done ? 'check' : 'smile'} size={64} color={done ? colors.primary : colors.textMuted} strokeWidth={1.6} />
        </View>
        <AppButton
          title={done ? t('Liveness check complete', 'Contrôle terminé') : t('Start liveness check', 'Démarrer le contrôle')}
          variant="outline"
          icon="camera"
          onPress={() => setDone(true)}
          small
        />
      </View>
      <Card style={st.next}>
        <Text style={st.nextTitle}>{t('What happens next', 'Et ensuite ?')}</Text>
        <Text style={st.nextBody}>
          {t(
            "Most checks clear in a few minutes. We'll notify you once your account is approved for transfers. Your documents are screened against sanctions and PEP watchlists as required by law.",
            'Les contrôles prennent généralement quelques minutes. Nous vous informerons dès l’activation des transferts. La loi impose un contrôle des listes de sanctions et de personnes politiquement exposées (PPE).',
          )}
        </Text>
      </Card>
      <InfoNote icon="shield" text={t('Your data is encrypted end to end.', 'Vos données sont chiffrées de bout en bout.')} />
      <AppDialog
        visible={submitted}
        title={t('Submitted for review', 'Envoyé pour vérification')}
        message={t('We’ll notify you as soon as your identity is verified.', 'Nous vous informerons dès que votre identité sera vérifiée.')}
        primary={{ label: t('Done', 'Terminé'), onPress: () => { setSubmitted(false); goHome(navigation); } }}
        onClose={() => setSubmitted(false)}
      />
    </Screen>
  );
}

const s = StyleSheet.create({
  form: { gap: 12 },
  row: { flexDirection: 'row', gap: 12 },
  flex: { flex: 1 },
});

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    upload: {
      height: 120,
      borderRadius: 18,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: c.primary,
      backgroundColor: c.primaryTint,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 4,
    },
    uploadDone: { borderStyle: 'solid' },
    uploadText: { color: c.primary, fontWeight: '600', fontSize: 14 },
    selfie: { alignItems: 'center', gap: 16, marginBottom: 20 },
    face: {
      width: 180,
      height: 220,
      borderRadius: 110,
      borderWidth: 3,
      borderStyle: 'dashed',
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surface,
    },
    next: { paddingVertical: 16, marginBottom: 12 },
    nextTitle: { color: c.text, fontSize: 15, fontWeight: '600', marginBottom: 6 },
    nextBody: { color: c.textMuted, fontSize: 13, lineHeight: 19 },
  });
