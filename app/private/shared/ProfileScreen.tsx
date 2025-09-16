import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import { Button, Surface, Chip, Avatar } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

export const ProfileScreen = (): React.JSX.Element => {
  const user: User = {
    id: '1',
    name: 'Juana Costa',
    email: 'johndoe@test.com',
    avatarUrl: 'https://i.pravatar.cc/400?img=43',
    ocupation: 'Diseañdora UX/UI',
    phoneNumber: '+1234567890',
    address: '123 Main St, City, Country',
    city: 'Argentina',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. \n\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    skills: [
      'JavaScript',
      'React',
      'React Native',
      'Node.js',
      'TypeScript',
      'NestJS',
    ],
    socialLinks: [
      {
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/johndoe',
      },
      {
        name: 'GitHub',
        url: 'https://github.com',
      },
      {
        name: 'Twitter',
        url: 'https://twitter.com/johndoe',
      },
      {
        name: 'Instagram',
        url: 'https://instagram.com/johndoe',
      },
    ],
    studies: [
      'B.Sc. in Computer Science from XYZ University',
      'M.Sc. in Software Engineering from ABC University',
    ],
    otherStudies: [
      'Mar. 2025 - Jun. 2025: Lorem Ipsum Lalala la',
      'Sep. 2022 - Ene. 2023: Curso de React Native - Coderhouse',
    ],
    experience: [
      'Software Developer at ABC Corp (2019-Present)',
      'Intern at XYZ Ltd (2018-2019)',
      'Freelance Developer (2017-2018)',
    ],
  };

  const layout = Dimensions.get('window');
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'aboutMe', title: 'Quien soy' },
    { key: 'whatIDo', title: 'Lo que hago' },
  ]);

  const AboutMeRoute = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
        <Text style={styles.title}>Sobre mí:</Text>
        <Text style={styles.textContent}>{user.bio}</Text>
      </Surface>

      <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
        <Text style={styles.title}>Estudios formales:</Text>
        {user.studies?.map((study, idx) => (
          <Text key={idx} style={styles.textContent}>
            {study}
          </Text>
        ))}
      </Surface>

      <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
        <Text style={styles.title}>Otros estudios:</Text>
        {user.otherStudies?.map((study, idx) => (
          <Text key={idx} style={styles.textContent}>
            {study}
          </Text>
        ))}
      </Surface>

      <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
        <Text style={styles.title}>Experiencia laboral:</Text>
        {user.experience?.map((exp, idx) => (
          <Text key={idx} style={styles.textContent}>
            {exp}
          </Text>
        ))}
      </Surface>

      <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
        <Text style={styles.title}>Contacto</Text>
        <FlatList
          data={user.socialLinks}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          renderItem={({ item, index }) => (
            <Pressable
              key={index}
              onPress={async () => {
                await Linking.openURL(item.url);
              }}
            >
              <Avatar.Image
                size={45}
                source={{ uri: '../../../assets/skeleton-view.png' }}
              />
              <Text style={styles.textContent}>{item.name}</Text>
            </Pressable>
          )}
        />
      </Surface>
    </ScrollView>
  );

  const WhatIDoRoute = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
        <View style={{ width: '100%', alignItems: 'center', gap: 16 }}></View>
      </Surface>
    </ScrollView>
  );

  const renderScene = SceneMap({
    aboutMe: AboutMeRoute,
    whatIDo: WhatIDoRoute,
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header con imagen y datos */}
      <View style={{ alignItems: 'center', paddingVertical: 8 }}>
        <Surface style={styles.surface} mode="flat" elevation={4}>
          <Image
            source={{ uri: user.avatarUrl }}
            style={styles.image}
            width={124}
            height={124}
          />
          <View
            style={{
              gap: 4,
              flexDirection: 'column',
              alignContent: 'space-evenly',
              justifyContent: 'space-between',
              paddingVertical: 8,
              height: '100%',
              width: '100%',
              maxWidth: 180,
            }}
          >
            <View>
              <Text style={{ fontSize: 24 }}>{user.name}</Text>
              <Text style={{ fontSize: 16, flexShrink: 1 }}>
                {user.ocupation}
              </Text>
            </View>
            <Text numberOfLines={1} ellipsizeMode="tail">
              {user.city}
            </Text>
          </View>
        </Surface>

        {/* Chips de habilidades */}
        <FlatList
          data={user.skills}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}
          renderItem={({ item }) => (
            <Chip key={item} style={styles.chip} textStyle={{ color: 'white' }}>
              {item}
            </Chip>
          )}
        />
      </View>

      {/* Tabs - ¡Aquí NO hay ScrollView! */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        style={{ marginHorizontal: 8, borderRadius: 30 }}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{
              backgroundColor: '#6750A4',
              height: 3,
              borderTopRightRadius: 3,
              borderTopLeftRadius: 3,
            }}
            style={{
              backgroundColor: '#FEF7FF',
              borderBottomWidth: 1,
              borderBottomColor: '#cacacaff',
              elevation: 0,
              overflow: 'hidden',
            }}
            activeColor="#6750A4"
            inactiveColor="#2c2c2c"
            tabStyle={{}}
            android_ripple={{ color: '#EADDFF' }}
            renderIndicator={(indicatorProps) => {
              const { navigationState, getTabWidth, layout } = indicatorProps;
              const activeRoute = navigationState.routes[navigationState.index];
              const textWidth = activeRoute.title.length * 7; // 7px por caracter aprox
              let tabWidth = getTabWidth
                ? getTabWidth(navigationState.index)
                : layout.width / navigationState.routes.length;
              return (
                <View
                  style={{
                    position: 'absolute',
                    left:
                      tabWidth * navigationState.index +
                      (tabWidth - textWidth) / 2,
                    width: textWidth,
                    bottom: 0,
                    height: 3,
                    backgroundColor: '#6750A4',
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                  }}
                />
              );
            }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  surface: {
    padding: 16,
    height: 151,
    width: '95%',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 30,
    marginVertical: 8,
    marginHorizontal: 16,
    gap: 32,
    backgroundColor: '#E6E0E9',
  },
  image: {
    width: 124,
    height: 124,
    borderRadius: 20,
    backgroundColor: 'gray',
  },
  chipContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
    marginVertical: 8,
    alignSelf: 'center', // Centra los chips horizontalmente
  },
  chip: {
    backgroundColor: '#2c2c2c',
    color: 'white',
    borderRadius: 20,
  },
  tabContent: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    gap: 2,
  },
  surfaceDescription: {
    paddingTop: 16,
    paddingHorizontal: 32,
    paddingBottom: 32,
    backgroundColor: '#FEF7FF',
  },
  title: {
    fontWeight: 500,
    fontSize: 11,
    marginBottom: 8,
    color: '#49454F',
  },
  textContent: {
    color: '#1D1B20',
    fontSize: 14,
    lineHeight: 20,
  },
  expItem: {
    marginVertical: 4,
    color: '#333',
    lineHeight: 20,
  },
});

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  ocupation?: string;
  phoneNumber?: string;
  address?: string;
  city: string;
  bio?: string;
  skills?: string[];
  socialLinks?: { name: string; url: string }[];
  studies?: string[];
  otherStudies?: string[];
  experience?: string[];
}
