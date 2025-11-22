import React, { useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import SwipeMatch from '../../shared/swipe_match/SwipeMatch';
import JobOfferCard from '../../../../components/ui/JobOfferCard';
import { getJobOffersPreview } from '@services/jobOffer/JobOfferPreview.service';
import usePaginatedData from '../../../../hooks/usePaginatedData';
import { DBJobPreview } from '@database/DBJobPreview';

import { useAuth } from '@appContext/authContext';

const CandidateHomeScreen = () => {
  const {
    state: { user },
  } = useAuth();

  const {
    data: { data: offers },
    loading,
    setNextPage,
  } = usePaginatedData<DBJobPreview>(5, getJobOffersPreview);

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentOffer = offers?.[currentIndex];

  if (loading) return <ActivityIndicator size="large" color="#000" />;

  if (!offers || offers.length === 0)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.emptyText}>No hay ofertas disponibles.</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <SwipeMatch<DBJobPreview>
        data={offers}
        handleScrollEnd={setNextPage}
        renderItem={({ item }) => <JobOfferCard key={item.id} item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyText: {
    color: '#ffffff',
  },
});

export default CandidateHomeScreen;

/* Código anterior
import React from 'react';
import SwipeMatch from '../../shared/swipe_match/SwipeMatch';

import JobOfferCard from '../../../../components/ui/JobOfferCard';
import { getJobOffersPreview } from '@services/jobOffer/JobOfferPreview.service';
import usePaginatedData from '../../../../hooks/usePaginatedData';
import { DBJobPreview } from '@database/DBJobPreview';

const CandidateHomeScreen = () => {
  const {
    data: { data },
    loading,

    setNextPage,
  } = usePaginatedData<DBJobPreview>(5, getJobOffersPreview);
  return (
    <SwipeMatch<DBJobPreview>
      data={data}
      handleScrollEnd={setNextPage}
      renderItem={({ item }) => {
        return <JobOfferCard {...{ item }}></JobOfferCard>;
      }}
    ></SwipeMatch>
  );
};

export default CandidateHomeScreen;
*/
