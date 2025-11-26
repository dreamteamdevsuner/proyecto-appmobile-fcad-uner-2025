import { Image, ScrollView, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Badge, Card, DataTable, Icon, Text } from 'react-native-paper';

import { Ionicons } from '@expo/vector-icons';
import {
  JobOfferFullDescription,
  Skill,
} from '../../../../types/JobOfferFullDescription';

const JobOfferCardFullDescription = ({
  jobOffer,
}: {
  jobOffer: JobOfferFullDescription;
}) => {
  const {
    idpublicacion: { idusuario: user },
    idcontratacion: contrato,
    iddireccion: localizacion,
    idmodalidad: modalidad,
    idtipojornada: jornada,
  } = jobOffer;
  const { iddireccion: direccion } = user;
  const skillsByType = jobOffer.skills.reduce(
    (acc: { softSkills: Array<Skill>; hardSkills: Array<Skill> }, curr) => {
      if (curr.idskill.idtiposkill === 1) {
        acc.softSkills.push(curr);
      }
      if (curr.idskill.idtiposkill === 2) {
        acc.hardSkills.push(curr);
      }
      return acc;
    },
    { softSkills: [], hardSkills: [] },
  );
  const { hardSkills, softSkills } = skillsByType;
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
              {user?.nombre + ' ' + user.apellido}
            </Text>
            <Text style={styles.text}>{user.rol}</Text>
            {direccion.ciudad && direccion.pais && (
              <Text style={styles.text}>
                {`${direccion.ciudad}, ${direccion.pais}`}
              </Text>
            )}
          </View>
        </View>

        <Text style={[styles.subtitle, styles.text]}>{jobOffer.titulo}</Text>
        <Text style={styles.text}>{jobOffer.idempresa?.nombre}</Text>
        {localizacion.latitud && localizacion.longitud && (
          <View style={styles.mapContainer}>
            <Text style={styles.text}>
              <Ionicons name="location-outline" size={20} color="grey" />
              {localizacion.direccion}
            </Text>
            <MapView
              scrollEnabled={false}
              style={styles.map}
              onPanDrag={() => {}}
              region={{
                latitude: Number(localizacion.latitud),
                longitude: Number(localizacion.longitud),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: Number(localizacion.latitud),
                  longitude: Number(localizacion.longitud),
                }}
                title={jobOffer.titulo}
                description={`Lat: ${Number(localizacion.latitud).toFixed(5)}, Lng: ${Number(localizacion.longitud).toFixed(5)}`}
              />
            </MapView>
          </View>
        )}
        <DataTable.Row>
          <DataTable.Cell style={[styles.styleTable]}>
            {modalidad?.nombre}
          </DataTable.Cell>
          <DataTable.Cell style={[styles.styleTable]}>
            {jornada?.nombre}
          </DataTable.Cell>
          <DataTable.Cell style={[styles.styleTable]}>
            {contrato?.nombre}
          </DataTable.Cell>
        </DataTable.Row>

        <View style={{ marginTop: 10, padding: 15 }}>
          {jobOffer.descripcion && (
            <>
              <Text style={[styles.sectionTitle]}>Acerca del empleo:</Text>
              <Text style={styles.text}>{jobOffer.descripcion}</Text>
            </>
          )}

          {softSkills.length > 0 && (
            <>
              <Text style={[styles.sectionTitle]}>Habilidades:</Text>
              <View style={styles.skillsContainer}>
                {softSkills?.map(({ idskill: { idtiposkill, nombre } }) => {
                  return (
                    <Badge key={nombre + idtiposkill} style={styles.chip}>
                      {nombre}
                    </Badge>
                  );
                })}
              </View>
            </>
          )}
          {hardSkills.length > 0 && (
            <>
              <Text style={[styles.sectionTitle]}>Habilidades:</Text>
              <View style={styles.skillsContainer}>
                {hardSkills?.map(({ idskill: { idtiposkill, nombre } }) => {
                  return (
                    <Badge key={nombre} style={styles.chip}>
                      {nombre}
                    </Badge>
                  );
                })}
              </View>
            </>
          )}

          {jobOffer.beneficios && (
            <>
              <Text style={[styles.sectionTitle]}>Beneficios:</Text>
              <View style={{ marginTop: 4 }}>
                {Array.isArray(jobOffer.beneficios)
                  ? jobOffer.beneficios.map(
                      (beneficio: string, index: number) => (
                        <Text key={index} style={styles.beneficioItem}>
                          • {beneficio}
                        </Text>
                      ),
                    )
                  : jobOffer.beneficios
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
export default JobOfferCardFullDescription;
