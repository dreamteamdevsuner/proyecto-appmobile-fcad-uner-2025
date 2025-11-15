import { getAllEmojis } from '@services/emoji/EmojiService';
import { useEffect, useRef, useState } from 'react';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { IconButton, Text } from 'react-native-paper';
import { EmojiHubItem } from '@models/index';
import { View } from 'react-native';

export const Emoji = ({ setInputText, showEmojiBar, setShowEmojiBar }: any) => {
  const [emojis, setEmojis] = useState<EmojiHubItem[]>([]);

  useEffect(() => {
    cargarEmojis();
  }, []);

  const cargarEmojis = async () => {
    const data = await getAllEmojis();
    setEmojis(data);
  };

  const decodeHtmlEntity = (htmlCode: string) => {
    const code = htmlCode.replace('&#', '').replace(';', '');
    return String.fromCodePoint(Number(code));
  };

  if (!showEmojiBar) return null;

  return (
    <>
      {showEmojiBar && (
        <View style={{ maxHeight: 180 }}>
          <FlatList
            data={emojis}
            keyExtractor={(_, index) => index.toString()}
            numColumns={8}
            renderItem={({ item }: { item: EmojiHubItem }) => {
              const emoji = decodeHtmlEntity(item.htmlCode[0]);
              return (
                <Text
                  style={{ fontSize: 30, margin: 4 }}
                  onPress={() => setInputText((prev: string) => prev + emoji)}
                >
                  {emoji}
                </Text>
              );
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 6 }}
          />
        </View>
      )}
    </>
  );
};
