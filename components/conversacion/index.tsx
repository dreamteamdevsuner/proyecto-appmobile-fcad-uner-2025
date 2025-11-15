import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Platform } from 'react-native';
import { Avatar, IconButton, Text } from 'react-native-paper';

import { TextInput } from 'react-native';

import {
  Container,
  MessageRow,
  Bubble,
  MessageText,
  InputContainer,
  StyledTextInput,
} from './styles';

import { Message } from '@models/Message';
import {
  getChatConMensajes,
  enviarMensaje,
  subscribeToChat,
  unsubscribeFromChat,
} from '@services/ChatService';

import { IUser } from '@services/interfaces/User.interface';
import { detectBadWords } from '@services/BadWordsAPI';
import { Emoji } from '@components/emojis/Emoji';

type ConversacionProps = {
  title: string;
  myName: string;
  otherAvatarUrl: string | undefined;
  myAvatarUrl: string | undefined;
  idOfertaTrabajoMatch: string | undefined;
  idUsuarioProfesional?: string | undefined;
  usuarioLogueado: IUser | null;
};

const Conversacion: React.FC<ConversacionProps> = ({
  title,
  myName,
  otherAvatarUrl,
  myAvatarUrl,
  idOfertaTrabajoMatch,
  usuarioLogueado,
}) => {
  const [inputText, setInputText] = useState('');
  const [chatID, setChatID] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const getMessages = async () => {
    try {
      setLoading(true);
      const messagesData = await getChatConMensajes(
        idOfertaTrabajoMatch!,
        usuarioLogueado?.id!,
      );
      const messagesItem =
        messagesData?.mensajes.map((message) => ({
          id: message.id,
          text: message.texto,
          sender: message.idusuario,
        })) ?? [];
      setMessages(messagesItem);
      setChatID(messagesData?.idChat);
    } catch (error) {
      console.error('Error fetching mensajes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    try {
      if (usuarioLogueado) {
        const textoSeguro = await detectBadWords(inputText.trim());

        const nuevoMensaje = await enviarMensaje({
          idChat: chatID,
          idUsuario: usuarioLogueado?.id,
          texto: textoSeguro,
        });
        console.log('Mensaje', nuevoMensaje);
        setMessages((prev) => [
          ...prev,
          {
            id: nuevoMensaje.id,
            text: nuevoMensaje.texto,
            sender: nuevoMensaje.idusuario,
          },
        ]);

        setInputText('');
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  };
  function checkIsSingleEmoji(text: string): boolean {
    if (!text) return false;
    const trimmed = text.trim();

    try {
      if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
        const segmenter = new (Intl as any).Segmenter('en', {
          granularity: 'grapheme',
        });

        const graphemes = [...segmenter.segment(trimmed)];
        return graphemes.length === 1 && isEmoji(graphemes[0].segment);
      }
    } catch {}

    return isSingleEmojiFallback(trimmed);
  }

  function isEmoji(str: string): boolean {
    return /\p{Emoji}/u.test(str);
  }

  function isSingleEmojiFallback(text: string): boolean {
    const emojiRegex =
      /^(\p{Emoji}|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}|[\u{1F1E6}-\u{1F1FF}]{2})$/u;

    return emojiRegex.test(text);
  }

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.sender === usuarioLogueado?.id;
    const isSingleEmoji: boolean = checkIsSingleEmoji(item.text);

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
            singleEmoji={isSingleEmoji}
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

  useEffect(() => {
    if (!chatID || !usuarioLogueado) return;

    const channel = subscribeToChat(
      chatID,
      usuarioLogueado.id,
      (newMessage) => {
        console.log('new mensajes', newMessage);
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
      },
    );

    return () => {
      unsubscribeFromChat(channel);
    };
  }, [chatID]);

  return (
    <Container>
      {loading ? (
        <Text>Cargando mensajes...</Text>
      ) : (
        <>
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
            <IconButton
              icon={showEmojiBar ? 'keyboard-outline' : 'emoticon-outline'}
              onPress={() => {
                setShowEmojiBar((prev) => {
                  if (prev) {
                    setTimeout(() => inputRef.current?.focus(), 50);
                  }
                  return !prev;
                });
              }}
            />

            <StyledTextInput
              ref={inputRef}
              placeholder="Escribe un mensaje..."
              value={inputText}
              onChangeText={setInputText}
              onFocus={() => setShowEmojiBar(false)}
            />

            <IconButton icon="send" onPress={handleSend} />
          </InputContainer>
          <Emoji
            setInputText={setInputText}
            showEmojiBar={showEmojiBar}
            setShowEmojiBar={setShowEmojiBar}
          />
        </>
      )}
    </Container>
  );
};

export default Conversacion;
