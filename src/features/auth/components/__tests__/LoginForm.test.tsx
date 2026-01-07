import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';
import { useAuth } from '../../hooks/useAuth';

// Моки
jest.mock('../../hooks/useAuth');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('LoginForm', () => {
  const mockSignIn = jest.fn();
  const mockSignInWithGoogle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      signIn: mockSignIn,
      signUp: jest.fn(),
      signInWithGoogle: mockSignInWithGoogle,
      logout: jest.fn(),
    });
  });

  it('should render login form', () => {
    render(<LoginForm />);

    expect(screen.getByText('Вход')).toBeInTheDocument();
    expect(screen.getByLabelText('Email адрес')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByLabelText('Войти')).toBeInTheDocument();
    expect(screen.getByLabelText('Войти через Google')).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email адрес');
    const passwordInput = screen.getByLabelText('Пароль');
    const submitButton = screen.getByLabelText('Войти');

    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Некорректный email адрес/i)).toBeInTheDocument();
    });

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('should validate password length', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email адрес');
    const passwordInput = screen.getByLabelText('Пароль');
    const submitButton = screen.getByLabelText('Войти');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, '12345');
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Пароль должен содержать минимум 6 символов/i)
      ).toBeInTheDocument();
    });

    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue(undefined);
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email адрес');
    const passwordInput = screen.getByLabelText('Пароль');
    const submitButton = screen.getByLabelText('Войти');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
    });
  });

  it('should display error from store', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      error: 'Invalid credentials',
      isAuthenticated: false,
      signIn: mockSignIn,
      signUp: jest.fn(),
      signInWithGoogle: mockSignInWithGoogle,
      logout: jest.fn(),
    });

    render(<LoginForm />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('should handle Google sign in', async () => {
    const user = userEvent.setup();
    mockSignInWithGoogle.mockResolvedValue(undefined);
    render(<LoginForm />);

    const googleButton = screen.getByLabelText('Войти через Google');
    await user.click(googleButton);

    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled();
    });
  });

  it('should disable form during loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      error: null,
      isAuthenticated: false,
      signIn: mockSignIn,
      signUp: jest.fn(),
      signInWithGoogle: mockSignInWithGoogle,
      logout: jest.fn(),
    });

    render(<LoginForm />);

    expect(screen.getByLabelText('Email адрес')).toBeDisabled();
    expect(screen.getByLabelText('Пароль')).toBeDisabled();
    expect(screen.getByLabelText('Войти')).toBeDisabled();
  });
});

