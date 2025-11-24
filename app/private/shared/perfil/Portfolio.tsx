import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { supabase } from '../../../../supabase/supabaseClient';
import { deleteImage } from '@services/ImageService';
import { postEventEmitter } from '@services/postEventEmitter';
import { useProfileContext } from '@appContext/ProfileContext';

const { width, height } = Dimensions.get('window');

interface PostImage {
  id: string;
  url: string;
  nombre: string;
}

interface PortfolioProps {
  userId: string | number | null | undefined;
}

const Portfolio = ({ userId }: PortfolioProps) => {
  const { isOwnProfile } = useProfileContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [images, setImages] = useState<PostImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const loadUserPosts = async () => {
      try {
        if (!userId) {
          setLoading(false);
          return;
        }

        const { data: publicaciones, error: pubError } = await supabase
          .from('publicacion')
          .select('id, idusuario')
          .eq('idusuario', userId)
          .eq('activo', true);

        if (pubError) {
          throw new Error(`Error cargando publicaciones: ${pubError.message}`);
        }

        if (!publicaciones || publicaciones.length === 0) {
          setImages([]);
          setLoading(false);
          return;
        }

        const publicacionIds = publicaciones.map((p: any) => p.id);
        const { data: archivosPublicacion, error: apError } = await supabase
          .from('archivopublicacion')
          .select('idarchivo')
          .in('idpublicacion', publicacionIds);

        if (apError) {
          throw new Error(`Error cargando relaciones: ${apError.message}`);
        }

        if (!archivosPublicacion || archivosPublicacion.length === 0) {
          setImages([]);
          setLoading(false);
          return;
        }

        const archivoIds = archivosPublicacion.map((ap: any) => ap.idarchivo);
        const { data: archivos, error: arError } = await supabase
          .from('archivo')
          .select('id, url, nombre')
          .in('id', archivoIds)
          .eq('activo', true);

        if (arError) {
          throw new Error(`Error cargando archivos: ${arError.message}`);
        }

        const postsImages: PostImage[] = (archivos || []).map(
          (archivo: any) => ({
            id: archivo.id,
            url: archivo.url,
            nombre: archivo.nombre,
          }),
        );

        setImages(postsImages);
      } catch (error) {
        console.error('Error al cargar posts del usuario:', error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserPosts();

    // Suscribirse a los cambios de posts
    const unsubscribe = postEventEmitter.subscribe((changedUserId) => {
      if (changedUserId === userId) {
        console.log('Actualizando posts para el usuario:', userId);
        loadUserPosts();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
    scale.value = withTiming(1, { duration: 300 });
    opacity.value = withTiming(1, { duration: 300 });
  };

  const closeModal = () => {
    scale.value = withTiming(0.4, { duration: 200 }, () => {
      runOnJS(setModalVisible)(false);
    });
    opacity.value = withTiming(0, { duration: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handleDeleteImage = async (imageId: string) => {
    if (!isOwnProfile) {
      Alert.alert(
        'No permitido',
        'Solo puedes eliminar imágenes de tu propio perfil',
      );
      return;
    }

    Alert.alert(
      'Eliminar publicación',
      '¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            setDeleting(imageId);
            try {
              const success = await deleteImage(imageId);
              if (success) {
                // Remover la imagen de la lista localmente
                setImages((prevImages) =>
                  prevImages.filter((img) => img.id !== imageId),
                );
                Alert.alert('Éxito', 'Publicación eliminada correctamente');
              } else {
                Alert.alert('Error', 'No se pudo eliminar la publicación');
              }
            } catch (error) {
              console.error('Error eliminando imagen:', error);
              Alert.alert(
                'Error',
                'Ocurrió un error al eliminar la publicación',
              );
            } finally {
              setDeleting(null);
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#00A699" />
        </View>
      ) : images.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.noImagesText}>No hay publicaciones aún</Text>
        </View>
      ) : (
        <View style={styles.thumbnailsContainer}>
          {images.map((img) => (
            <View key={img.id} style={styles.thumbnailWrapper}>
              <TouchableOpacity
                style={[
                  styles.thumbnail,
                  deleting === img.id && styles.deletingThumbnail,
                ]}
                onPress={() => openModal(img.url)}
                onLongPress={() => isOwnProfile && handleDeleteImage(img.id)}
                disabled={deleting === img.id}
              >
                <Image
                  source={{ uri: img.url }}
                  style={styles.thumbnailImage}
                />
              </TouchableOpacity>
              {deleting === img.id && (
                <View style={styles.deletingOverlay}>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* TODO: Por ahora es un modal, cambiar a componente separado*/}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        statusBarTranslucent
      >
        <GestureHandlerRootView style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={closeModal}
          />

          <Animated.View style={[styles.animatedImageContainer, animatedStyle]}>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
          </Animated.View>

          {/* Botón de cerrar (eliminar despues) */}
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  thumbnailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  thumbnailWrapper: {
    width: width / 2 - 28,
    height: width / 2 - 28,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  deletingThumbnail: {
    opacity: 0.6,
  },
  deletingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  animatedImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width * 0.9,
    height: height * 0.7,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImagesText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default Portfolio;
