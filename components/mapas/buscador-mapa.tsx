import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, ActivityIndicator, Text } from 'react-native-paper';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LOCATIONIQ_API_KEY } from '@env';
import axios from 'axios';
import * as Location from '@utils/location';
import * as ExpoLocation from 'expo-location';
interface MapSearchProps {
  value: string;
  lat?: number;
  lng?: number;
  errors: string | undefined;
  onChange: (text: string) => void;
  onCoordsChange: (lat: number, lng: number) => void;
}

const DEFAULT_LAT = -34.9964963;
const DEFAULT_LNG = -64.9672817;

const MapSearch: React.FC<MapSearchProps> = ({
  value,
  lat,
  lng,
  errors,
  onChange,
  onCoordsChange,
}) => {
  const [coords, setCoords] = useState({
    latitud: lat ?? DEFAULT_LAT,
    longitud: lng ?? DEFAULT_LNG,
  });
  const [loading, setLoading] = useState(false);
  const [tienePermiso, setTienePermiso] = useState(false);
  const [options, setOptions] = useState<
    { display_name: string; lat: string; lon: string }[]
  >([]);

  const searchPlace = async () => {
    if (!value) return;
    try {
      setLoading(true);

      const url = `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(value)}&format=json&limit=3`;
      // API Nominatim de Open Street Map
      // const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      //   value,
      // )}&format=json&limit=3`;

      const res = await axios.get(url, {
        headers: {
          'Accept-Language': 'es',
        },
      });

      const data = res.data;

      if (data && data.length > 0) {
        if (data.length === 1) {
          const { lat, lon, display_name } = data[0];
          console.log('Lugar encontrado:', data[0]);
          const latitude = parseFloat(lat);
          const longitude = parseFloat(lon);
          setCoords({ latitud: latitude, longitud: longitude });
          onChange(display_name);
          onCoordsChange(latitude, longitude);
          setOptions([]);
        } else {
          setOptions(data);
        }
      } else {
        Alert.alert('No se encontraron resultados');
        resetToDefault();
      }
    } catch (err) {
      console.error('Error buscando lugar:', err);
      Alert.alert('Error', 'Ocurrió un error al buscar el lugar.');
      resetToDefault();
    } finally {
      setLoading(false);
    }
  };

  const resetToDefault = () => {
    setCoords({ latitud: DEFAULT_LAT, longitud: DEFAULT_LNG });
    onCoordsChange(DEFAULT_LAT, DEFAULT_LNG);
    setOptions([]);
    onChange('');
  };

  const selectOption = (option: {
    display_name: string;
    lat: string;
    lon: string;
  }) => {
    const latitude = parseFloat(option.lat);
    const longitude = parseFloat(option.lon);
    setCoords({ latitud: latitude, longitud: longitude });
    onChange(option.display_name);
    onCoordsChange(latitude, longitude);
    setOptions([]);
  };

  const clearText = () => {
    onChange('');
    resetToDefault();
  };

  useEffect(() => {
    Location.getPermissions(() => setTienePermiso(true));
  }, []);

  useEffect(() => {
    if (lat !== undefined && lng !== undefined) {
      setCoords({
        latitud: lat,
        longitud: lng,
      });
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0922, // Adjust for desired zoom
            longitudeDelta: 0.0421, // Adjust for desired zoom
          },
          1000,
        );
      }
    }
  }, [lat, lng]);

  const handleGetCurrentLocation = async () => {
    if (tienePermiso) {
      const ubicacion = await Location.getCurrentLocation();
      console.log(ubicacion);
      if (!ubicacion) {
        return;
      }
      const { latitude, longitude, direccion } = ubicacion;
      setCoords({ latitud: latitude, longitud: longitude });
      onCoordsChange(latitude, longitude);

      onChange(direccion);
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 5,
          longitudeDelta: 5,
        });
      }
    } else {
      Location.getPermissions(() => setTienePermiso(true));
    }
  };
  const mapRef = useRef<MapView>(null);
  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Buscar lugar"
        mode="outlined"
        style={styles.input}
        right={
          value ? (
            <TextInput.Icon
              icon="close"
              onPress={clearText}
              forceTextInputFocus={false}
            />
          ) : undefined
        }
      />
      {errors && (
        <Text style={{ color: 'red', marginBottom: 5 }}>{errors}</Text>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          onPress={searchPlace}
          mode="contained"
          style={styles.boton}
          icon={() => (
            <MaterialCommunityIcons name="search-web" size={20} color="black" />
          )}
        >
          Buscar
        </Button>
      )}

      {options.length > 1 && (
        <View style={styles.optionsContainer}>
          {options.map((opt, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => selectOption(opt)}
            >
              <Text>{opt.display_name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: coords.latitud,
          longitude: coords.longitud,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
        toolbarEnabled={true}
        zoomEnabled={true}
        scrollEnabled={true}
        zoomControlEnabled={true}
        showsMyLocationButton={true}
        showsCompass={true}
        onDoublePress={async (e: MapPressEvent) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          setCoords({ latitud: latitude, longitud: longitude });
          onCoordsChange(latitude, longitude);
          try {
            const [address] = await ExpoLocation.reverseGeocodeAsync({
              latitude,
              longitude,
            });
            const formattedAddress = `${address?.formattedAddress}`;
            if (!formattedAddress) {
              console.log('error obteniendo direccion reversed geo');
              throw Error('error obteniendo direccion reversed geo');
            }
            onChange(formattedAddress);
          } catch (error) {
            console.log('error getting reversed geo');
          }
        }}
      >
        <Marker
          coordinate={{
            latitude: coords.latitud,
            longitude: coords.longitud,
          }}
          title={value || 'Ubicación seleccionada'}
          description={`Lat: ${coords.latitud.toFixed(5)}, Lng: ${coords.longitud.toFixed(5)}`}
        />
      </MapView>
      <Button
        icon="crosshairs-gps"
        mode="outlined"
        onPress={handleGetCurrentLocation}
        style={{ marginTop: 10 }}
      >
        Usar mi ubicación actual
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    height: 200,
    marginTop: 10,
  },
  input: {
    borderRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 6,
    paddingHorizontal: 15,
  },
  boton: {
    marginTop: 20,
    backgroundColor: '#BEB52C',
    marginBottom: 20,
  },
  optionsContainer: {
    padding: 5,
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
});

export default MapSearch;
