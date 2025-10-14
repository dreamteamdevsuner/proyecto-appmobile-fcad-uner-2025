import React from 'react';
import { View } from 'react-native';
import { TabBar, TabBarProps } from 'react-native-tab-view';

export interface ProfileTabRoute {
  key: string;
  title: string;
}

type ProfileTabBarProps = TabBarProps<ProfileTabRoute>;

const CustomProfileTabBar = (props: ProfileTabBarProps) => (
  <TabBar
    {...props}
    indicatorStyle={{
      backgroundColor: '#6750A4',
      height: 3,
      borderTopRightRadius: 3,
      borderTopLeftRadius: 3,
    }}
    style={{
      backgroundColor: '#1D1C21',
      borderBottomWidth: 1,
      borderBottomColor: '#0A090F',
      elevation: 0,
      overflow: 'hidden',
    }}
    activeColor="#FFFFFF"
    inactiveColor="#FFFFFF"
    tabStyle={{}}
    android_ripple={{ color: '#EADDFF' }}
    renderIndicator={(indicatorProps) => {
      const { navigationState, getTabWidth, layout } = indicatorProps;
      const activeRoute = navigationState.routes[navigationState.index];
      const textWidth = (activeRoute.title ? activeRoute.title.length : 0) * 7; // 7px por caracter aprox
      let tabWidth = getTabWidth
        ? getTabWidth(navigationState.index)
        : layout.width / navigationState.routes.length;
      return (
        <View
          style={{
            position: 'absolute',
            left: tabWidth * navigationState.index + (tabWidth - textWidth) / 2,
            width: textWidth,
            bottom: 0,
            height: 3,
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
          }}
        />
      );
    }}
  />
);

export default CustomProfileTabBar;
