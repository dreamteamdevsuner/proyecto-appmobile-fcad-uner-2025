import React from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native'; // <--- 1. Importar ActivityIndicator y Text
import { Button } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import SwipeMatch from '../../shared/swipe_match/SwipeMatch';
import CandidateCard from '../../../../components/ui/CandidateCard';
import usePaginatedData from '../../../../hooks/usePaginatedData';
import { getCandidatePreview } from '@services/candidatePreview/candidatePreview.service';
import { CandidatePreview } from '@database/DBCandidatePreview';
import ROUTES from '../navigator/routes';
import { RootStackParams } from '../navigator/SwipeStack';
import { useAuth } from '@appContext/authContext';

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

  // 2. LÓGICA DE CARGA (Igual que en Professional Home)
  // Esto evita que se renderice SwipeMatch con data vacía temporalmente
  if (loading && (!professionals || professionals.length === 0)) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // 3. Manejo si realmente no hay datos (después de cargar)
  // Opcional: Si prefieres que lo maneje SwipeMatch con su mensaje de "Estás al día",
  // puedes omitir este bloque, pero este ayuda a evitar renderizar el carrusel vacío.
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
                <Button
                  style={{ width: 24 }}
                  buttonColor="transparent"
                  textColor="black"
                  icon="plus-circle-outline"
                  mode="contained"
                />
              </View>
            </TouchableOpacity>
          </CandidateCard>
        )}
      />
    </View>
  );
};

// 4. Estilos simples para centrar el loader
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
