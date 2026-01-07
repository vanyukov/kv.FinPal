import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { LoginPage } from '../LoginPage';
import { LoginForm } from '../../components/LoginForm';

// Моки
jest.mock('../../components/LoginForm', () => ({
  LoginForm: () => <div data-testid="login-form">LoginForm</div>,
}));

describe('LoginPage', () => {
  it('should render login page with form', () => {
    render(<LoginPage />);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('should have correct layout structure', () => {
    const { container } = render(<LoginPage />);

    // Проверяем наличие Container и Box
    const containerElement = container.querySelector('.MuiContainer-root');
    expect(containerElement).toBeInTheDocument();
  });
});

