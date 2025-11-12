import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const getPermissions = async (callback: () => void) => {
  let { status, granted, canAskAgain } =
    await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    if (!canAskAgain) {
      Alert.alert(
        'Permiso denegado',
        'Debes habilitar la ubicación en la configuracion',
        [
          {
            text: 'Cancelar',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => console.log('Cancel Pressed'),
          },
        ],
      );
      return;
    }
    Alert.alert(
      'Permiso denegado',
      'Jobsy necesita permiso para acceder a tu ubicación',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => getPermissions(callback),
        },
      ],
    );
    return;
  } else if (granted) {
    callback();
  }
};

export async function getCurrentLocation(): Promise<
  | {
      latitude: number;
      longitude: number;
      direccion: string;
    }
  | undefined
> {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    if (location) {
      const { latitude, longitude } = location.coords;

      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      let direccion = '';
      if (results.length > 0) {
        const place = results[0];
        direccion = [
          place.city,
          place.country,
          place.name,
          place.street,
          place.region,
        ]
          .filter(Boolean)
          .join(', ');
        console.log('Dirección:', direccion);
      } else {
        console.log('No se encontró dirección para esas coordenadas');
      }
      return { latitude, longitude, direccion };
    } else {
      Alert.alert('Error', 'No se pudo obtener la ubicación actual.');
    }
  } catch (error) {
    Alert.alert('Error', 'No se pudo obtener la ubicación actual.');
    console.error(error);
  }
}
