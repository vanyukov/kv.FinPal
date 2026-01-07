import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { useAuthStore } from '../../stores/authStore';

// Моки
jest.mock('../../stores/authStore');
jest.mock('@/shared/services/firebase/config', () => ({
  getAuthInstance: jest.fn(),
}));

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return auth state and methods', () => {
    const mockStore = {
      user: null,
      isLoading: false,
      error: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      logout: jest.fn(),
      initialize: jest.fn(),
      isInitialized: false,
    };

    mockUseAuthStore.mockReturnValue(mockStore as any);

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.signIn).toBeDefined();
    expect(result.current.signUp).toBeDefined();
    expect(result.current.signInWithGoogle).toBeDefined();
    expect(result.current.logout).toBeDefined();
  });

  it('should initialize auth store on mount if not initialized', () => {
    const mockInitialize = jest.fn();
    const mockStore = {
      user: null,
      isLoading: false,
      error: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      logout: jest.fn(),
      initialize: mockInitialize,
      isInitialized: false,
    };

    mockUseAuthStore.mockReturnValue(mockStore as any);

    renderHook(() => useAuth());

    expect(mockInitialize).toHaveBeenCalled();
  });

  it('should not initialize if already initialized', () => {
    const mockInitialize = jest.fn();
    const mockStore = {
      user: null,
      isLoading: false,
      error: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      logout: jest.fn(),
      initialize: mockInitialize,
      isInitialized: true,
    };

    mockUseAuthStore.mockReturnValue(mockStore as any);

    renderHook(() => useAuth());

    expect(mockInitialize).not.toHaveBeenCalled();
  });

  it('should return isAuthenticated as true when user exists', () => {
    const mockUser = { uid: '123', email: 'test@example.com' } as any;
    const mockStore = {
      user: mockUser,
      isLoading: false,
      error: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signInWithGoogle: jest.fn(),
      logout: jest.fn(),
      initialize: jest.fn(),
      isInitialized: true,
    };

    mockUseAuthStore.mockReturnValue(mockStore as any);

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBe(mockUser);
  });
});

