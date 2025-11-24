import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { Button, Text, Title, useTheme } from 'react-native-paper';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onChatPress: () => void;
  candidateName: string;
}

const MatchModal = ({
  visible,
  onDismiss,
  onChatPress,
  candidateName,
}: Props) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.8)',
    },
    modalContent: {
      width: '85%',
      padding: 24,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      elevation: 5,
      alignItems: 'center',
    },
    emoji: {
      fontSize: 50,
      marginBottom: 10,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.colors.primary,
      textAlign: 'center',
      marginBottom: 10,
    },
    messageText: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      marginBottom: 25,
      lineHeight: 24,
    },
    buttonContainer: {
      width: '100%',
      gap: 10,
    },
    chatButton: {
      width: '100%',
      borderRadius: 8,
    },
    laterButton: {
      width: '100%',
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
          <Text style={styles.emoji}>🎉</Text>
          <Title style={styles.modalTitle}>¡Es un Match!</Title>

          <Text style={styles.messageText}>
            Felicitaciones, hiciste match con{' '}
            <Text style={{ fontWeight: 'bold' }}>{candidateName}</Text>.{'\n'}
            ¿Querés hablar ahora?
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={onChatPress}
              style={styles.chatButton}
              icon="chat"
            >
              Ir al Chat
            </Button>

            <Button
              mode="text"
              onPress={onDismiss}
              style={styles.laterButton}
              textColor={theme.colors.secondary}
            >
              Hablar más tarde
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MatchModal;
