import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Camera, CameraType, CameraView } from 'expo-camera';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Ajusta la ruta
import { useCameraPermissions } from 'expo-image-picker';
import { PrivateStackParamList } from '@app/private/candidates/navigator/types';
import ROUTES from '@app/private/candidates/navigator/routes';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type PostPhotoNavProps = NativeStackNavigationProp<
  PrivateStackParamList,
  typeof ROUTES.CANDIDATE_POST_PHOTO_SCREEN
>;

export function PostPhotoScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const navigation = useNavigation<PostPhotoNavProps>();

  // Pedir permiso cada vez que la pantalla entra en foco
  useFocusEffect(
    React.useCallback(() => {
      if (!permission?.granted && permission?.canAskAgain) {
        requestPermission();
      }
    }, [permission, requestPermission]),
  );

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
        });

        if (!photo.uri || !photo.base64) {
          Alert.alert('Error', 'No se pudo obtener la foto');
          return;
        }

        // Navega a la pantalla de vista previa CON la URI de la foto
        // Usamos 'replace' para que el usuario no pueda "volver" a la cámara
        navigation.replace(ROUTES.CANDIDATE_PREVIEW_PHOTO_SCREEN, {
          uri: photo.uri,
          base64: photo.base64,
        });
      } catch (error) {
        console.error('Error al tomar la foto:', error);
        Alert.alert('Error', 'Error al tomar la foto');
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>
          Necesitamos tu permiso para mostrar la cámara.
        </Text>
        <Button onPress={requestPermission} title="Conceder Permiso" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.shutterButton}
          onPress={toggleCameraFacing}
        >
          <MaterialCommunityIcons
            name="camera-flip"
            style={styles.iconButton}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shutterButton} onPress={takePicture}>
          <MaterialCommunityIcons name="camera" style={styles.iconButton} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    textAlign: 'center',
    marginBottom: 16,
    color: 'black',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  shutterButton: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ccc',
  },
  iconButton: { fontSize: 32, color: '#333' },
});
