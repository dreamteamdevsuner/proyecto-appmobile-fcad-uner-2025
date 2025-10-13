import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import { FAB, Portal } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import ROUTES from '../../../app/private/recruiter/navigator/routes';

export default function CustomNavBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const [stateHook, setStateHook] = useState({ open: false });

  const { open } = stateHook;

  const onStateHookChange = ({ open }: any) => setStateHook({ open });

  const navBarRoutes = state.routes.slice(0, 3);
  const defaultFabRoutes = state.routes.slice(3);

  // Logica para decidir que rutas deben mostrarse en el FAB
  const getFabRoutesForCurrent = (currentRouteKey: string) => {
    const currentRoute = state.routes.find((r) => r.key === currentRouteKey);
    if (!currentRoute) return [] as typeof state.routes;

    // Cambiar la lógica según la ruta actual
    switch (currentRoute.name) {
      case ROUTES.RECRUITER_SWIPE_MATCH:
        // Ocultar FAB
        return [] as typeof state.routes;
      case ROUTES.RECRUITER_FAVORITOS_TAB:
        // Ir a Mensajeria y en caso de estar en un perfil ajeno, ir a iniciar chat
        return defaultFabRoutes;
      case ROUTES.RECRUITER_PERFIL_TAB:
        // Ir a Crear Oferta
        return defaultFabRoutes;
      default:
        return defaultFabRoutes;
    }
  };

  const [dimensions, setDimensions] = useState({ height: 88, width: 120 });

  const buttonWidth = dimensions.width / navBarRoutes.length;

  const onTabBarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  useEffect(() => {
    const currentRoute = state.routes[state.index];
    if (!currentRoute) return;
    console.log(defaultFabRoutes);
    console.log(currentRoute);

    const navIndex = navBarRoutes.findIndex((r) => r.key === currentRoute.key);
    if (navIndex === -1) return;

    const backgroundWidth = Math.max(0, buttonWidth - 8);
    const offsetToCenter = (buttonWidth - backgroundWidth) / 2;

    const targetX = navIndex * buttonWidth + offsetToCenter;

    tabPositionX.value = withSpring(targetX, {
      duration: 500,
    });
  }, [state.index, dimensions.width, navBarRoutes.length]);

  return (
    <View style={styles.tabBarContainer}>
      <View onLayout={onTabBarLayout} style={styles.navBarContainer}>
        <Animated.View
          style={[
            animatedStyle,
            {
              position: 'absolute',
              backgroundColor: '#BEB52C',
              borderRadius: borderRadius - 4,
              height: dimensions.height - 8,
              width: buttonWidth - 8,
            },
          ]}
        />
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
                  display: 'flex',
                  flexDirection: 'row',
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
      {(() => {
        const currentRoute = state.routes[state.index];
        const routesForFab = currentRoute
          ? getFabRoutesForCurrent(currentRoute.key)
          : ([] as typeof state.routes);

        if (routesForFab.length === 0) return null;

        return (
          <View style={styles.fabContainer}>
            <Portal>
              <FAB.Group
                open={open}
                visible
                icon={open ? 'close' : 'plus'}
                color="white"
                actions={routesForFab.map((route) => {
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
                  padding: 22,
                  borderRadius: 22,
                  backgroundColor: '#6750A4',
                }}
              />
            </Portal>
          </View>
        );
      })()}
    </View>
  );
}

const borderRadius = 45;

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    height: 88,
    gap: 4,
  },
  navBarContainer: {
    flex: 3,
    flexDirection: 'row',
    backgroundColor: '#000000B2',
    borderRadius: borderRadius,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    height: '100%',
    flex: 1,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperFocused: {},
  fabContainer: {
    flex: 1,
  },
  fabItem: {},
});
