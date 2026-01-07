import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

/**
 * Хук для работы с аутентификацией.
 * Предоставляет удобный интерфейс для доступа к состоянию и методам аутентификации.
 * Автоматически инициализирует отслеживание состояния аутентификации при первом использовании.
 * @returns Объект с состоянием и методами аутентификации
 */
export const useAuth = () => {
  const {
    user,
    isLoading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    initialize,
    isInitialized,
  } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
  };
};

