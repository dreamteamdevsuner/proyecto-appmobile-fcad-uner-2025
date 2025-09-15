import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import React, { PropsWithChildren } from "react";
import { Card, Chip } from "react-native-paper";
import { Candidate } from "../../interfaces/Candidate";
interface CandidateCardProps extends PropsWithChildren {
  candidate: Candidate;
  styles?: StyleProp<ViewStyle>;
}
const CandidateCard = ({ candidate, children }: CandidateCardProps) => {
  return (
    <Card>
      <Card.Title
        title={candidate.firstName + " " + candidate.lastName}
      ></Card.Title>
      <Card.Content>
        <Text>{candidate.profession}</Text>
        <View>
          {candidate.skills.map((skill, idx) => (
            <Chip key={idx}>{skill} </Chip>
          ))}
        </View>
        {children}
      </Card.Content>
    </Card>
  );
};
const styles = StyleSheet.create({
  card: {},
});
export default CandidateCard;
