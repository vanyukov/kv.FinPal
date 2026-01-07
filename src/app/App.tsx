import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { AppRouter } from './routing/AppRouter';
import { ErrorBoundary } from './components/ErrorBoundary';

/**
 * Главный компонент приложения.
 * Инициализирует провайдеры и роутинг.
 * Оборачивает приложение в ErrorBoundary для обработки ошибок.
 */
export const App = () => {
  return (
    <ErrorBoundary>
      <AppProviders>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AppProviders>
    </ErrorBoundary>
  );
};

