import React from 'react';
import { Dialog, Portal, Button, Text } from 'react-native-paper';

type ConfirmacionProps = {
  visible: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const Confirmacion: React.FC<ConfirmacionProps> = ({
  visible,
  title = 'Confirmar acción',
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>Cancelar</Button>
          <Button onPress={onConfirm}>Aceptar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default Confirmacion;
