import React, { useEffect, useState } from 'react';

const useImageSourceFallback = (
  imgPathFromApi: string,
  defaultSrcImageUrl: string,
) => {
  const defaultSrcImage = defaultSrcImageUrl;
  const [imageError, setImageError] = useState(false);
  const onError = () => setImageError(true);
  useEffect(() => {
    if (!imgPathFromApi) {
      setImageError(true);
    }
  });

  return { defaultSrcImage, onError, imageError };
};

export default useImageSourceFallback;
