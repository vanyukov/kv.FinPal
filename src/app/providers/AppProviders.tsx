import { ReactNode, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { getFirestoreInstance } from '@/shared/services/firebase/config';
import { useAuthStore } from '@/features/auth/stores/authStore';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Компонент для инициализации сервисов при старте приложения.
 * Инициализирует Firestore и аутентификацию.
 */
const AppInitializer = () => {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    // Инициализируем Firestore при старте приложения
    // Это гарантирует, что оффлайн-персистентность включится сразу
    getFirestoreInstance();

    // Инициализируем аутентификацию при старте приложения
    // Это гарантирует, что состояние аутентификации будет проверено сразу
    if (!isInitialized) {
      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);

  return null;
};

/**
 * Провайдер для всех глобальных контекстов приложения.
 * Включает тему Material-UI и другие провайдеры.
 * Инициализирует Firestore и аутентификацию при старте приложения.
 * @param children - Дочерние компоненты
 */
export const AppProviders = ({ children }: AppProvidersProps) => {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppInitializer />
      {children}
    </ThemeProvider>
  );
};

