// Event emitter simple para notificar cambios en los posts
type PostEventListener = (userId: string | number) => void;

class PostEventEmitter {
  private listeners: Set<PostEventListener> = new Set();

  subscribe(listener: PostEventListener): () => void {
    this.listeners.add(listener);
    // Retornar función para desuscribirse
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(userId: string | number) {
    this.listeners.forEach((listener) => {
      try {
        listener(userId);
      } catch (error) {
        console.error('Error en listener de posts:', error);
      }
    });
  }
}

export const postEventEmitter = new PostEventEmitter();
