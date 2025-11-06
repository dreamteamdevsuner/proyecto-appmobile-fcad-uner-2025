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
