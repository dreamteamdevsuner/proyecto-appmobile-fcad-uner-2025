import axios from 'axios';

export type EmojiHubItem = {
  name: string;
  category: string;
  group: string;
  htmlCode: string[];
  unicode: string[];
};

const API_URL = 'https://emojihub.yurace.pro/api/all';

export const getAllEmojis = async (): Promise<EmojiHubItem[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data as EmojiHubItem[];
  } catch (error) {
    console.error('Error cargando emojis:', error);
    return [];
  }
};
