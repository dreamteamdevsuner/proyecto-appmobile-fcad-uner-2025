import { supabase } from '../supabase/supabaseClient';

export interface UploadCallbacks {
  onProgress?: (progress: number) => void;
  onSuccess?: (downloadUrl: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Sube una imagen al almacenamiento de Supabase y devuelve su url pública.
 * @param base64 imagen en formato base64
 * @param bucket nombre del bucket en Supabase (por defecto 'fotoPerfil')
 * @param userId id del usuario (opcional)
 * @param callbacks callbacks para progress, success y error
 * @returns url pública de la imagen o null si hay error
 */
export const uploadImage = async (
  base64: string,
  bucket: string = 'fotoPerfil',
  userId?: string | number,
  callbacks?: UploadCallbacks,
): Promise<string | null> => {
  try {
    const userIdString = userId ? String(userId) : undefined;

    const rawBinary = atob(base64);
    const arrayBuffer = new Uint8Array(rawBinary.length);
    for (let i = 0; i < rawBinary.length; i++) {
      arrayBuffer[i] = rawBinary.charCodeAt(i);
    }

    const baseFolder = userIdString ? `${userIdString}` : 'general';
    const fileName = `${baseFolder}/${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}.jpg`;

    console.log('Subiendo imagen a bucket:', bucket, 'archivo:', fileName);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.error('Error al subir la imagen: ', error);
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    if (!urlData.publicUrl) {
      throw new Error('No se pudo obtener la URL pública de la imagen.');
    }

    console.log('Imagen subida, URL pública: ', urlData.publicUrl);
    callbacks?.onSuccess?.(urlData.publicUrl);
    return urlData.publicUrl;
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Error desconocido';
    console.error('Error en el servicio de subida de imagen: ', errorMessage);
    callbacks?.onError?.(new Error(errorMessage));
    return null;
  }
};

/**
 * Realiza borrado lógico de una imagen (archivo) marcándola como inactiva
 * @param imageId id del archivo a marcar como inactivo
 * @returns true si se eliminó correctamente, false si hubo error
 */
export const deleteImage = async (imageId: string): Promise<boolean> => {
  try {
    if (!imageId) {
      throw new Error('ID de imagen inválido');
    }

    // Marcar archivo como inactivo
    const { error: updateError } = await supabase
      .from('archivo')
      .update({ activo: false })
      .eq('id', imageId);

    if (updateError) {
      throw new Error(`Error al eliminar imagen: ${updateError.message}`);
    }

    console.log('Imagen marcada como inactiva:', imageId);
    return true;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error en deleteImage:', errorMessage);
    return false;
  }
};
