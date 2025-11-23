import axios from 'axios';
import { BAD_WORDS_API_KEY } from '@env';

export async function detectBadWords(text: string) {
  const options = {
    method: 'GET',
    url: 'https://community-purgomalum.p.rapidapi.com/json',
    params: { text: text },
    headers: {
      'x-rapidapi-key': BAD_WORDS_API_KEY,
      'x-rapidapi-host': 'community-purgomalum.p.rapidapi.com',
    },
  };
  // Dejamos la respuesta original para testing - Cambiar en producción
  let respuesta: string = text;

  try {
    const response = await axios.request(options);
    if (response?.data?.result) respuesta = response.data.result;
  } catch (error) {
    console.error(error);
  } finally {
    return respuesta;
  }
}
