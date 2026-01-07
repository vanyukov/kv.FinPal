import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { useAuthStore } from '../authStore';
import { getAuthInstance } from '@/shared/services/firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { User } from 'firebase/auth';

// Моки для Firebase
jest.mock('@/shared/services/firebase/config');
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({})),
}));

const mockAuth = {
  currentUser: null as User | null,
};

describe('authStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAuthInstance as jest.Mock).mockReturnValue(mockAuth);
    // Сбрасываем store
    useAuthStore.setState({
      user: null,
      isLoading: false,
      error: null,
      isInitialized: false,
    });
  });

  describe('initialization', () => {
    it('should initialize auth state listener', () => {
      const unsubscribe = jest.fn();
      (onAuthStateChanged as jest.Mock).mockReturnValue(unsubscribe);
      (getAuthInstance as jest.Mock).mockReturnValue(mockAuth);

      useAuthStore.getState().initialize();

      expect(onAuthStateChanged).toHaveBeenCalled();
      expect(useAuthStore.getState().isInitialized).toBe(true);
    });

    it('should not initialize twice', () => {
      const unsubscribe = jest.fn();
      (onAuthStateChanged as jest.Mock).mockReturnValue(unsubscribe);
      (getAuthInstance as jest.Mock).mockReturnValue(mockAuth);

      useAuthStore.getState().initialize();
      useAuthStore.getState().initialize();

      expect(onAuthStateChanged).toHaveBeenCalledTimes(1);
    });
  });

  describe('signIn', () => {
    it('should sign in user successfully', async () => {
      const mockUser = { uid: '123', email: 'test@example.com' } as User;
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUser,
      } as any);

      // Инициализируем store
      const unsubscribe = jest.fn();
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(mockUser);
        return unsubscribe;
      });
      (getAuthInstance as jest.Mock).mockReturnValue(mockAuth);
      useAuthStore.getState().initialize();

      await useAuthStore.getState().signIn('test@example.com', 'password123');

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        'test@example.com',
        'password123'
      );
    });

    it('should handle sign in error', async () => {
      const error = new Error('Invalid credentials');
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(error);
      (getAuthInstance as jest.Mock).mockReturnValue(mockAuth);

      await expect(
        useAuthStore.getState().signIn('test@example.com', 'wrong')
      ).rejects.toThrow();

      expect(useAuthStore.getState().error).toBeTruthy();
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('signUp', () => {
    it('should sign up user successfully', async () => {
      const mockUser = { uid: '123', email: 'test@example.com' } as User;
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUser,
      } as any);

      const unsubscribe = jest.fn();
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(mockUser);
        return unsubscribe;
      });
      (getAuthInstance as jest.Mock).mockReturnValue(mockAuth);
      useAuthStore.getState().initialize();

      await useAuthStore.getState().signUp('test@example.com', 'password123');

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        'test@example.com',
        'password123'
      );
    });

    it('should handle sign up error', async () => {
      const error = new Error('Email already in use');
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(error);
      (getAuthInstance as jest.Mock).mockReturnValue(mockAuth);

      await expect(
        useAuthStore.getState().signUp('test@example.com', 'password123')
      ).rejects.toThrow();

      expect(useAuthStore.getState().error).toBeTruthy();
    });
  });

  describe('signInWithGoogle', () => {
    it('should sign in with Google successfully', async () => {
      const mockUser = { uid: '123', email: 'test@example.com' } as User;
      (signInWithPopup as jest.Mock).mockResolvedValue({
        user: mockUser,
      } as any);

      const unsubscribe = jest.fn();
      (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback(mockUser);
        return unsubscribe;
      });
      (getAuthInstance as jest.Mock).mockReturnValue(mockAuth);
      useAuthStore.getState().initialize();

      await useAuthStore.getState().signInWithGoogle();

      expect(signInWithPopup).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      (signOut as jest.Mock).mockResolvedValue(undefined);
      (getAuthInstance as jest.Mock).mockReturnValue(mockAuth);

      await useAuthStore.getState().logout();

      expect(signOut).toHaveBeenCalledWith(mockAuth);
      expect(useAuthStore.getState().user).toBeNull();
    });

    it('should handle logout error', async () => {
      const error = new Error('Logout failed');
      (signOut as jest.Mock).mockRejectedValue(error);
      (getAuthInstance as jest.Mock).mockReturnValue(mockAuth);

      await expect(useAuthStore.getState().logout()).rejects.toThrow();

      expect(useAuthStore.getState().error).toBeTruthy();
    });
  });

  describe('setUser', () => {
    it('should set user and update loading state', () => {
      const mockUser = { uid: '123' } as User;

      useAuthStore.getState().setUser(mockUser);

      expect(useAuthStore.getState().user).toBe(mockUser);
      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it('should clear user when set to null', () => {
      const mockUser = { uid: '123' } as User;
      useAuthStore.getState().setUser(mockUser);
      expect(useAuthStore.getState().user).toBe(mockUser);

      useAuthStore.getState().setUser(null);

      expect(useAuthStore.getState().user).toBeNull();
    });
  });
});

