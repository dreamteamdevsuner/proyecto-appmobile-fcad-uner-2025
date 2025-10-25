import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { Avatar, Badge, Card, DataTable, Divider } from 'react-native-paper';
import React from 'react';
import MapView, { Marker } from 'react-native-maps';

const modalidadList = [
  { label: 'Remoto', value: 'remoto' },
  { label: 'Presencial', value: 'presencial' },
  { label: 'Híbrido', value: 'hibrido' },
];
const jornadaList = [
  { label: 'Media jornada', value: 'media' },
  { label: 'Jornada completa', value: 'completa' },
  { label: 'Proyecto', value: 'proyecto' },
];
const contratoList = [
  { label: 'Inmediata', value: 'inmediata' },
  { label: 'Proceso de selección', value: 'proceso de seleccion' },
];

const OfertaScreen = ({ route }: any) => {
  const { data } = route.params;

  return (
    <ScrollView style={{ padding: 20 }}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Image
            source={{ uri: data.recruiter.avatarUrl }}
            style={styles.squareAvatar}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.title, styles.text]}>
              {data.recruiter.name}
            </Text>
            <Text style={styles.text}>{data.recruiter.role}</Text>
            <Text style={styles.text}>{data.recruiter.lugar}</Text>
          </View>
        </View>
        <Divider style={styles.line} />
        <Text style={[styles.subtitle, styles.text]}>{data.titulo}</Text>
        <Text style={styles.text}>{data.institucion}</Text>
        <View style={styles.mapContainer}>
          <Text style={styles.text}>
            <Ionicons name="location-outline" size={20} color="grey" />
            {data.localizacion}
          </Text>
          <MapView
            style={styles.map}
            region={{
              latitude: data.lat,
              longitude: data.lng,
              latitudeDelta: 5,
              longitudeDelta: 5,
            }}
          >
            <Marker
              coordinate={{
                latitude: data.lat,
                longitude: data.lng,
              }}
              title={data.titulo}
              description={`Lat: ${data.lat.toFixed(5)}, Lng: ${data.lng.toFixed(5)}`}
            />
          </MapView>
        </View>
        <DataTable.Row>
          <DataTable.Cell style={[styles.styleTable]}>
            {modalidadList.find((item) => item.value === data.modalidad)
              ?.label || data.modalidad}
          </DataTable.Cell>
          <DataTable.Cell style={[styles.styleTable]}>
            {jornadaList.find((item) => item.value === data.jornada)?.label ||
              data.jornada}
          </DataTable.Cell>

          <DataTable.Cell style={[styles.styleTable]}>
            {contratoList.find((item) => item.value === data.contrato)?.label ||
              data.contrato}
          </DataTable.Cell>
        </DataTable.Row>
        <View style={{ marginTop: 10, padding: 15 }}>
          <Text style={[styles.sectionTitle]}>Acerca del empleo:</Text>
          <Text style={styles.text}>{data.descripcion}</Text>
          <Text style={[styles.sectionTitle]}>Herramientas:</Text>
          <View style={styles.skillsContainer}>
            {data.hardSkills?.map((skill: string, index: number) => (
              <Badge key={index} style={styles.chip}>
                {skill}
              </Badge>
            ))}
          </View>
          <Text style={[styles.sectionTitle]}>Habilidades:</Text>
          <View style={styles.skillsContainer}>
            {data.softSkills?.map((skill: string, index: number) => (
              <Badge key={index} style={styles.chip}>
                {skill}
              </Badge>
            ))}
          </View>

          {/* <Text style={[styles.sectionTitle]}>
            Idiomas:
          </Text> */}
          {/* <View style={styles.skillsContainer}>
          {data.softSkills?.map((skill: string, index: number) => (
            <Badge key={index} style={styles.chip}>
              {skill}
            </Badge>
          ))}
        </View> */}
          <Text style={[styles.sectionTitle]}>Beneficios:</Text>
          <View style={{ marginTop: 4 }}>
            {Array.isArray(data.beneficios)
              ? data.beneficios.map((beneficio: string, index: number) => (
                  <Text key={index} style={styles.beneficioItem}>
                    • {beneficio}
                  </Text>
                ))
              : data.beneficios
                  .split('\n')
                  .map((beneficio: string, index: number) => (
                    <Text key={index} style={styles.beneficioItem}>
                      • {beneficio.trim()}
                    </Text>
                  ))}
          </View>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    height: 200,
    marginTop: 10,
  },
  card: {
    padding: 16,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 4,
  },
  title: { fontSize: 15, fontWeight: 'bold' },
  subtitle: { fontSize: 20, fontWeight: 'bold' },
  sectionTitle: { marginTop: 10, fontWeight: 'bold', color: 'white' },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  chip: {
    backgroundColor: 'black',
    color: 'white',
    margin: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 14,
    height: 32,
  },
  line: {
    height: 2,
    backgroundColor: '#cdcbcbff',
    marginVertical: 8,
  },
  squareAvatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    color: 'white',
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
    color: 'white',
  },
  text: {
    color: 'white',
  },
  styleTable: { flex: 1, justifyContent: 'center' },
  beneficioItem: {
    fontSize: 14,
    color: 'white',
    marginVertical: 2,
  },
  mapContainer: {
    marginVertical: 12,
  },
});
export default OfertaScreen;
