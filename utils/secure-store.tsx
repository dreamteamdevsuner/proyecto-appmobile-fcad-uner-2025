import * as SecureStore from 'expo-secure-store';
import { UserItem } from '../types';
import Reactotron from '../config/reactotron';
import { string } from 'yup';

const STORAGE_NAME = 'JOBSY_';

export enum SecureStoreItem {
  TOKEN = `${STORAGE_NAME}TOKEN`,
  USER = `${STORAGE_NAME}USER`,
  REFRESH_TOKEN = `${STORAGE_NAME}REFRESH_TOKEN`,
}

/**
 * Guarda un item en SecureStore
 * @param key key del item (debe ser SecureStoreItem)
 * @param item valor del item a guardar (cualquier objeto serializable a JSON)
 */
export async function setItemAsync<T>(
  key: SecureStoreItem,
  item: T,
): Promise<void> {
  try {
    Reactotron.log('setting item', item);
    Reactotron.log('setting item key', key);

    const valueToSave = typeof item === 'string' ? item : JSON.stringify(item);
    await SecureStore.setItemAsync(key, valueToSave);
  } catch (error) {
    console.error('Error al guardar en SS');
  }
}

/**
 * Obtiene un ítem de SecureStore y lo parsea al tipo especificado.
 * @param key Clave del ítem
 * @returns El ítem parseado o null si no existe
 */
export async function getItemAsync<T>(key: SecureStoreItem): Promise<T | null> {
  try {
    const jsonString = await SecureStore.getItemAsync(key);
    Reactotron.log('data', jsonString);
    if (jsonString === null) {
      return null;
    }
    if (key === SecureStoreItem.USER) {
      return JSON.parse(jsonString) as T;
    }

    return jsonString as T;
  } catch (error) {
    console.error('Error al leer de SS');
    return null;
  }
}

/**
 * Elimina un ítem de SecureStore.
 * @param key Clave del ítem
 */
export async function deleteItemAsync(key: SecureStoreItem): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error('Error al eliminar de SS');
  }
}

/**
 * Limpia todos los ítems relacionados con la autenticación.
 */
export async function clearAuthAsync(): Promise<void> {
  await Promise.allSettled([
    deleteItemAsync(SecureStoreItem.TOKEN),
    deleteItemAsync(SecureStoreItem.USER),
    deleteItemAsync(SecureStoreItem.REFRESH_TOKEN),
  ]);
}

/**
 * Obtiene el usuario actual, OJO: es medio redundante asi que capaz se elimine
 */
export async function getUser(): Promise<UserItem | null> {
  const user = await getItemAsync<UserItem>(SecureStoreItem.USER);
  if (user) {
    return user;
  }
  return null;
}
