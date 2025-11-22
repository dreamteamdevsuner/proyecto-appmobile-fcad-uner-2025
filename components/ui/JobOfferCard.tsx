import {
  View,
  StyleProp,
  ViewStyle,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Paths } from 'expo-file-system';
import { JobOffer } from '../../interfaces/JobOffer';
import { Button, Card, Chip, Icon, Text } from 'react-native-paper';
import { lightBlue400 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import { recruiterPhotos } from '../../assets/recruiterPhotos';
import { red } from 'react-native-reanimated/lib/typescript/Colors';
import { HorizontalChips } from '../../components/ui/HorizontalChips';
import { DBJobPreview } from '@database/DBJobPreview';
import { Idusuario } from '../../types/database/DBJobPreview';
import moment from 'moment';
import { date } from 'yup';
import useImageSourceFallback from '../../hooks/useImageSourceFallback';

const HrAbout = ({
  firstName,
  lastName,
  location,
  photoKey,
  recruiterProfession,
  recruiterLocation,
  cuentaRegresiva,
}: {
  firstName: string;
  lastName: string;
  location: string;
  photoKey?: string;
  cuentaRegresiva?: string;
  recruiterProfession?: string;
  recruiterLocation?: string;
}) => {
  const { imageError, onError } = useImageSourceFallback(
    photoKey ?? '',
    '../../assets/images/default_profile_picture.jpg',
  );

  return (
    <View
      style={{
        display: 'flex',
        marginBottom: 10,
        marginHorizontal: 10,
        flexDirection: 'row',
        width: '100%',
        padding: 10,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        marginTop: 10,
      }}
    >
      <View
        style={{
          flex: 1,
          flexGrow: 1,
          flexBasis: '5%',
          maxWidth: 50,
          justifyContent: 'center',
        }}
      >
        <Card.Cover
          source={
            imageError
              ? require('../../assets/images/default_profile_picture.jpg')
              : { uri: photoKey }
          }
          onError={onError}
          defaultSource={require('../../assets/images/default_profile_picture.jpg')}
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: 'black',
          }}
        />
      </View>
      <View
        style={{
          flex: 6,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          paddingLeft: 10,
        }}
      >
        <View style={{ flexDirection: 'row', marginLeft: 2 }}>
          <Text style={hrStyles.name}>{firstName} </Text>
          <Text style={hrStyles.name}>{lastName} </Text>
        </View>
        <View style={{ flexDirection: 'column', marginLeft: 2 }}>
          <Text style={hrStyles.subtitle}>{recruiterProfession}</Text>
          <Text style={hrStyles.subtitle}>{recruiterLocation}</Text>
        </View>
        <View style={{ flexDirection: 'column', marginLeft: 2 }}>
          <Text style={hrStyles.subtitle}>{cuentaRegresiva} días</Text>
        </View>
      </View>
    </View>
  );
};

export interface JobOfferCardProps extends PropsWithChildren {
  item: DBJobPreview;
  styles?: StyleProp<ViewStyle>;
  handleScrollEnabled?: (val: boolean) => void | undefined;
}
function JobOfferCard({ item }: JobOfferCardProps) {
  const jobOfferDate = moment(
    new Date(item.idpublicacion.fechacreacion.toString()),
  );
  const today = moment();
  const rangeDate = today.diff(jobOfferDate, 'days');

  return (
    <Card style={styles.card}>
      <View style={styles.recruiter}>
        <HrAbout
          firstName={item.idpublicacion.idusuario.nombre}
          location={item.id}
          lastName={item.idpublicacion.idusuario.nombre}
          photoKey={item.idpublicacion.idusuario.fotoperfil}
          cuentaRegresiva={rangeDate.toString()}
          /*  cuentaRegresiva={dateTimeFormat.formatRange(
            new Date(Date.UTC(2025, 10, 1)),
            new Date(),
          )} */
          recruiterProfession={item.idpublicacion.idusuario.rol}
          recruiterLocation={item.idpublicacion.idusuario.ciudad}
        ></HrAbout>
      </View>

      <View style={{ marginTop: -20 }}>
        <Card.Content
          style={{
            marginVertical: 10,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: '#0A090F',
            borderBottomColor: '#0A090F',
            borderBottomWidth: 1,
            gap: 10,
            minHeight: '30%',
          }}
        >
          <View>
            <Text variant="headlineSmall">{item.titulo}</Text>
            <Text variant="labelMedium">{item.idempresa?.nombre}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              marginLeft: -5,
              marginBottom: 5,
              marginTop: -5,
            }}
          >
            <Icon source={'map-marker-outline'} size={20} color="white"></Icon>
            <Text>{item?.iddireccion?.ciudad ?? ''}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 5,
              height: 60,
              marginLeft: -15,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text variant="labelSmall">{item.idmodalidad?.nombre}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="labelSmall">{item.idtipojornada?.nombre}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="labelSmall">Inmediato</Text>
            </View>
            <View
              style={{
                display: 'flex',
                width: '100%',
                minHeight: 20,
              }}
            >
              <Text>
                <Text>
                  Acerca del empleo:
                  {'\n'}
                </Text>
                {item.descripcion}
              </Text>
            </View>
          </View>

          <View
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            <Button
              style={{ width: 24 }}
              children
              buttonColor="transparent"
              textColor="white"
              icon="plus-circle-outline"
              mode="contained"
            ></Button>
          </View>
        </Card.Content>
        <View
          style={{
            alignItems: 'flex-end',
            marginRight: 40,
            marginTop: 6,
          }}
        >
          <Text variant="labelSmall">{'item.cuentaRegresiva'}</Text>
        </View>
      </View>
    </Card>
  );
}
export interface JobOfferCardPropsHardCoded extends PropsWithChildren {
  item: JobOffer;
  styles?: StyleProp<ViewStyle>;
  handleScrollEnabled?: (val: boolean) => void | undefined;
}
export function JobOfferCardHardCoded({ item }: JobOfferCardPropsHardCoded) {
  const { recruiterFirstName, recruiterLastName } = item;
  return (
    <Card style={styles.card}>
      <View style={styles.recruiter}>
        <HrAbout
          firstName={recruiterFirstName}
          location={item.location}
          lastName={recruiterLastName}
          photoKey={item.recruiterPhoto}
          cuentaRegresiva={item.cuentaRegresiva}
          recruiterProfession={item.recruiterProfession}
          recruiterLocation={item.recruiterLocation}
        ></HrAbout>
      </View>

      <View style={{ marginTop: -20 }}>
        <Card.Content
          style={{
            marginVertical: 10,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: '#0A090F',
            borderBottomColor: '#0A090F',
            borderBottomWidth: 1,
            gap: 10,
            minHeight: '30%',
          }}
        >
          <View>
            <Text variant="headlineSmall">{item.title}</Text>
            <Text variant="labelMedium">{item.company}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              marginLeft: -5,
              marginBottom: 5,
              marginTop: -5,
            }}
          >
            <Icon source={'map-marker-outline'} size={20} color="white"></Icon>
            <Text>{item.location}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 5,
              height: 60,
              marginLeft: -15,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text variant="labelSmall">{item.jobType}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="labelSmall">{item.jobTime}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="labelSmall">Inmediato</Text>
            </View>
            <View
              style={{
                display: 'flex',
              }}
            >
              <Text>
                <Text>
                  Acerca del empleo:
                  {'\n'}
                </Text>
                {item.about}
              </Text>
            </View>
          </View>

          <View
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            <Button
              style={{ width: 24 }}
              children
              buttonColor="transparent"
              textColor="white"
              icon="plus-circle-outline"
              mode="contained"
            ></Button>
          </View>
        </Card.Content>
        <View
          style={{
            alignItems: 'flex-end',
            marginRight: 40,
            marginTop: 6,
          }}
        >
          <Text variant="labelSmall">{item.cuentaRegresiva}</Text>
        </View>
      </View>
    </Card>
  );
}

const hrStyles = StyleSheet.create({
  name: { fontSize: 16, color: '#ffffff' },
  subtitle: { fontSize: 13, color: '#b3b3b3' },
});

const styles = StyleSheet.create({
  card: {
    width: '90%',
    position: 'relative',
    marginHorizontal: 'auto',
    marginTop: 10,
    paddingBottom: 10,
    textAlign: 'center',
    flex: 1,
    borderRadius: 50,
    marginBottom: 70,
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

    marginRight: 5,
  },
  text: {
    alignItems: 'flex-end',
    marginRight: 20,
    marginBottom: 10,
    color: 'gray',
    fontSize: 9,
  },
});

export default JobOfferCard;
