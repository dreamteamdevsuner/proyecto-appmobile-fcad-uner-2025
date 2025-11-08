import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Linking, AppState, TouchableOpacity } from 'react-native';
import { Avatar, Button, Portal, Dialog, Paragraph, List, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  currentImageUrl?: string | null;
  onImageSelected: (base64: string) => void;
  size?: number;
}

const AvatarPicker = ({
  currentImageUrl,
  onImageSelected,
  size = 120,
}: Props) => {
  const [cameraPermissionStatus, requestCameraPermission] = ImagePicker.useCameraPermissions();
  const [mediaLibraryPermissionStatus, requestMediaLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();

  // Estados para el Dialog
  const [permissionDialogVisible, setPermissionDialogVisible] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [dialogPermissionType, setDialogPermissionType] = useState<
    'camera' | 'mediaLibrary' | null
  >(null);

  // Estado para la vista previa local
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  const verifyPermissions = async (
    permissionType: 'camera' | 'mediaLibrary'
  ): Promise<boolean> => {
    
    const permission =
      permissionType === 'camera'
        ? cameraPermissionStatus
        : mediaLibraryPermissionStatus;
    
    const request =
      permissionType === 'camera'
        ? requestCameraPermission
        : requestMediaLibraryPermission;
    
    // Si los hooks aún no cargan
    if (!permission) return false;

    console.log(`Estado ${permissionType}: ${permission.status}`);

    if (permission.status === ImagePicker.PermissionStatus.GRANTED) {
      return true;
    }

    if (
      permission.status === ImagePicker.PermissionStatus.UNDETERMINED ||
      (permission.status === ImagePicker.PermissionStatus.DENIED && permission.canAskAgain)
    ) {
      console.log('Permiso no otorgado, solicitando...');
      const { status } = await request(); //Popup nativo
      return status === ImagePicker.PermissionStatus.GRANTED;
    }
    // Si está denegado, mostramos nuestro Dialog
    if (permission.status === ImagePicker.PermissionStatus.DENIED &&
      !permission.canAskAgain) {
      console.log('Permiso denegado permanentemente. Mostrando diálogo de ajustes.');      setDialogPermissionType(permissionType);
      setPermissionDialogVisible(true);
      return false;
    }
    return false;
  };

  const handlePickImage = async () => {
    const hasPermission = await verifyPermissions('mediaLibrary');
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setLocalImageUri(asset.uri);
      onImageSelected(asset.base64!);
    }
  };

  // Función para TOMAR FOTO
  const handleTakePhoto = async () => {
    const hasPermission = await verifyPermissions('camera');
    if (!hasPermission) return;

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setLocalImageUri(asset.uri);
      onImageSelected(asset.base64!);
    }
  };

  //Funciones de menu opción foto/galeria
  const onTakePhotoPressed = () => {
    setOptionsVisible(false);
    handleTakePhoto();
  };

  const onPickImagePressed = () => {
    setOptionsVisible(false);
    handlePickImage();
  }

  // Lógica de visualización
  const imageSource = localImageUri
    ? { uri: localImageUri }
    : currentImageUrl
    ? { uri: currentImageUrl }
    : undefined;

  return (
    <View style={styles.avatarContainer}>
      <View style={styles.avatarWrapper}>
        <TouchableOpacity onPress={() => setOptionsVisible(true)}>
          {imageSource ? (
            <Avatar.Image size={size} source={imageSource} />
          ) : (
            <Avatar.Icon size={size} icon="account" />
          )}
        </TouchableOpacity>
        <IconButton
          icon={"pencil"}
          size={size * 0.2}
          style={[styles.editIcon, { top: size * 0.7, left: size * 0.7}]}
          mode='contained'
          onPress={() => setOptionsVisible(true)}
        />
      </View>

      <Portal>
        <Dialog
          visible={optionsVisible}
          onDismiss={() => setOptionsVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>
            Cambiar foto de perfil
          </Dialog.Title>
          <Dialog.Content>
            <List.Item 
              title="Tomar foto nueva"
              titleStyle={styles.optionsText}
              left={(props) => (
                <List.Icon {...props} icon="camera" color='#E0E0E0'/>
              )}
              onPress={onTakePhotoPressed}
            />
            <List.Item 
              title="Elegir de la galería"
              titleStyle={styles.optionsText}
              left={(props) => (
                <List.Icon {...props} icon="image-multiple" color='#E0E0E0'/>
              )}
              onPress={onPickImagePressed}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setOptionsVisible(false)}
              labelStyle={styles.dialogButton}
            >Cancelar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog
          visible={permissionDialogVisible}
          onDismiss={() => setPermissionDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>
            Permisos insuficientes
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.dialogText}>
              {`Jobsy necesita permisos de ${
                dialogPermissionType === 'camera' ? 'cámara' : 'galería'
              } para usar esta función. Por favor, ve a los ajustes del sistema para habilitarlos.`}
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setPermissionDialogVisible(false)}
              labelStyle={styles.dialogButton}
            >Cancelar</Button> 

            <Button
              onPress={() => {
                setPermissionDialogVisible(false);
                Linking.openSettings();
              }}
              labelStyle={styles.dialogButton}
            >Abrir Ajustes</Button> 

          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}; 

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
    //backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    position: 'absolute',
    backgroundColor: '#d8d8d8',
  },
  dialog: {
    backgroundColor: '#2C2C2C',
    borderRadius: 20,
  },
  dialogTitle: {
    color: '#FFFFFF',
  },
  dialogText: {
    color: '#E0E0E0',
  },
  dialogButton: {
    color: '#BEB52C',
  },
  optionsText: {
    color: '#E0E0E0'
  },
});

export default AvatarPicker;