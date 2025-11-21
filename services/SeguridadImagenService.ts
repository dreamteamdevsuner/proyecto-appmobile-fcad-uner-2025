import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY_DE_CLOUDMERSIVE;
const API_URL = 'https://api.cloudmersive.com/image/nsfw/classify';


// INTERRUPTOR
// true  = Gasta créditos (Modo Producción) CAMBIAR EN LA PRESENTACION
// false = No gasta créditos (Modo Pruebas/Desarrollo)
const MODERACION_ACTIVA = false;

export const verificarImagenSegura = async (imageUri: string) => {

  console.log("--- DEBUG CLOUDMERSIVE ---");
  console.log("Intentando conectar a:", API_URL);
  console.log("Mi API Key es:", API_KEY); // ¿Sale la clave o sale undefined?
  console.log("URI de imagen:", imageUri);

  if (!MODERACION_ACTIVA) {
    console.log('⚠️ MODERACIÓN DESACTIVADA: Aprobando imagen sin verificar para ahorrar créditos.')
    return true;
  }

  try {
    const formData = new FormData();

    const filename = imageUri.split('/').pop();
    const match = filename ? /\.(\w+)$/.exec(filename) : null;
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    const imageFile = {
      uri: imageUri,
      name: filename,
      type: type,
    } as unknown as Blob;

    formData.append('imageFile', imageFile, filename);

    const response = await axios.post(API_URL, formData, {
      headers: {
        'Apikey': API_KEY,
        'Content-Type': 'multipart/form-data',
      },
    });

    const puntaje = response.data.Score;
    console.log(`Puntaje de desnudez (NSFW): ${puntaje}`);

    if (puntaje > 0.5) {
      return false; // Imagen no segura
    }
    return true; // Imagen segura
  } catch (error) {
    console.error('Error en el filtro de imagen:', error);
    return true;
  }
};