import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { FAB, Portal } from 'react-native-paper';

export default function CustomNavBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const [stateHook, setStateHook] = useState({ open: false });

  const { open } = stateHook;

  const onStateHookChange = ({ open }: any) => setStateHook({ open });

  const navBarRoutes = state.routes.slice(0, 3);
  const fabRoutes = state.routes.slice(3);

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.navBarContainer}>
        {navBarRoutes.map((route, index) => {
          const { options } = descriptors[route.key];

          const routeIndex = state.routes.findIndex((r) => r.key === route.key);
          const isFocused = state.index === routeIndex;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // colores
          const activeColor =
            (descriptors[route.key].options.tabBarActiveTintColor as string) ||
            '#623CEA';
          const inactiveColor =
            (descriptors[route.key].options
              .tabBarInactiveTintColor as string) || '#888';

          const color = isFocused ? activeColor : inactiveColor;
          const size = 34;

          const tabBarIcon = descriptors[route.key].options.tabBarIcon;
          const icon =
            typeof tabBarIcon === 'function'
              ? tabBarIcon({ color, size, focused: isFocused })
              : null;

          return (
            <View key={route.key} style={styles.tabItem}>
              <Pressable
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {icon ? (
                  <View
                    style={[
                      styles.iconWrapper,
                      isFocused && styles.iconWrapperFocused,
                    ]}
                  >
                    {icon}
                  </View>
                ) : (
                  <Text
                    style={{
                      color,
                      fontSize: 12,
                    }}
                  >
                    {route.name}
                  </Text>
                )}
              </Pressable>
            </View>
          );
        })}
      </View>
      <View style={styles.fabContainer}>
        {fabRoutes.length > 0 && (
          <Portal>
            <FAB.Group
              open={open}
              visible
              icon={open ? 'close' : 'plus'}
              color="white"
              actions={fabRoutes.map((route) => {
                const routeIndex = state.routes.findIndex(
                  (r) => r.key === route.key,
                );
                const isFocused = state.index === routeIndex;
                const activeColor =
                  (descriptors[route.key].options
                    .tabBarActiveTintColor as string) || '#623CEA';
                const inactiveColor =
                  (descriptors[route.key].options
                    .tabBarInactiveTintColor as string) || '#888';

                const tabBarIcon = descriptors[route.key].options.tabBarIcon;

                return {
                  icon: (props: any) =>
                    typeof tabBarIcon === 'function'
                      ? tabBarIcon({
                          color: isFocused ? activeColor : inactiveColor,
                          size: props.size || 24,
                          focused: isFocused,
                        })
                      : undefined,
                  label: route.name,
                  onPress: () => {
                    navigation.navigate(route.name as any, route.params);
                    onStateHookChange({ open: false });
                  },
                  size: 'medium',
                } as any;
              })}
              onStateChange={onStateHookChange}
              onPress={() => {
                if (open) {
                  onStateHookChange({ open: false });
                }
              }}
              style={styles.fabItem}
              fabStyle={{
                width: 88,
                height: 88,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                borderRadius: 22,
                backgroundColor: '#6750A4',
              }}
            />
          </Portal>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 18,
    left: 18,
    right: 18,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  navBarContainer: {
    flex: 3,
    flexDirection: 'row',
    backgroundColor: '#e7e7e7da',
    borderRadius: 50,
    height: 88,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperFocused: {
    backgroundColor: '#c4c4c4ff',
    borderRadius: 40,
  },
  fabContainer: {
    padding: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabItem: {
    fontSize: 22,
    padding: 0,
  },
});
