import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Platform } from 'react-native';
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
import { Message } from '../../../../../types/models/Message';
import ROUTES from '../../navigator/routes';
import { getChatConMensajes } from '@services/ChatService';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

type Props = NativeStackScreenProps<
  PrivateStackParamList,
  ROUTES.RECRUITER_CONVERSACION
>;

const Conversacion: React.FC<Props> = ({ route }) => {
  const {
    title,
    myName,
    otherAvatarUrl,
    myAvatarUrl,
    idOfertaTrabajoMatch,
    idUsuarioProfesional,
  } = route.params;
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const getMessages = async () => {
    try {
      setLoading(true);
      const messagesData = await getChatConMensajes(
        idOfertaTrabajoMatch!,
        idUsuarioProfesional,
      );
      const messagesItem =
        messagesData?.mensajes.map((message) => ({
          id: message.id,
          text: message.texto,
          sender: message.idusuario,
        })) ?? [];
      setMessages(messagesItem);
      console.log('Mensajes fetched:', messagesData);
    } catch (error) {
      console.error('Error fetching mensajes:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getMessages();
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
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
    </KeyboardAvoidingView>
  );
};

export default Conversacion;
