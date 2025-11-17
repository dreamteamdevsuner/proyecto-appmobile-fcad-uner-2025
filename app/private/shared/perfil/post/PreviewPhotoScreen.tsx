// En /screens/PreviewPhotoScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '@app/private/candidates/navigator/types';
import ROUTES from '@app/private/candidates/navigator/routes';
import { uploadImage } from '@services/ImageService';
import { postEventEmitter } from '@services/postEventEmitter';
import { supabase } from '../../../../../supabase/supabaseClient';
import { useAuth } from '@appContext/authContext';

type Props = NativeStackScreenProps<
  PrivateStackParamList,
  typeof ROUTES.CANDIDATE_PREVIEW_PHOTO_SCREEN
>;

export function PreviewPhotoScreen({ route, navigation }: Props) {
  const { uri, base64 } = route.params;
  const { state } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imageValid, setImageValid] = useState(true);

  useEffect(() => {
    if (!uri || !base64) {
      setImageValid(false);
    }
  }, [uri, base64]);

  const createPost = async (imageUrl: string) => {
    try {
      if (!state.user?.id) {
        throw new Error('Usuario no autenticado');
      }

      const { data: publicacionData, error: publicacionError } = await supabase
        .from('publicacion')
        .insert({
          idusuario: state.user.id,
          activo: true,
        })
        .select()
        .single();

      if (publicacionError) {
        throw new Error(
          `Error al crear publicación: ${publicacionError.message}`,
        );
      }

      if (!publicacionData) {
        throw new Error('No se pudo crear la publicación');
      }

      const fileName = imageUrl.split('/').pop() || 'image.jpg';
      const { data: archivoData, error: archivoError } = await supabase
        .from('archivo')
        .insert({
          nombre: fileName,
          url: imageUrl,
          tipo: 'image/jpeg',
          activo: true,
        })
        .select()
        .single();

      if (archivoError) {
        throw new Error(`Error al crear archivo: ${archivoError.message}`);
      }

      if (!archivoData) {
        throw new Error('No se pudo crear el archivo');
      }

      const { error: relacionError } = await supabase
        .from('archivopublicacion')
        .insert({
          idpublicacion: publicacionData.id,
          idarchivo: archivoData.id,
        });

      if (relacionError) {
        throw new Error(`Error al crear relación: ${relacionError.message}`);
      }

      console.log('Publicación creada exitosamente:', {
        publicacionId: publicacionData.id,
        archivoId: archivoData.id,
        imageUrl,
      });

      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const handlePublish = async () => {
    console.log('Publicando foto:', uri);

    if (!base64) {
      Alert.alert('Error', 'No se pudo obtener los datos de la imagen');
      return;
    }

    if (!state.user?.id) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    setIsLoading(true);

    try {
      const downloadUrl = await uploadImage(base64, 'posts', state.user.id, {
        onSuccess: (url) => {
          console.log('Imagen subida con éxito:', url);
        },
        onError: (error) => {
          console.error('Error al subir la imagen:', error);
        },
      });

      if (!downloadUrl) {
        throw new Error('No se pudo subir la imagen');
      }

      await createPost(downloadUrl);

      // Emitir evento para actualizar Portfolio
      postEventEmitter.emit(state.user.id);

      Alert.alert('Éxito', 'Publicación creada correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.popToTop(),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Hubo un error al publicar la foto',
      );
      console.error('Error en handlePublish:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!imageValid) {
    Alert.alert('Error', 'No se pudo cargar la imagen', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
    return (
      <View style={styles.container}>
        <View style={styles.center} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri }}
        style={styles.image}
        resizeMode="contain"
        onError={() => {
          console.error('Error cargando imagen:', uri);
          setImageValid(false);
        }}
      />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#00A699" />
        </View>
      )}

      <View style={styles.buttonRow}>
        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          color="#FF5A5F"
          disabled={isLoading}
        />
        <Button
          title="Publicar"
          onPress={handlePublish}
          color="#00A699"
          disabled={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
});
