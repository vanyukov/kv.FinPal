import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getFirebaseConfig } from '@/app/config/env';

/**
 * Инициализация Firebase приложения.
 * Создает singleton экземпляр Firebase App.
 */
let firebaseApp: FirebaseApp | null = null;

/**
 * Получает или создает экземпляр Firebase App.
 * @returns Экземпляр Firebase App
 */
export const getFirebaseApp = (): FirebaseApp => {
  if (!firebaseApp) {
    const config = getFirebaseConfig();
    firebaseApp = initializeApp(config);
  }
  return firebaseApp;
};

/**
 * Получает экземпляр Firestore.
 * @returns Экземпляр Firestore
 */
export const getFirestoreInstance = (): Firestore => {
  const app = getFirebaseApp();
  return getFirestore(app);
};

/**
 * Получает экземпляр Firebase Auth.
 * @returns Экземпляр Firebase Auth
 */
export const getAuthInstance = (): Auth => {
  const app = getFirebaseApp();
  return getAuth(app);
};

