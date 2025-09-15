import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { candidates2 } from "../../../../mockup/candidates";
import CandidateCard from "../../../../components/ui/CandidateCard";
import { Button, Card } from "react-native-paper";
const data = candidates2;
const width = Dimensions.get("window").width;
const RecruiterSwipeMatchScreen = () => {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const imageLink = require("../../../../assets/images/recruiter.png");
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
      <View>
        <Carousel
          ref={ref}
          width={width}
          height={width / 2}
          data={data}
          onProgressChange={progress}
          renderItem={({ item, index }) => {
            return (
              <CandidateCard key={index} candidate={item}>
                <Card.Cover source={imageLink}></Card.Cover>
              </CandidateCard>
            );
          }}
        />

        <View style={styles.buttonsContainer}>
          <TouchableOpacity activeOpacity={0.6}>
            <View>
              <Button
                icon="close"
                mode="contained"
                buttonColor="white"
                textColor="black"
                children
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6}>
            <View style={{ backgroundColor: "white" }}>
              <Button
                icon="heart-outline"
                mode="contained"
                children
                buttonColor="white"
                textColor="black"
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "rgba(50,50,50,.4)",
  },
  buttonsContainer: { flexDirection: "row", justifyContent: "space-between" },
});
export default RecruiterSwipeMatchScreen;
