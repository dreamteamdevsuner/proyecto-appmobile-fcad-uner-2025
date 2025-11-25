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
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { getJobOffer } from '@services/jobOffer/JobOffer.service';
import { JobOfferFullDescription } from '../../../../../types/JobOfferFullDescription';
import JobOfferCard from '@components/ui/JobOfferCard';
import JobOfferCardFullDescription from '@app/private/shared/JobOfferCardFullDescription/JobOfferCardFullDescription';
import AppLoading from '@components/ui/AppLoading';
import { ParamListBase, RouteProp } from '@react-navigation/native';

interface JobOfferRequiredParams {
  jobOfferId: string;
}

// We define props that work for ANY ParamList, as long as the route params match our requirement
interface JobPostingScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase> & { params: JobOfferRequiredParams };
}

function JobPostingScreen<
  T extends ParamListBase = CandidateSwipeStackRootParams,
  K extends keyof T = ROUTES.CANDIDATE_JOB_OFFER_SCREEN,
>({ route }: JobPostingScreenProps) {
  const [showActions, setShowActions] = useState(false);

  const [loading, setLoading] = useState(false);
  const [jobOffer, setJobOffer] = useState<JobOfferFullDescription>();
  const handleJobOffer = async () => {
    setLoading(true);
    try {
      const jobOfferData: JobOfferFullDescription = await getJobOffer(
        route.params.jobOfferId,
      );
      setJobOffer(jobOfferData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleJobOffer();
  }, []);
  if (loading) {
    return <AppLoading></AppLoading>;
  }
  if (!jobOffer) {
    return (
      <View>
        <Text>Error buscando oferta de trabajo</Text>
      </View>
    );
  }

  return (
    <JobOfferCardFullDescription
      {...{ jobOffer }}
    ></JobOfferCardFullDescription>
  );
}

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
