import { View, Text, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
const data = [...new Array(6).keys()];
const width = Dimensions.get("window").width;
const RecruiterSwipeMatchScreen = () => {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Carousel
          ref={ref}
          width={width}
          height={width / 2}
          data={data}
          onProgressChange={progress}
          renderItem={({ index }) => {
            console.log("idx", index);
            return (
              <View
                style={{
                  flex: 1,
                  borderWidth: 1,
                  justifyContent: "center",
                }}
              >
                <Text style={{ textAlign: "center", fontSize: 30 }}>
                  {index}
                </Text>
              </View>
            );
          }}
        />

        <Pagination.Basic
          progress={progress}
          data={data}
          dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
          containerStyle={{ gap: 5, marginTop: 10 }}
          onPress={onPressPagination}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    opacity: 0.7,
    backgroundColor: "black",
  },
});
export default RecruiterSwipeMatchScreen;
