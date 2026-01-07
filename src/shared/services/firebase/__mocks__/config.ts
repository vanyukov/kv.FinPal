import { User } from 'firebase/auth';

/**
 * Мок для Firebase Auth.
 * Используется в тестах для симуляции аутентификации.
 */
export const mockAuth = {
  currentUser: null as User | null,
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  signInWithPopup: jest.fn(),
};

/**
 * Мок для Firebase App.
 */
export const mockFirebaseApp = {
  name: 'test-app',
  options: {},
};

/**
 * Мок для Firestore.
 */
export const mockFirestore = {
  collection: jest.fn(),
  doc: jest.fn(),
};

export const getFirebaseApp = jest.fn(() => mockFirebaseApp);
export const getFirestoreInstance = jest.fn(() => mockFirestore);
export const getAuthInstance = jest.fn(() => mockAuth);

