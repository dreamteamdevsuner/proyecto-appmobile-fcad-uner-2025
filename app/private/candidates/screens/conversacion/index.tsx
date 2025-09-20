import React, { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { Avatar, IconButton } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Container,
  MessageRow,
  Bubble,
  MessageText,
  InputContainer,
  StyledTextInput,
} from './styles';
import { PrivateStackParamList } from '../../navigator/types';
import { Message } from '../../../../../types/Message';
import ROUTES from '../../navigator/routes';

type Props = NativeStackScreenProps<
  PrivateStackParamList,
  ROUTES.CANDIDATE_CONVERSACION
>;

const Conversacion: React.FC<Props> = ({ route }) => {
  const {
    title = 'Renata',
    myName = 'Profesional',
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
        text: `Hola, ${myName}. Tu perfil es interesante para nuestra propuesta, ¿podrías enviarme tu CV a esta dirección? ${title}@correo.com Gracias.`,
        sender: 'other',
      },
      {
        id: '2',
        text: `¡Hola, ${title}!`,
        sender: 'me',
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
            ellipsizeMode="clip"
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
          placeholder="Escribe un mensaje..."
          value={inputText}
          onChangeText={setInputText}
        />
        <IconButton icon="send" onPress={handleSend} />
      </InputContainer>
    </Container>
  );
};

export default Conversacion;
