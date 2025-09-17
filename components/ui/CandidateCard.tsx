import { View, StyleSheet, StyleProp, ViewStyle, FlatList } from "react-native";
import React, { PropsWithChildren } from "react";
import { Card, Chip, Text } from "react-native-paper";
import { Candidate } from "../../interfaces/Candidate";
import { Pressable } from "react-native-gesture-handler";
interface CandidateCardProps extends PropsWithChildren {
  candidate: Candidate;
  styles?: StyleProp<ViewStyle>;
  handleScrollEnabled: (val: boolean) => void;
}
const CandidateCard = ({
  candidate,
  children,
  handleScrollEnabled,
}: CandidateCardProps) => {
  return (
    <Card style={styles.card}>
      {children}

      <Card.Title
        title={
          <Text variant="headlineSmall" style={{ textAlign: "center" }}>
            {candidate.firstName + " " + candidate.lastName}{" "}
          </Text>
        }
      ></Card.Title>

      <Card.Content>
        <Text style={{ textAlign: "center" }} variant="titleLarge">
          {candidate.profession}
        </Text>

        <FlatList
          data={candidate.skills}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleScrollEnabled(false);
            return;
          }}
          onTouchEnd={(e) => handleScrollEnabled(false)}
          onScrollBeginDrag={(e) => handleScrollEnabled(false)}
          onScrollEndDrag={() => {
            handleScrollEnabled(true);
          }}
          style={{ gap: 20, marginVertical: 20 }}
          horizontal={true}
          renderItem={({ item, index }) => (
            <Chip
              mode="outlined"
              textStyle={{ color: "white" }}
              style={{ backgroundColor: "black", marginRight: 10 }}
              key={index}
            >
              {item}
            </Chip>
          )}
        ></FlatList>
      </Card.Content>
    </Card>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    width: "90%",
    marginHorizontal: "auto",
    marginTop: 20,
    textAlign: "center",
    flex: 1,
    borderRadius: 20,
  },
  chipList: {
    display: "flex",
    flexDirection: "row",
  },
});
export default CandidateCard;
