import SwipeMatchButtons from '@app/private/shared/swipe_match/SwipeMatchButtons';
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

import {
  Appbar,
  Avatar,
  Card,
  Text,
  Chip,
  IconButton,
  Portal,
  Modal,
  FAB,
} from 'react-native-paper';

import { CandidateSwipeStackRootParams } from '../../navigator/SwipeStack';
import ROUTES from '../../navigator/routes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getJobOffer } from '@services/jobOffer/JobOffer.service';
import { JobOfferFullDescription } from '../../../../../types/JobOfferFullDescription';

interface JobPostingScreenProps
  extends NativeStackScreenProps<
    CandidateSwipeStackRootParams,
    ROUTES.CANDIDATE_JOB_OFFER_SCREEN
  > {}
const JobPostingScreen = ({ route }: JobPostingScreenProps) => {
  const [showActions, setShowActions] = useState(false);
  console.log(route.params.jobOfferId);
  const handleJobOffer = async () => {
    const jobOffer: JobOfferFullDescription = await getJobOffer(
      route.params.jobOfferId,
    );
    console.log(JSON.stringify(jobOffer, null, 2));
  };
  useEffect(() => {
    handleJobOffer();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            {/* Header with recruiter info */}
            <View style={styles.header}>
              <Avatar.Image
                size={48}
                source={{ uri: 'https://via.placeholder.com/150' }}
              />
              <View style={styles.headerText}>
                <Text variant="titleMedium" style={styles.bold}>
                  Renata Scheneider
                </Text>
                <Text variant="bodySmall">Talent Acquisition</Text>
                <Text variant="bodySmall">Córdoba</Text>
              </View>
            </View>

            {/* Job title and company */}
            <Text variant="headlineSmall" style={styles.jobTitle}>
              Diseñador UX/UI
            </Text>
            <Text variant="bodyLarge" style={styles.company}>
              Banco Santander
            </Text>

            {/* Location and job details */}
            <View style={styles.infoRow}>
              <IconButton icon="map-marker" size={16} style={styles.icon} />
              <Text>Argentina</Text>
            </View>

            <View style={styles.tagsRow}>
              <Chip compact>REMOTO</Chip>
              <Chip compact>Full-Time</Chip>
              <Chip compact>Inmediato</Chip>
            </View>

            {/* Job description */}
            <Text variant="titleSmall" style={styles.sectionTitle}>
              Acerca del empleo:
            </Text>
            <Text variant="bodyMedium" style={styles.paragraph}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text>
            <Text variant="bodyMedium" style={styles.paragraph}>
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </Text>

            {/* Tools */}
            <Text variant="titleSmall" style={styles.sectionTitle}>
              Herramientas:
            </Text>
            <View style={styles.chipsRow}>
              <Chip
                mode="flat"
                style={styles.darkChip}
                textStyle={styles.whiteText}
              >
                Figma
              </Chip>
              <Chip
                mode="flat"
                style={styles.darkChip}
                textStyle={styles.whiteText}
              >
                Illustrator
              </Chip>
              <Chip
                mode="flat"
                style={styles.darkChip}
                textStyle={styles.whiteText}
              >
                Whimsical
              </Chip>
            </View>

            {/* Skills */}
            <Text variant="titleSmall" style={styles.sectionTitle}>
              Habilidades:
            </Text>
            <View style={styles.chipsRow}>
              <Chip
                mode="flat"
                style={styles.darkChip}
                textStyle={styles.whiteText}
              >
                Creatividad
              </Chip>
              <Chip
                mode="flat"
                style={styles.darkChip}
                textStyle={styles.whiteText}
              >
                Organización
              </Chip>
            </View>

            {/* Languages */}
            <Text variant="titleSmall" style={styles.sectionTitle}>
              Idiomas:
            </Text>
            <View style={styles.languageRow}>
              <IconButton icon="flag" size={20} />
              <Text style={styles.flex}>Español</Text>
              <Text>Nativo</Text>
            </View>
            <View style={styles.languageRow}>
              <IconButton icon="flag" size={20} />
              <Text style={styles.flex}>Inglés</Text>
              <Text>B2</Text>
            </View>

            {/* Benefits */}
            <Text variant="titleSmall" style={styles.sectionTitle}>
              Beneficios:
            </Text>
            <Text>• Obra social</Text>
            <Text>• Vacaciones pagas 15 días</Text>
            <Text>• Día de cumpleaños libre</Text>
            <Text>• 2 días libres al mes</Text>
            <Text>• Pase gym</Text>
            <Text>• Bonificación Wifi</Text>
          </Card.Content>
        </Card>
      </ScrollView>

      <SwipeMatchButtons
        styles={{ ...styles.fabContainer }}
        handleLike={(like = false) => {
          // const currentItem = data[currentIndex];
          // if (!currentItem) return;
          // console.log('❤️ LIKE BTN PRESSED:', like);
          // const currentOfferId = currentItem?.ofertaId || currentItem?.id;
          // const targetProfesionalId = currentItem?.profesionalId;
          // handleLike(like, currentOfferId, targetProfesionalId);
          // setCurrentIndex((prev) => prev + 1);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#21202013',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 100,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  jobTitle: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  company: {
    color: '#666',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    margin: 0,
    padding: 0,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 20,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  darkChip: {
    backgroundColor: '#333',
  },
  whiteText: {
    color: '#fff',
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  flex: {
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(128, 128, 128, 0)',
  },
  fab: {
    backgroundColor: '#757575',
    marginHorizontal: 12,
  },
  fabLarge: {
    elevation: 8,
  },
  modal: {
    backgroundColor: 'transparent',
    padding: 20,
    alignItems: 'center',
  },
  modalContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeBtn: {
    backgroundColor: '#fff',
    marginRight: 20,
  },
  heartBtn: {
    backgroundColor: '#e0e0e0',
  },
});

export default JobPostingScreen;
