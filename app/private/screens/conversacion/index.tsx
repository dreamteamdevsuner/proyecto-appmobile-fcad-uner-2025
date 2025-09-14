import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Appbar, Avatar, IconButton } from 'react-native-paper';
import { Message } from '../../../../types/Message';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Container,
  MessageRow,
  Bubble,
  MessageText,
  InputContainer,
  StyledTextInput,
} from './styles';
import { PrivateStackParamList } from '../../../../navigator/types';

type Props = NativeStackScreenProps<PrivateStackParamList, 'Conversación'>;

const Conversacion: React.FC<Props> = ({ route, navigation }) => {
  const {
    title,
    myName = 'Renata',
    otherAvatarUrl,
    myAvatarUrl,
  } = route.params;
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        text: `Hola, ${title}. Tu perfil es interesante para nuestra propuesta, ¿podrías enviarme tu CV a esta dirección? renata@correo.com Gracias.`,
        sender: 'me',
      },
      {
        id: '2',
        text: `¡Hola, Renata!`,
        sender: 'other',
      },
    ];

    setMessages(initialMessages);
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: inputText, sender: 'me' },
    ]);
    setInputText('');
  };
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={25}
        style={{ flex: 1 }}
      >
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

        <InputContainer>
          <StyledTextInput
            placeholder='Escribe un mensaje...'
            value={inputText}
            onChangeText={setInputText}
          />
          <IconButton icon='send' onPress={handleSend} />
        </InputContainer>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default Conversacion;
