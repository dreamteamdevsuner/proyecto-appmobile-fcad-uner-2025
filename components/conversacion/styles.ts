import styled from 'styled-components/native';
import { View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

export const Container = styled(View)`
  flex: 1;
  background-color: #0A090F;
`;

export const MessageRow = styled(View)<{ isMe: boolean }>`
  flex-direction: row;
  align-items: flex-end;
  margin-vertical: 4px;
  justify-content: ${(props) => (props.isMe ? 'flex-end' : 'flex-start')};
  align-self: ${(props) => (props.isMe ? 'flex-end' : 'flex-start')};
`;

export const Bubble = styled(View)<{ isMe: boolean }>`
  max-width: 80%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: ${(props) => (props.isMe ? 20 : 4)}px;
  border-bottom-right-radius: ${(props) => (props.isMe ? 4 : 20)}px;
  padding: 10px;
  background-color: ${(props) => (props.isMe ? '#3a2f4e' : '#f2f2f2')};
`;

export const MessageText = styled(Text)<{ isMe: boolean }>`
  font-size: 15px;
  color: ${(props) => (props.isMe ? '#fff' : '#000')};
  flex-shrink: 1;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

export const InputContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  padding-horizontal: 6px;
  padding-vertical: 4px;
  border-top-width: 1px;
  border-top-color: #ddd;
`;

export const StyledTextInput = styled(TextInput)`
  flex: 1;
  margin-right: 6px;
`;
