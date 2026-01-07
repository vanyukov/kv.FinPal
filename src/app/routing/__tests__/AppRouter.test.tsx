/**
 * Тесты для роутера приложения.
 * Проверяет корректную настройку маршрутов.
 */
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRouter } from '../AppRouter';
import { ROUTES } from '../routes.config';

// Моки для зависимостей
jest.mock('@/features/auth/pages/LoginPage', () => ({
  LoginPage: () => <div data-testid="login-page">LoginPage</div>,
}));

jest.mock('@/features/auth/pages/HomePage', () => ({
  HomePage: () => <div data-testid="home-page">HomePage</div>,
}));

/**
 * Конфигурация MemoryRouter для тестов с future flags React Router v7.
 * Убирает предупреждения о будущих изменениях.
 */
const createTestRouter = (initialEntries: string[] = ['/']) => (
  <MemoryRouter
    initialEntries={initialEntries}
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <AppRouter />
  </MemoryRouter>
);

describe('AppRouter', () => {
  it('should render login route', () => {
    render(createTestRouter([ROUTES.LOGIN]));

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('should render home page route', () => {
    render(createTestRouter([ROUTES.HOME]));

    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('should render Routes component', () => {
    const { container } = render(createTestRouter());

    // Routes рендерится как div или другой элемент
    expect(container.firstChild).toBeInTheDocument();
  });
});
