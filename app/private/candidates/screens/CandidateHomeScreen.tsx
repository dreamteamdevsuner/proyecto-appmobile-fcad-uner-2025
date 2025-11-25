import React, { useContext, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import SwipeMatch from '@app/private/shared/swipe_match/SwipeMatch';
import JobOfferCard from '../../../../components/ui/JobOfferCard';
import { getJobOffersPreview } from '@services/jobOffer/JobOfferPreview.service';
import usePaginatedData from '../../../../hooks/usePaginatedData';
import { DBJobPreview } from '@database/DBJobPreview';

import { useAuth } from '@appContext/authContext';
import { ProfessionalContext } from '@appContext/ProfessionalContext';

const CandidateSwipeMatchScreen = () => {
  const {
    state: { user },
  } = useAuth();

  const {
    offers,
    loadingJobOffers: loading,
    setNextPage,
  } = useContext(ProfessionalContext);
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

export default CandidateSwipeMatchScreen;
