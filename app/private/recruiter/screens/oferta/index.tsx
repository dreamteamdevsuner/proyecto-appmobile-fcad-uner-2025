import { Ionicons } from '@expo/vector-icons';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { Badge, Card, DataTable, Divider } from 'react-native-paper';
import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { useContext } from 'react';
import { DataContext } from '@providers/DataContext';
import { useAuth } from '@appContext/authContext';

const OfertaScreen = ({ route }: any) => {
  const { data } = route.params;
  const {
    state: { user },
  } = useAuth();
  const {
    modalidad: modalidadList,
    tipoJornada: jornadaList,
    contratacion: contratoList,
    softSkills: softSkillsList,
    hardSkills: hardSkillsList,
  } = useContext(DataContext);
  if (!user) return null;
  return (
    <ScrollView style={{ padding: 20 }}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Image
            source={
              user.fotoperfil
                ? { uri: user.fotoperfil }
                : require('@assets/images/default_profile_picture.jpg')
            }
            style={styles.squareAvatar}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.title, styles.text]}>
              {user.nombre + ' ' + user.apellido}
            </Text>
            <Text style={styles.text}>{user.rol}</Text>
            <Text style={styles.text}>
              {`${user.direccion.ciudad}, ${user.direccion.pais}`}
              {/* {user.direccion?.direccion && `${user.direccion?.direccion}`} */}
            </Text>
          </View>
        </View>
        <Divider style={styles.line} />
        <Text style={[styles.subtitle, styles.text]}>{data.titulo}</Text>
        <Text style={styles.text}>{data.institucion}</Text>
        {data.localizacion && (
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
        )}
        <DataTable.Row>
          <DataTable.Cell style={[styles.styleTable]}>
            {modalidadList.find((item) => item.id === data.modalidad)?.nombre}
          </DataTable.Cell>
          <DataTable.Cell style={[styles.styleTable]}>
            {jornadaList.find((item) => item.id === data.jornada)?.nombre ||
              data.jornada}
          </DataTable.Cell>
          <DataTable.Cell style={[styles.styleTable]}>
            {contratoList.find((item) => item.id === data.contrato)?.nombre ||
              data.contrato}
          </DataTable.Cell>
        </DataTable.Row>

        <View style={{ marginTop: 10, padding: 15 }}>
          {data.descripcion && (
            <>
              <Text style={[styles.sectionTitle]}>Acerca del empleo:</Text>
              <Text style={styles.text}>{data.descripcion}</Text>
            </>
          )}

          {data.softSkills?.length > 0 && (
            <>
              <Text style={[styles.sectionTitle]}>Habilidades:</Text>
              <View style={styles.skillsContainer}>
                {data.softSkills?.map((idskill: string, index: number) => {
                  const skill = softSkillsList.find((s) => s.id === idskill);
                  return (
                    <Badge key={index} style={styles.chip}>
                      {skill?.nombre}
                    </Badge>
                  );
                })}
              </View>
            </>
          )}
          {data.hardSkills?.length > 0 && (
            <>
              <Text style={[styles.sectionTitle]}>Herramientas:</Text>
              <View style={styles.skillsContainer}>
                {data.hardSkills?.map((idskill: string, index: number) => {
                  const skill = hardSkillsList.find((s) => s.id === idskill);
                  return (
                    <Badge key={index} style={styles.chip}>
                      {skill?.nombre}
                    </Badge>
                  );
                })}
              </View>
            </>
          )}

          {data.beneficios && (
            <>
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
            </>
          )}
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
