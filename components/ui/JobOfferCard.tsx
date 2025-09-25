import {
  View,
  StyleProp,
  ViewStyle,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import React, { PropsWithChildren } from 'react';
import { JobOffer } from '../../interfaces/JobOffer';
import { Button, Card, Chip, Icon, Text } from 'react-native-paper';
import { lightBlue400 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';



//aca va la info de RRHH que publica
const HrAbout = ({ firstName, lastName, location }: { firstName: string, lastName: string, location: string }) => {
  const hrPic = require("../../assets/images/hrPlaceholder.jpg")

  return (<View style={{ display: 'flex', marginBottom: 10, marginHorizontal: 10, flexDirection: 'row', width: '100%', padding: 10, borderTopRightRadius: 50, borderTopLeftRadius: 50, marginTop: 10 }}>
    <View style={{ flex: 1, flexGrow: 1, flexBasis: '5%', maxWidth: 50, justifyContent: 'center', }}>
      <Card.Cover source={hrPic} style={{ width: 48, height: 48 }}  ></Card.Cover>
    </View>
    <View style={{ flex: 6, flexDirection: 'column', justifyContent: 'flex-start', paddingLeft: 10 }}>
      <View style={{ flexDirection: 'row', marginLeft: 2 }}>

        <Text>{firstName} </Text>
        <Text>{lastName} </Text>
      </View>
      <View>
        <Text variant='labelSmall'> Talent Acquisition - Freelancer</Text>
        <Text variant='labelSmall'> {location}</Text>

      </View>

    </View>
  </View >)
}

export interface JobOfferCardProps extends PropsWithChildren {
  item: JobOffer;
  styles?: StyleProp<ViewStyle>;
  handleScrollEnabled?: (val: boolean) => void | undefined;
}
function JobOfferCard({
  item,

}: JobOfferCardProps) {


  const { recruiterFirstName, recruiterLastName } = item
  return (
    <Card style={styles.card}>
      <View style={styles.recruiter}>
        <HrAbout firstName={recruiterFirstName} location={item.location} lastName={recruiterLastName}  ></HrAbout>
      </View>

      <View style={{ marginTop: -20 }}>


        <Card.Content style={{ marginVertical: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: 'black', gap: 10, minHeight: '70%' }}>
          <View>

            <Text variant='headlineSmall'>{item.title}</Text>
            <Text variant='labelMedium'>{item.company}</Text>
          </View>
          <View style={{
            flexDirection: 'row'
          }}>
            <Icon

              source={'map-marker-outline'}
              size={20}
              color="black"
            ></Icon>
            <Text >
              {item.location}
            </Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }} >
            <View style={{ flex: 1 }}>
              <Text variant='labelSmall'>{item.jobType}</Text>

            </View>
            <View style={{ flex: 1 }}>
              <Text variant='labelSmall'>{item.jobTime}</Text>

            </View>
            <View style={{ flex: 1 }}>
              <Text variant='labelSmall'>Inmediato</Text>
            </View>
            <View>
              <Text >
                <Text>
                  Acerca del empleo:
                  {"\n"}
                </Text>
                {item.about}
              </Text>
            </View>

          </View>




        </Card.Content>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '90%',
    position: 'relative',
    marginHorizontal: 'auto',
    marginTop: 10,
    paddingBottom: 20,
    textAlign: 'center',
    flex: 1,

    borderRadius: 50,


  },
  contentWrapper: {
    backgroundColor: 'blue',
    width: '100%',
  },
  chipContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 8,
    gap: 8,

    alignSelf: 'center',
  },
  recruiter: {
    display: 'flex',
    flexDirection: 'row',
  },

  chip: {
    backgroundColor: '#2c2c2c',
    color: 'white',
    borderRadius: 20,
    fontSize: 10,
    //POR QUE LOS ESTILOS DE LEO NO ME FUNCIONAN SI ES EL MISMO COMPONENT Y TENGO QUE AGREGAR MR = 5 ??!
    marginRight: 5,
  },
});

export default JobOfferCard;
