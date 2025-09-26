import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { Avatar, Badge, Card, DataTable, Divider } from 'react-native-paper';

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
            <Text style={styles.title}>{data.recruiter.name}</Text>
            <Text>{data.recruiter.role}</Text>
            <Text style={styles.lightLight}>{data.recruiter.lugar}</Text>
          </View>
        </View>
        <Divider style={styles.line} />
        <Text style={styles.subtitle}>{data.titulo}</Text>
        <Text style={styles.lightLight}>{data.institucion}</Text>
        <Text style={styles.light}>
          <Ionicons name="location-outline" size={20} color="grey" />
          {data.localizacion}
        </Text>
        <DataTable.Row style={styles.light}>
          <DataTable.Cell style={[styles.styleTable, styles.light]}>
            {data.modalidad}
          </DataTable.Cell>
          <DataTable.Cell style={[styles.styleTable, styles.light]}>
            {data.jornada}
          </DataTable.Cell>
          <DataTable.Cell style={[styles.styleTable, styles.light]}>
            {data.contrato}
          </DataTable.Cell>
        </DataTable.Row>
        <View style={{ marginTop: 10, padding: 15 }}>
          <Text style={[styles.subtitle2, styles.light]}>
            Acerca del empleo:
          </Text>
          <Text style={styles.light}>{data.descripcion}</Text>
          <Text style={[styles.subtitle2, styles.light, styles.sectionTitle]}>
            Herramientas:
          </Text>
          <View style={styles.skillsContainer}>
            {data.hardSkills?.map((skill: string, index: number) => (
              <Badge key={index} style={styles.chip}>
                {skill}
              </Badge>
            ))}
          </View>
          <Text style={[styles.subtitle2, styles.light, styles.sectionTitle]}>
            Habilidades:
          </Text>
          <View style={styles.skillsContainer}>
            {data.softSkills?.map((skill: string, index: number) => (
              <Badge key={index} style={styles.chip}>
                {skill}
              </Badge>
            ))}
          </View>

          {/* <Text style={[styles.subtitle2, styles.light, styles.sectionTitle]}>
            Idiomas:
          </Text> */}
          {/* <View style={styles.skillsContainer}>
          {data.softSkills?.map((skill: string, index: number) => (
            <Badge key={index} style={styles.chip}>
              {skill}
            </Badge>
          ))}
        </View> */}
          <Text style={[styles.subtitle2, styles.light, styles.sectionTitle]}>
            Beneficios:
          </Text>
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
  card: {
    padding: 16,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 4,
  },
  title: { fontSize: 15, fontWeight: 'bold' },
  subtitle: { fontSize: 20, fontWeight: 'bold' },
  subtitle2: { fontSize: 15, marginTop: 10, fontWeight: 'bold' },
  sectionTitle: { marginTop: 10, fontWeight: 'bold' },
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
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  lightLight: { color: 'gray' },
  light: { color: '#4e4c4cff', marginTop: 4 },
  styleTable: { flex: 1, justifyContent: 'center' },
  beneficioItem: {
    fontSize: 14,
    color: '#4e4c4cff',
    marginVertical: 2,
  },
});
export default OfertaScreen;
