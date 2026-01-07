import { getFirebaseApp, getFirestoreInstance, getAuthInstance } from '../config';
import { getFirebaseConfig } from '@/app/config/env';

// Мокируем Firebase модули
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({ mockApp: true })),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({ mockFirestore: true })),
  enableIndexedDbPersistence: jest.fn(() => Promise.resolve()),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({ mockAuth: true })),
}));

jest.mock('@/app/config/env', () => ({
  getFirebaseConfig: jest.fn(() => ({
    apiKey: 'test-api-key',
    authDomain: 'test.firebaseapp.com',
    projectId: 'test-project',
    storageBucket: 'test.appspot.com',
    messagingSenderId: '123456789',
    appId: 'test-app-id',
  })),
}));

describe('Firebase Config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Сбрасываем модуль для очистки singleton
    jest.resetModules();
  });

  describe('getFirebaseApp', () => {
    it('should initialize Firebase app with config', () => {
      const { initializeApp } = require('firebase/app');
      const app = getFirebaseApp();

      expect(getFirebaseConfig).toHaveBeenCalled();
      expect(initializeApp).toHaveBeenCalledWith({
        apiKey: 'test-api-key',
        authDomain: 'test.firebaseapp.com',
        projectId: 'test-project',
        storageBucket: 'test.appspot.com',
        messagingSenderId: '123456789',
        appId: 'test-app-id',
      });
      expect(app).toBeDefined();
    });

    it('should return the same app instance on multiple calls', () => {
      const app1 = getFirebaseApp();
      const app2 = getFirebaseApp();

      expect(app1).toBe(app2);
    });
  });

  describe('getFirestoreInstance', () => {
    it('should return Firestore instance', () => {
      const { getFirestore } = require('firebase/firestore');
      const db = getFirestoreInstance();

      expect(getFirestore).toHaveBeenCalled();
      expect(db).toBeDefined();
    });

    it('should attempt to enable offline persistence in browser environment', () => {
      // Мокируем window для симуляции браузерного окружения
      Object.defineProperty(window, 'window', {
        value: {},
        writable: true,
      });

      const { enableIndexedDbPersistence } = require('firebase/firestore');
      getFirestoreInstance();

      // Проверяем, что enableIndexedDbPersistence был вызван
      // (в реальном окружении это будет асинхронно)
      expect(enableIndexedDbPersistence).toHaveBeenCalled();
    });
  });

  describe('getAuthInstance', () => {
    it('should return Auth instance', () => {
      const { getAuth } = require('firebase/auth');
      const auth = getAuthInstance();

      expect(getAuth).toHaveBeenCalled();
      expect(auth).toBeDefined();
    });
  });
});

