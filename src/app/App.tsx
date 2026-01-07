import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { AppRouter } from './routing/AppRouter';

/**
 * Главный компонент приложения.
 * Инициализирует провайдеры и роутинг.
 */
export const App = () => {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AppProviders>
  );
};

