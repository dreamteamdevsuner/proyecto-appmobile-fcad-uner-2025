import React, { useEffect, useRef } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Appbar,
  Avatar,
  TextInput,
  IconButton,
  Text,
} from 'react-native-paper';
import styled from 'styled-components/native';

export type Message = {
  id: string;
  text: string;
  sender: 'me' | 'other';
};

type ChatScreenProps = {
  title: string;
  myName: string;
  messages: Message[];
  inputText: string;
  otherAvatarUrl: string | undefined;
  myAvatarUrl: string | undefined;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onBack?: () => void;
  onClose?: () => void;
};

const Container = styled(View)`
  flex: 1;
  background-color: #fff;
`;

const MessageRow = styled(View)<{ isMe: boolean }>`
  flex-direction: row;
  align-items: flex-end;
  margin-vertical: 4px;
  justify-content: ${(props) => (props.isMe ? 'flex-end' : 'flex-start')};
  align-self: ${(props) => (props.isMe ? 'flex-end' : 'flex-start')};
`;

const Bubble = styled(View)<{
  isMe: boolean;
}>`
  max-width: 80%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: ${(props) => (props.isMe ? 20 : 4)}px;
  border-bottom-right-radius: ${(props) => (props.isMe ? 4 : 20)}px;
  padding: 10px;
  background-color: ${(props) => (props.isMe ? '#3a2f4e' : '#f2f2f2')};
`;

const MessageText = styled(Text)<{ isMe: boolean }>`
  font-size: 15px;
  color: ${(props) => (props.isMe ? '#fff' : '#000')};
  flex-shrink: 1;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

const InputContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  padding-horizontal: 6px;
  padding-vertical: 4px;
  border-top-width: 1px;
  border-top-color: #ddd;
`;

const StyledTextInput = styled(TextInput)`
  flex: 1;
  margin-right: 6px;
`;

export const ChatScreen: React.FC<ChatScreenProps> = ({
  title,
  myName,
  messages,
  inputText,
  otherAvatarUrl,
  myAvatarUrl,
  onChangeText,
  onSend,
  onBack,
}) => {
  const flatListRef = useRef<FlatList>(null);

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.sender === 'me';
    return (
      <MessageRow isMe={isMe}>
        {!isMe &&
          (otherAvatarUrl ? (
            <Avatar.Image
              source={{ uri: otherAvatarUrl }}
              size={40}
              style={{ marginHorizontal: 6 }}
            />
          ) : (
            <Avatar.Text
              size={40}
              label={title.charAt(0)}
              style={{ marginHorizontal: 6 }}
            />
          ))}
        <Bubble isMe={isMe}>
          <MessageText
            selectable={true}
            isMe={isMe}
            numberOfLines={0}
            ellipsizeMode='clip'
          >
            {item.text}
          </MessageText>
        </Bubble>
        {isMe &&
          (myAvatarUrl ? (
            <Avatar.Image
              source={{ uri: myAvatarUrl }}
              size={40}
              style={{ marginHorizontal: 6 }}
            />
          ) : (
            <Avatar.Text
              size={40}
              label={myName.charAt(0)}
              style={{ marginHorizontal: 6 }}
            />
          ))}
      </MessageRow>
    );
  };

  return (
    <Container>
      {/* Header */}
      <Appbar.Header>
        <Appbar.BackAction onPress={onBack} />
        <Appbar.Content title={title} />
        <Appbar.Action icon='close' onPress={onBack} />
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={25}
        style={{ flex: 1 }}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />

        {/* Input */}
        <InputContainer>
          <StyledTextInput
            mode='outlined'
            placeholder='Escribe un mensaje...'
            value={inputText}
            onChangeText={onChangeText}
          />
          <IconButton icon='send' onPress={onSend} />
        </InputContainer>
      </KeyboardAvoidingView>
    </Container>
  );
};
