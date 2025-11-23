import {
  ActivityIndicator,
  StyleProp,
  View,
  ViewStyle,
  StyleSheet,
  ColorValue,
} from 'react-native';
import { useTheme } from 'react-native-paper';

interface LoadingProps {
  styles?: StyleProp<ViewStyle>;
  activityIndicatorStyles?: StyleProp<ViewStyle>;
  activityIndicatorSize?: number;
  activityIndicatorColor?: ColorValue;
}

const AppLoading = (props: LoadingProps) => {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        ...loadingBaseStyles.view,
        ...StyleSheet.flatten(props.styles),
      }}
    >
      <ActivityIndicator
        color={props.activityIndicatorColor ?? theme.colors.primary}
        size={props.activityIndicatorSize ?? 30}
        style={StyleSheet.flatten(props.activityIndicatorStyles)}
      ></ActivityIndicator>
    </View>
  );
};
const loadingBaseStyles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default AppLoading;
