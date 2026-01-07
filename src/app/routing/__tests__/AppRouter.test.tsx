/**
 * Тесты для роутера приложения.
 * Проверяет корректную настройку маршрутов.
 */
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRouter } from '../AppRouter';

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
  it('should render home route', () => {
    render(createTestRouter(['/']));

    expect(screen.getByText('FinPal - Главная страница')).toBeInTheDocument();
  });

  it('should render home route at root path', () => {
    render(createTestRouter(['/']));

    const homeContent = screen.getByText('FinPal - Главная страница');
    expect(homeContent).toBeInTheDocument();
  });

  it('should render Routes component', () => {
    const { container } = render(createTestRouter());

    // Routes рендерится как div или другой элемент
    expect(container.firstChild).toBeInTheDocument();
  });
});
