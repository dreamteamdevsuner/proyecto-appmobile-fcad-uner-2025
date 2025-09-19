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
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { AboutMe } from '../../../../../components/profile/AboutMe';
import { WhatIDo } from '../../../../../components/profile/WhatIDo';
import {
  ProfileHeader,
  ProfileScreenType,
} from '../../../../../components/profile/ProfileHeader';
import { HorizontalChips } from '../../../../../components/ui/HorizontalChips';
import { Role } from '../../../../../appContext/authContext';

export const ProfileScreen = (): React.JSX.Element => {
  const user: User = {
    id: '1',
    name: 'Juana',
    lastName: 'Costa',
    email: 'johndoe@test.com',
    role: Role.recruiter,
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

  // TODO: separar en componentes

  // TODO: Separar

  const renderScene = SceneMap({
    aboutMe: AboutMe.bind(null, user),
    whatIDo: WhatIDo.bind(null, user),
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ paddingVertical: 8 }}>
        <ProfileHeader
          name={user.name}
          ocupation={user.ocupation}
          avatarUrl={user.avatarUrl}
          city={user.city}
          profileScreenType={ProfileScreenType.RECRUITER_HOME_PROFILE}
        ></ProfileHeader>

        {user.role === Role.candidate && (
          <HorizontalChips skills={user.skills ?? []}></HorizontalChips>
        )}
      </View>

      {/* Tabs - separar cada componente*/}
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

export interface User {
  id: string;
  name: string;
  lastName: string;
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
  role: Role;
}
