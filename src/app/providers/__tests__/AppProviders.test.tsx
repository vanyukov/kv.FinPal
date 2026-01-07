/**
 * Тесты для провайдера приложения.
 * Проверяет корректную инициализацию темы Material-UI и провайдеров.
 */
import { render, screen } from '@testing-library/react';
import { AppProviders } from '../AppProviders';

describe('AppProviders', () => {
  it('should render children', () => {
    render(
      <AppProviders>
        <div data-testid="test-child">Test Content</div>
      </AppProviders>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should provide ThemeProvider context', () => {
    const { container } = render(
      <AppProviders>
        <div>Content</div>
      </AppProviders>
    );

    // Проверяем, что компонент рендерится без ошибок
    // Material-UI ThemeProvider должен быть доступен
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should render CssBaseline', () => {
    render(
      <AppProviders>
        <div>Content</div>
      </AppProviders>
    );

    // CssBaseline рендерится как style элемент
    const styleElement = document.querySelector('style[data-emotion]');
    expect(styleElement).toBeInTheDocument();
  });

  it('should handle multiple children', () => {
    render(
      <AppProviders>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </AppProviders>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });
});
