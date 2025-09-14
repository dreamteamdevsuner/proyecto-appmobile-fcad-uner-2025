import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RecruiterHomeScreen from "../screens/RecruiterHomeScreen";
import ROUTES from "./routes";
import TestRecruiter from "../screens/TestRecruiter";
import RecruiterSwipeMatchScreen from "../screens/RecruiterSwipeMatchScreen";
import { Icon, MD3Colors } from "react-native-paper";

const Tab = createBottomTabNavigator();
const RecruiterNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={ROUTES.RECRUITER_SWIPE_MATCH}
    >
      <Tab.Screen
        options={{
          headerShown: true,
          headerTitle: "Jobsy",

          //MOVE THIS TO COMPONENT
          header: ({ options }) => {
            return (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 20,
                }}
              >
                <Icon size={15} source={"star-circle"} color={"black"}></Icon>
                <Text> {options.headerTitle?.toString()} </Text>
              </View>
            );
          },
        }}
        //MOVE THIS TO COMPONENT
        name={ROUTES.RECRUITER_SWIPE_MATCH}
        component={RecruiterSwipeMatchScreen}
      ></Tab.Screen>
      <Tab.Screen
        name={ROUTES.RECRUITER_HOME}
        component={RecruiterHomeScreen}
      ></Tab.Screen>
      <Tab.Screen
        name={ROUTES.RECRUITER_TEST}
        component={TestRecruiter}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

export default RecruiterNavigator;
