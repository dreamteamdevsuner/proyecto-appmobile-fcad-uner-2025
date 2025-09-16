import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { candidates2 } from "../../../../mockup/candidates";
import CandidateCard from "../../../../components/ui/CandidateCard";
import { Button, Card, Icon } from "react-native-paper";
import { ElevationLevels } from "react-native-paper/lib/typescript/types";
const data = candidates2;
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const RecruiterSwipeMatchScreen = () => {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const imageLink = require("../../../../assets/images/recruiter.png");
  const [enabledScroll, setEnabledScroll] = useState(true);
  const handleScrollEnabled = (val: boolean) => {
    setEnabledScroll(val);
  };
  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Carousel
          ref={ref}
          width={width}
          height={height / 2}
          data={data}
          onProgressChange={progress}
          enabled={enabledScroll}
          renderItem={({ item, index }) => {
            return (
              <CandidateCard
                {...{ handleScrollEnabled }}
                key={index}
                candidate={item}
              >
                <View style={{ paddingVertical: 25, paddingHorizontal: 35 }}>
                  <Card.Cover
                    style={{ objectFit: "contain" }}
                    source={imageLink}
                    height={60}
                  ></Card.Cover>
                </View>
              </CandidateCard>
            );
          }}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity activeOpacity={0.6}>
          <View>
            <Button
              icon={() => (
                <View style={{ marginLeft: 15 }}>
                  <Icon size={60} color="black" source={"close"}></Icon>
                </View>
              )}
              mode="contained"
              style={{
                borderRadius: 100,
                height: 80,
                width: 80,
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                elevation: 9,
              }}
              buttonColor="white"
              textColor="black"
              children
            ></Button>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6}>
          <View>
            <Button
              icon={() => (
                <View style={{ marginLeft: 15 }}>
                  <Icon size={70} color="black" source={"heart-outline"}></Icon>
                </View>
              )}
              mode="contained"
              style={{
                borderRadius: 100,
                height: 100,
                width: 100,
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                elevation: 9,
              }}
              buttonColor="white"
              textColor="black"
              children
            ></Button>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(50,50,50,.4)",
    flex: 1,
    flexDirection: "column",
  },
  buttonsContainer: {
    flexDirection: "row",
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  carouselContainer: { paddingBottom: 10 },
  carousel: {},

  matchButton: {
    fontSize: 30,
  },
});
export default RecruiterSwipeMatchScreen;
