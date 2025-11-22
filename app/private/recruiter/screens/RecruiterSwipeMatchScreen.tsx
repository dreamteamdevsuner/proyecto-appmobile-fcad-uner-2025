import React from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SwipeMatch from '@app/private/shared/swipe_match/SwipeMatch';
import CandidateCard from '../../../../components/ui/CandidateCard';
import usePaginatedData from '../../../../hooks/usePaginatedData';
import { getCandidatePreview } from '@services/candidatePreview/candidatePreview.service';
import { CandidatePreview } from '@database/DBCandidatePreview';
import ROUTES from '../navigator/routes';
import { RootStackParams } from '../navigator/SwipeStack';
import { useAuth } from '@appContext/authContext';
import { IconButton } from 'react-native-paper'; // Agrega IconButton

interface RecruiterSwipeMatchScreenProps
  extends NativeStackScreenProps<
    RootStackParams,
    ROUTES.RECRUITER_SWIPE_MATCH_SCREEN
  > {}

const RecruiterSwipeMatchScreen = ({
  navigation,
}: RecruiterSwipeMatchScreenProps) => {
  const {
    state: { user },
  } = useAuth();

  const {
    data: { data: professionals },
    loading,
    setNextPage,
  } = usePaginatedData<CandidatePreview>(5, (page, itemsPerPage) =>
    getCandidatePreview(page, itemsPerPage, user?.id),
  );

  if (loading && (!professionals || professionals.length === 0)) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!loading && (!professionals || professionals.length === 0)) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No se encontraron candidatos.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SwipeMatch<CandidatePreview>
        data={professionals}
        handleScrollEnd={setNextPage}
        renderItem={({ item, handleScrollEnabled }) => (
          <CandidateCard item={item} {...{ handleScrollEnabled }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  ROUTES.RECRUITER_CANDIDATE_PROFILE_PREVIEW,
                  {
                    userId: item.id,
                    bio: item.bio,
                    fotoperfil: item.fotoperfil,
                  },
                )
              }
            >
              <View
                style={{
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <IconButton
                  icon="plus-circle-outline"
                  iconColor="black"
                  size={24}
                  onPress={() =>
                    navigation.navigate(
                      ROUTES.RECRUITER_CANDIDATE_PROFILE_PREVIEW,
                      {
                        userId: item.id,
                        bio: item.bio,
                        fotoperfil: item.fotoperfil,
                      },
                    )
                  }
                />
              </View>
            </TouchableOpacity>
          </CandidateCard>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#ffffff',
  },
});

export default RecruiterSwipeMatchScreen;

/* Código anterior
import { View } from 'react-native';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import { candidates2 } from '../../../../mockup/candidates';
import CandidateCard from '../../../../components/ui/CandidateCard';
import SwipeMatch from '../../shared/swipe_match/SwipeMatch';
import { Candidate } from '../../../../interfaces/Candidate';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Text } from 'react-native-paper';
import ROUTES from '../navigator/routes';
import { TouchableOpacity } from 'react-native';
import { RootStackParams } from '../navigator/SwipeStack';
import usePaginatedData from '../../../../hooks/usePaginatedData';
import { getCandidatePreview } from '@services/candidatePreview/candidatePreview.service';
import { CandidatePreview } from '@database/DBCandidatePreview';

//TODO move to own component
const dataHardCoded = candidates2;

interface RecruiterSwipeMatchScreen
  extends NativeStackScreenProps<
    RootStackParams,
    ROUTES.RECRUITER_SWIPE_MATCH_SCREEN
  > {}
const RecruiterSwipeMatchScreen = ({
  navigation,
}: RecruiterSwipeMatchScreen) => {
  const {
    data: { data },
    loading,
    page,
    setNextPage,
  } = usePaginatedData(1, getCandidatePreview);

  return (
    <SwipeMatch<CandidatePreview>
      data={data}
      handleScrollEnd={setNextPage}
      renderItem={({ item, handleScrollEnabled }) => {
        return (
          <CandidateCard item={item} {...{ handleScrollEnabled }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  ROUTES.RECRUITER_CANDIDATE_PROFILE_PREVIEW,
                  {
                    userId: item.id,
                    bio: item.bio,
                    fotoperfil: item.fotoperfil,
                  },
                )
              }
            >
              <View
                style={{
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Button
                  style={{ width: 24 }}
                  children
                  buttonColor="transparent"
                  textColor="black"
                  icon="plus-circle-outline"
                  mode="contained"
                ></Button>
              </View>
            </TouchableOpacity>
          </CandidateCard>
        );
      }}
    ></SwipeMatch>
  );
};

export default RecruiterSwipeMatchScreen;
*/
