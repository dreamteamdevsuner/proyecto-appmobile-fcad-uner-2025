import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ROUTES from "../routes";
import CandidateHomeScreen from "../screens/CandidateHomeScreen";
import CandidateTestScreen from "../screens/CandidateTestScreen";

const Tab = createBottomTabNavigator();
const CandidateNavigator = () => {
  return (
    <Tab.Navigator initialRouteName={ROUTES.CANDIDATE_HOME}>
      <Tab.Screen
        name={ROUTES.CANDIDATE_HOME}
        component={CandidateHomeScreen}
      ></Tab.Screen>
      <Tab.Screen
        name={ROUTES.CANDIDATE_TEST}
        component={CandidateTestScreen}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

export default CandidateNavigator;
