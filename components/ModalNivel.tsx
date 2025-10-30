import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { Button, Text, Title } from 'react-native-paper';
import { DropdownItem } from '@services/perfilService';

interface Props {
  visible: boolean;
  onDismiss: () => void;
  skillLabel: string;
  nivelesDisponibles: DropdownItem[];
  nivelActual: string | null | undefined;
  onSaveLevel: (selectedLevelId: string | null) => void;
}

const NivelModal = ({
  visible,
  onDismiss,
  skillLabel,
  nivelesDisponibles,
  nivelActual,
  onSaveLevel,
}: Props) => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setSelectedLevel(nivelActual ?? null);
    }
  }, [visible, nivelActual]);

  const handleSave = () => {
    onSaveLevel(selectedLevel);
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Title style={styles.modalTitle}>Selecciona el nivel para:</Title>
          <Text style={styles.skillLabel}>{skillLabel}</Text>

          <View style={styles.buttonContainer}>
            {nivelesDisponibles.map((nivel) => (
              <Button
                key={nivel.value}
                mode={selectedLevel === nivel.value ? "contained" : "outlined"} // Resaltar el seleccionado
                onPress={() => setSelectedLevel(nivel.value)}
                style={styles.levelButton}
              >
                {nivel.label}
              </Button>
            ))}
          </View>

          <View style={styles.modalActions}>
            <Button onPress={onDismiss}>Cancelar</Button>
            <Button mode="contained" onPress={handleSave}>
              Aceptar
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '##2C2C2C',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  skillLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#BEB52C',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  levelButton: {
    marginTop: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
});

export default NivelModal;