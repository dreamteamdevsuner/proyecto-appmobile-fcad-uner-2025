import { View, Text } from 'react-native';
import React, { useState } from 'react';

const useSnackbar = () => {
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleShowSnackbar = () => {
    setShowSnackbar(true);
  };
  const handleHideSnackbar = () => {
    setShowSnackbar(false);
  };
  return { showSnackbar, handleHideSnackbar, handleShowSnackbar };
};

export default useSnackbar;
