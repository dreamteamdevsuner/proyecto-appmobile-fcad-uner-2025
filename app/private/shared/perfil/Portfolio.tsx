// DeveloperGallery.tsx
import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  StyleSheet,
  StatusBar,
  Text,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const Portfolio = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const images = [
    'https://picsum.photos/800/1200?random=1',
    'https://picsum.photos/800/1200?random=2',
    'https://picsum.photos/800/1200?random=3',
    'https://picsum.photos/800/1200?random=4',
  ];

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

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

  return (
    <View style={styles.container}>
      <View style={styles.thumbnailsContainer}>
        {images.map((img, index) => (
          <TouchableOpacity
            key={index}
            style={styles.thumbnail}
            onPress={() => openModal(img)}
          >
            <Image source={{ uri: img }} style={styles.thumbnailImage} />
          </TouchableOpacity>
        ))}
      </View>

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
  thumbnail: {
    width: width / 2 - 28,
    height: width / 2 - 28,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#eee',
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
});

export default Portfolio;
