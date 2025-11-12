import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { Button, Text, Title, useTheme } from 'react-native-paper';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  message: string;
}

const AlertaModal = ({ visible, onDismiss, title, message }: Props) => {
  const theme = useTheme(); 

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.8)', // Overlay oscuro
    },
    modalContent: {
      width: '90%',
      padding: 20,
      backgroundColor: theme.colors.outlineVariant, 
      borderRadius: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.onSurface, 
      textAlign: 'center',
      marginBottom: 15,
    },
    messageText: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant, 
      textAlign: 'center',
      marginBottom: 25,
      lineHeight: 22,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end', 
      marginTop: 10,
    },
  });

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Title style={styles.modalTitle}>{title}</Title>

          <Text style={styles.messageText}>{message}</Text>

          <View style={styles.modalActions}>
            <Button mode="contained" onPress={onDismiss}>
              Entendido
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertaModal;