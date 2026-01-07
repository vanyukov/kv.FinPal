import { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Провайдер для всех глобальных контекстов приложения.
 * Включает тему Material-UI и другие провайдеры.
 * @param children - Дочерние компоненты
 */
export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

