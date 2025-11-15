import axios from 'axios';
import { BAD_WORDS_API_KEY } from '@env';

export async function detectBadWords(text: string) {
  const options = {
    method: 'GET',
    url: 'https://profanity-filter-by-api-ninjas.p.rapidapi.com/v1/profanityfilter',
    params: { text: text },
    headers: {
      'x-rapidapi-key': BAD_WORDS_API_KEY,
      'x-rapidapi-host': 'profanity-filter-by-api-ninjas.p.rapidapi.com',
    },
  };
  // Dejamos la respuesta original para testing - Cambiar en producción
  let respuesta: string = text;

  try {
    const response = await axios.request(options);
    if (response?.data?.censored) respuesta = response.data.censored;
  } catch (error) {
    console.error(error);
  } finally {
    return respuesta;
  }
}
