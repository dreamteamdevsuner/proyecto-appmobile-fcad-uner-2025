import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, ActivityIndicator, Text } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LOCATIONIQ_API_KEY } from '@env';
import axios from 'axios';

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
  const [coords, setCoords] = useState<{
    latitud: number;
    longitud: number;
  }>({
    latitud: lat ?? DEFAULT_LAT,
    longitud: lng ?? DEFAULT_LNG,
  });
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<
    { display_name: string; lat: string; lon: string }[]
  >([]);

  const searchPlace = async () => {
    if (!value) return;
    setLoading(true);
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
        setCoords({ latitud: DEFAULT_LAT, longitud: DEFAULT_LNG });
        onCoordsChange(DEFAULT_LAT, DEFAULT_LNG);
        setOptions([]);
        onChange('');
        Alert.alert('No se encontraron resultados');
      }
    } catch (err) {
      console.error('Error buscando lugar:', err);
      Alert.alert('Error', 'Ocurrió un error al buscar el lugar.');
      setCoords({ latitud: DEFAULT_LAT, longitud: DEFAULT_LNG });
      onCoordsChange(DEFAULT_LAT, DEFAULT_LNG);
      setOptions([]);
    } finally {
      setLoading(false);
    }
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
    setCoords({ latitud: DEFAULT_LAT, longitud: DEFAULT_LNG });
    onCoordsChange(DEFAULT_LAT, DEFAULT_LNG);
    setOptions([]);
  };

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
        style={styles.map}
        region={{
          latitude: coords.latitud,
          longitude: coords.longitud,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
      >
        {coords.latitud !== null && coords.longitud !== null && (
          <Marker
            coordinate={{
              latitude: coords.latitud,
              longitude: coords.longitud,
            }}
            title={value}
            description={`Lat: ${coords.latitud.toFixed(5)}, Lng: ${coords.longitud.toFixed(5)}`}
          />
        )}
      </MapView>
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
