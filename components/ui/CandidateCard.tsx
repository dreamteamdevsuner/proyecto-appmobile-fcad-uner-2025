import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  FlatList,
  Image,
} from 'react-native';
import React, { PropsWithChildren, useMemo } from 'react';
import { Card, Chip, Icon, Surface, Text, useTheme } from 'react-native-paper';
import { CandidatePreview } from '@database/DBCandidatePreview';
import useImageSourceFallback from '../../hooks/useImageSourceFallback';

export interface CandidateCardProps extends PropsWithChildren {
  item: CandidatePreview & { ofertaTitulo?: string }; // Oferta título
  styles?: StyleProp<ViewStyle>;
  handleScrollEnabled?: (val: boolean) => void | undefined;
}
/* function CandidateCard({
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
export default CandidateCard; */
function CandidateCard({
  item,
  children,
  handleScrollEnabled,
}: CandidateCardProps) {
  const theme = useTheme();

  const { imageError, onError } = useImageSourceFallback(
    item?.fotoperfil ?? '',
    require('../../assets/images/avatarCandidatePlaceholder.jpg'),
  );

  const imageSource =
    !imageError && item.fotoperfil
      ? { uri: item.fotoperfil }
      : require('../../assets/images/avatarCandidatePlaceholder.jpg');

  return (
    <Surface
      style={[localStyles.cardContainer, localStyles.shadow]}
      elevation={4}
    >
      {item.ofertaTitulo && (
        <View
          style={{
            ...localStyles.chipContainer,
            ...{ position: 'absolute', top: -25 },
          }}
        >
          <Chip
            mode="outlined"
            textStyle={{ color: 'white' }}
            style={localStyles.chip}
          >
            {item.ofertaTitulo}
          </Chip>
        </View>
      )}
      {/* Top Section: Location & Remote Label (Aligned Right) */}
      <View style={localStyles.headerRow}>
        <View style={localStyles.locationContainer}>
          <View style={localStyles.locationRow}>
            <Icon source="map-marker-outline" size={14} color="#666" />
            <Text variant="labelSmall" style={localStyles.locationText}>
              {item?.iddireccion?.ciudad ?? 'Unknown'}
            </Text>
          </View>
          <Text variant="labelSmall" style={localStyles.remoteText}>
            REMOTO
          </Text>
        </View>
      </View>

      {/* Middle Section: Avatar & Match Badge */}
      <View style={localStyles.avatarSection}>
        <Image
          source={imageSource}
          style={localStyles.avatar}
          resizeMode="cover"
          onError={onError}
        />
      </View>

      {/* Info Section: Name & Role */}
      <View style={localStyles.infoSection}>
        <Text variant="headlineSmall" style={localStyles.nameText}>
          {item.nombre} {item.apellido}
        </Text>
        <Text variant="bodyMedium" style={localStyles.roleText}>
          {item.rol}
        </Text>
      </View>

      {/* Skills List */}
      <View style={localStyles.skillsSection}>
        <FlatList
          scrollEnabled={false}
          data={item.skills}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={localStyles.skillsContent}
          // Preserving your specific touch logic for parent swipers
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleScrollEnabled && handleScrollEnabled(false);
          }}
          onTouchEnd={() => handleScrollEnabled && handleScrollEnabled(true)}
          onScrollBeginDrag={() =>
            handleScrollEnabled && handleScrollEnabled(false)
          }
          onScrollEndDrag={() =>
            handleScrollEnabled && handleScrollEnabled(true)
          }
          renderItem={({ item: skill, index }) => (
            <Chip
              mode="flat"
              style={localStyles.chip}
              textStyle={localStyles.chipText}
              key={index}
              onPress={() => {
                handleScrollEnabled && handleScrollEnabled(false);
              }}
            >
              {skill.nombre}
            </Chip>
          )}
        />
      </View>

      {/* Bottom Plus Icon */}
      <View style={localStyles.actionSection}>{children}</View>
    </Surface>
  );
}

const localStyles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#1a1a1aff', // Explicitly white to match the reference image
    borderRadius: 35, // High border radius for that smooth look
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 25,
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  // --- Header ---
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    paddingRight: 10,
  },
  locationContainer: {
    alignItems: 'flex-end',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  locationText: {
    fontWeight: '700',
    color: '#d3d3d3ff',
    textTransform: 'uppercase',
  },
  remoteText: {
    fontWeight: '400',
    color: '#eeeeeeff',
    fontSize: 10,
  },
  // --- Avatar ---
  avatarSection: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 35, // Soft square (Squircle) look
    backgroundColor: '#f0f0f0',
  },
  matchBadge: {
    position: 'absolute',
    bottom: -5,
    right: -10,
    backgroundColor: '#F5F5F5',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  matchText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
  },
  // --- Info ---
  infoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nameText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#e0e0e0ff',
    marginBottom: 2,
  },
  roleText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  },
  // --- Skills ---
  skillsSection: {
    width: '100%',
    height: 40,
    marginBottom: 15,
  },
  skillsContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    backgroundColor: '#2c2c2c', // Dark pill background
    borderRadius: 20,
    height: 32,
  },
  chipContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 8,
    gap: 8,

    alignSelf: 'center',
  },

  chipText: {
    color: 'white',
    fontSize: 11,
    lineHeight: 18, // Adjusts vertical center of text in chip
  },
  // --- Footer ---
  actionSection: {
    marginTop: 5,
    opacity: 0.6,
  },
});

export default CandidateCard;
