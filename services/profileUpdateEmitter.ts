// Event emitter simple para notificar actualizaciones de perfil
type ProfileUpdateListener = (userId: string) => void;

class ProfileUpdateEmitter {
  private listeners: Set<ProfileUpdateListener> = new Set();

  subscribe(listener: ProfileUpdateListener): () => void {
    this.listeners.add(listener);
    // Retornar función para desuscribirse
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(userId: string) {
    this.listeners.forEach((listener) => {
      try {
        listener(userId);
      } catch (error) {
        console.error('Error en listener de actualización de perfil:', error);
      }
    });
  }
}

export const profileUpdateEmitter = new ProfileUpdateEmitter();
