import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SwipeMatch from '@app/private/shared/swipe_match/SwipeMatch';
import CandidateCard from '../../../../components/ui/CandidateCard';
import usePaginatedData from '../../../../hooks/usePaginatedData';
import { getCandidatePreview } from '@services/candidatePreview/candidatePreview.service';
import { CandidatePreview } from '@database/DBCandidatePreview';
import ROUTES from '../navigator/routes';
import { RootStackParams } from '../navigator/SwipeStack';
import { useAuth } from '@appContext/authContext';
import MatchModal from '../../../../components/MatchModal';

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

  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [matchedCandidateName, setMatchedCandidateName] = useState('');
  const [matchedCandidateId, setMatchedCandidateId] = useState('');
  const [matchedCandidateFotoPerfil, setMatchedCandidateFotoPerfil] =
    useState('');
  const [idMatch, setIdMatch] = useState('');

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
        <ActivityIndicator size="large" color="#000" />
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
        onMatchSuccess={(name, id, fotoperfil, idMatch) => {
          setMatchedCandidateName(name);
          setMatchedCandidateId(id);
          setMatchedCandidateFotoPerfil(fotoperfil);
          setIdMatch(idMatch);
          setMatchModalVisible(true);
        }}
        renderItem={({ item, handleScrollEnabled }) => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
                    iconColor="#e0e0e0ff"
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
          </View>
        )}
      />

      <MatchModal
        visible={matchModalVisible}
        candidateName={matchedCandidateName}
        onDismiss={() => setMatchModalVisible(false)}
        onChatPress={() => {
          setMatchModalVisible(false);

          navigation.navigate(ROUTES.RECRUITER_CONVERSACION, {
            title: matchedCandidateName,
            myName: user?.nombre || '',
            myAvatarUrl: user?.fotoperfil || '',
            otherAvatarUrl: matchedCandidateFotoPerfil,
            idOfertaTrabajoMatch: idMatch,
            idUsuarioProfesional: matchedCandidateId,
          });
        }}
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
