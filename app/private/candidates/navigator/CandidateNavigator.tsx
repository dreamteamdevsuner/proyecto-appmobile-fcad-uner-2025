import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ROUTES from './routes';

import MensajeriaNavigator from '../screens/mensajeria/MensajeriaNavigator';
import ProfileNavigator from '../screens/perfil/ProfileNavigator';
import FavoritosNavigator from '../screens/favoritos/FavoritosNavigator';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Image, TouchableWithoutFeedback, View } from 'react-native';

import SwipeStack from './SwipeStack';
import { NavigatorScreenParams } from '@react-navigation/native';
import { ProfessionalContext } from '@appContext/ProfessionalContext';
import { Badge, Text } from 'react-native-paper';

type CandidateSwipeStackRootParams = {
  [ROUTES.CANDIDATE_SWIPE_MATCH_SCREEN]: {};
  [ROUTES.CANDIDATE_JOB_OFFER_SCREEN]: {
    jobOfferId: string;
  };
};
export type CandidateTabParamList = {
  // We use the helper here to "link" the types
  [ROUTES.CANDIDATE_HOME_TAB]: NavigatorScreenParams<CandidateSwipeStackRootParams>;

  [ROUTES.CANDIDATE_FAVORITOS_TAB]: undefined;
  [ROUTES.CANDIDATE_PROFILE_TAB]: undefined;
  [ROUTES.CANDIDATE_MENSAJERIA_TAB]: undefined;
};
const Tab = createBottomTabNavigator<CandidateTabParamList>();

const CandidateNavigator = () => {
  const { updated } = useContext(ProfessionalContext);

  return (
    <Tab.Navigator
      initialRouteName={ROUTES.CANDIDATE_HOME_TAB}
      screenOptions={{
        tabBarActiveTintColor: '#BEB52C',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 70,
        },
      }}
    >
      <Tab.Screen
        name={ROUTES.CANDIDATE_HOME_TAB}
        component={SwipeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <View>
              <MaterialCommunityIcons
                name="briefcase-search-outline"
                size={size}
                color={color}
              />

              {updated && (
                <Badge
                  style={{
                    backgroundColor: color,
                    position: 'absolute',
                    top: -3,
                  }}
                  size={10}
                ></Badge>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.CANDIDATE_FAVORITOS_TAB}
        component={FavoritosNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="heart-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.CANDIDATE_PROFILE_TAB}
        component={ProfileNavigator}
        options={{
          headerShown: false,
          headerTitle: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={size}
              color={color}
            />
          ),
          title: 'Perfil',
        }}
      ></Tab.Screen>
      <Tab.Screen
        name={ROUTES.CANDIDATE_MENSAJERIA_TAB}
        component={MensajeriaNavigator}
        options={{
          headerShown: false,
          title: 'Mensajería',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="message-outline"
              size={size}
              color={color}
            />
          ),
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

export default CandidateNavigator;
