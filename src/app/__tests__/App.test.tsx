/**
 * Тесты для главного компонента приложения.
 * Проверяет корректную инициализацию провайдеров и роутера.
 */
import { render, screen } from '@testing-library/react';
import { App } from '../App';

// Моки для зависимостей
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="browser-router">{children}</div>
  ),
}));

jest.mock('../providers/AppProviders', () => ({
  AppProviders: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-providers">{children}</div>
  ),
}));

jest.mock('../routing/AppRouter', () => ({
  AppRouter: () => <div data-testid="app-router">AppRouter</div>,
}));

describe('App', () => {
  it('should render AppProviders', () => {
    render(<App />);
    expect(screen.getByTestId('app-providers')).toBeInTheDocument();
  });

  it('should render BrowserRouter', () => {
    render(<App />);
    expect(screen.getByTestId('browser-router')).toBeInTheDocument();
  });

  it('should render AppRouter inside BrowserRouter', () => {
    render(<App />);
    expect(screen.getByTestId('app-router')).toBeInTheDocument();
  });

  it('should have correct component hierarchy', () => {
    render(<App />);
    const providers = screen.getByTestId('app-providers');
    const router = screen.getByTestId('browser-router');
    const appRouter = screen.getByTestId('app-router');

    expect(providers).toContainElement(router);
    expect(router).toContainElement(appRouter);
  });
});
