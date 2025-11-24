import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FlatList, View } from 'react-native';
import { Avatar, Button, IconButton, Text } from 'react-native-paper';
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
import sanitizeText from '@utils/sanitize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

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
  const flatListRef = useRef<FlatList>(null);
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const [offset, setOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMasMensajes, setNoMasMensajes] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const getMessages = useCallback(async () => {
    if (!idOfertaTrabajoMatch || !usuarioLogueado?.id) return;

    try {
      setLoadingMore(true);
      const messagesData = await getChatConMensajes(
        idOfertaTrabajoMatch,
        usuarioLogueado.id,
        offset,
      );

      if (!messagesData) {
        setNoMasMensajes(true);
        return;
      }

      const messagesItem =
        messagesData?.mensajes?.map((message: any) => ({
          id: message.id,
          text: message.texto,
          sender: message.idusuario,
        })) ?? [];

      setChatID(messagesData?.idChat);

      if (messagesItem.length === 0) {
        setNoMasMensajes(true);
        return;
      }

      setMessages((prev) => {
        const existingIds = new Set(prev.map((msg) => msg.id));
        const newMessages = messagesItem.filter(
          (msg: any) => !existingIds.has(msg.id),
        );

        if (isInitialLoad) {
          setIsInitialLoad(false);

          return newMessages.reverse();
        } else {
          return [...newMessages, ...prev];
        }
      });
    } catch (error) {
      console.error('Error fetching mensajes:', error);
      setNoMasMensajes(true);
    } finally {
      setLoadingMore(false);
    }
  }, [idOfertaTrabajoMatch, usuarioLogueado?.id, offset, isInitialLoad]);

  const loadMore = useCallback(async () => {
    if (loadingMore || noMasMensajes) return;

    await getMessages();
    setOffset((prev) => prev + 5);
  }, [loadingMore, noMasMensajes, getMessages]);

  useEffect(() => {
    setMessages([]);
    setOffset(0);
    setNoMasMensajes(false);
    setIsInitialLoad(true);
  }, [idOfertaTrabajoMatch, usuarioLogueado?.id]);

  useEffect(() => {
    if (isInitialLoad) {
      loadMore();
    }
  }, [isInitialLoad, loadMore]);

  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || !chatID || !usuarioLogueado) return;

    try {
      const limpioHTML: string = sanitizeText(trimmed);
      const textoSeguro: string = await detectBadWords(limpioHTML);

      await enviarMensaje({
        idChat: chatID,
        idUsuario: usuarioLogueado.id,
        texto: textoSeguro,
      });

      setInputText('');

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  };

  const handleNewMessage = useCallback((newMessage: Message) => {
    setMessages((prev) => {
      const messageExists = prev.some((msg) => msg.id === newMessage.id);
      if (messageExists) {
        return prev;
      }

      return [...prev, newMessage];
    });

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  useEffect(() => {
    if (!chatID || !usuarioLogueado) return;

    const channel = subscribeToChat(
      chatID,
      usuarioLogueado.id,
      handleNewMessage,
    );

    return () => {
      unsubscribeFromChat(channel);
    };
  }, [chatID, usuarioLogueado, handleNewMessage]);

  useEffect(() => {
    if (messages.length > 0 && isInitialLoad) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages.length, isInitialLoad]);

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

  return (
    <Container>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        inverted={false}
        contentContainerStyle={{
          padding: 10,
          flexGrow: 1,
        }}
        style={{ flex: 1 }}
        ListHeaderComponent={
          !noMasMensajes ? (
            <View style={{ padding: 10, alignItems: 'center' }}>
              <Button onPress={loadMore} disabled={loadingMore} mode="outlined">
                {loadingMore ? 'Cargando...' : 'Cargar mensajes más antiguos'}
              </Button>
            </View>
          ) : messages.length > 0 ? (
            <View style={{ padding: 10, alignItems: 'center' }}>
              <Text style={{ color: 'gray' }}>
                No hay mensajes más antiguos
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loadingMore ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
              }}
            >
              <Text>No hay mensajes aún</Text>
            </View>
          ) : null
        }
        onContentSizeChange={() => {
          if (!loadingMore && isInitialLoad) {
            flatListRef.current?.scrollToEnd({ animated: false });
          }
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
          onSubmitEditing={handleSend}
          multiline
        />

        <IconButton
          icon="send"
          onPress={handleSend}
          disabled={!inputText.trim()}
        />
      </InputContainer>

      <Emoji
        setInputText={setInputText}
        showEmojiBar={showEmojiBar}
        setShowEmojiBar={setShowEmojiBar}
      />
    </Container>
  );
};

export default Conversacion;
