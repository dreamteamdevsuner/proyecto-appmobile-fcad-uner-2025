import { View, StyleSheet, StyleProp, ViewStyle, FlatList } from 'react-native';
import React, { PropsWithChildren, useMemo } from 'react';
import { Card, Chip, Icon, Text } from 'react-native-paper';
import { CandidatePreview } from '@database/DBCandidatePreview';
import useImageSourceFallback from '../../hooks/useImageSourceFallback';

export interface CandidateCardProps extends PropsWithChildren {
  item: CandidatePreview & { ofertaTitulo?: string }; // Oferta título
  styles?: StyleProp<ViewStyle>;
  handleScrollEnabled?: (val: boolean) => void | undefined;
}
function CandidateCard({
  item,
  children,
  handleScrollEnabled,
}: CandidateCardProps) {
  const { imageError, onError } = useImageSourceFallback(
    item?.fotoperfil ?? '',
    '../../assets/images/avatarCandidatePlaceholder.jpg',
  );
  return (
    <Card style={styles.card}>
      <View
        style={{
          overflow: 'hidden',
          maxHeight: 340,
        }}
      >
        {item.ofertaTitulo && (
          <View style={styles.chipContainer}>
            <Chip
              mode="outlined"
              textStyle={{ color: 'white' }}
              style={styles.chip}
            >
              {item.ofertaTitulo}
            </Chip>
          </View>
        )}
        <View
          style={{
            paddingVertical: 25,
            paddingHorizontal: 35,
            flexDirection: 'row',
            gap: 20,
            maxHeight: '70%',
          }}
        >
          <View style={{ flexBasis: '80%' }}>
            <Card.Cover
              style={{ objectFit: 'fill', marginLeft: 40, resizeMode: 'cover' }}
              source={
                imageError
                  ? require('../../assets/images/profile_avatar_placeholder.png')
                  : { uri: item.fotoperfil }
              }
              onError={onError}
              defaultSource={require('../../assets/images/profile_avatar_placeholder.png')}
              height={50}
            ></Card.Cover>
          </View>
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                source={'map-marker-outline'}
                size={20}
                color="black"
              ></Icon>
              <Text> {item?.iddireccion?.ciudad ?? ''}</Text>
            </View>
            <Text style={{ opacity: 0.3 }}> REMOTO</Text>
          </View>
        </View>
      </View>
      <View style={{ marginTop: -20 }}>
        <Card.Title
          title={
            <Text
              variant="headlineSmall"
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {item.nombre + ' ' + item.apellido}
            </Text>
          }
        ></Card.Title>

        <Card.Content>
          <Text
            style={{
              textAlign: 'center',
              marginTop: -10,
            }}
            variant="titleMedium"
          >
            {item.rol}
          </Text>
          <FlatList
            data={item.skills}
            scrollEnabled={false}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleScrollEnabled && handleScrollEnabled(false);
              return;
            }}
            onTouchEnd={(e) =>
              handleScrollEnabled && handleScrollEnabled(false)
            }
            onScrollBeginDrag={(e) =>
              handleScrollEnabled && handleScrollEnabled(false)
            }
            onScrollEndDrag={() => {
              handleScrollEnabled && handleScrollEnabled(true);
            }}
            style={styles.chipContainer}
            horizontal={true}
            renderItem={({ item, index }) => (
              <Chip
                mode="outlined"
                textStyle={{ color: 'white' }}
                style={styles.chip}
                key={index}
                onPress={() =>
                  handleScrollEnabled && handleScrollEnabled(false)
                }
              >
                <Text>{item.nombre}</Text>
              </Chip>
            )}
          ></FlatList>
          {children}
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
    marginTop: 20,
    paddingBottom: 40,
    textAlign: 'center',
    flex: 1,
    justifyContent: 'center',
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
  chip: {
    backgroundColor: '#2c2c2c',
    color: 'white',
    borderRadius: 20,

    fontSize: 10,

    marginRight: 5,
  },
});
export default CandidateCard;
