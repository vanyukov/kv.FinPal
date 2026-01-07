import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  enableIndexedDbPersistence,
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getFirebaseConfig, type FirebaseConfig } from '@/app/config/env';

/**
 * Инициализация Firebase приложения.
 * Создает singleton экземпляр Firebase App.
 */
let firebaseApp: FirebaseApp | null = null;

/**
 * Singleton экземпляр Firestore.
 */
let firestoreInstance: Firestore | null = null;

/**
 * Флаг для отслеживания инициализации оффлайн-персистентности.
 */
let persistenceEnabled = false;

/**
 * Промис для отслеживания процесса включения персистентности.
 */
let persistencePromise: Promise<void> | null = null;

/**
 * Проверяет, что конфигурация Firebase валидна.
 * @param config - Конфигурация Firebase
 * @throws {Error} Если конфигурация невалидна
 */
const validateFirebaseConfig = (config: FirebaseConfig): void => {
  const requiredFields: (keyof FirebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  const missingFields = requiredFields.filter((field) => !config[field]);

  if (missingFields.length > 0) {
    throw new Error(
      `Firebase configuration is missing required fields: ${missingFields.join(', ')}. Please check your .env file.`
    );
  }
};

/**
 * Получает или создает экземпляр Firebase App.
 * @returns Экземпляр Firebase App
 * @throws {Error} Если конфигурация Firebase невалидна
 */
export const getFirebaseApp = (): FirebaseApp => {
  if (!firebaseApp) {
    const config = getFirebaseConfig();
    validateFirebaseConfig(config);
    firebaseApp = initializeApp(config);
  }
  return firebaseApp;
};

/**
 * Инициализирует оффлайн-персистентность для Firestore.
 * Должна быть вызвана до первого использования Firestore.
 * @param db - Экземпляр Firestore
 * @returns Промис, который разрешается когда персистентность включена или отклоняется при ошибке
 */
const initializePersistence = (db: Firestore): Promise<void> => {
  if (persistencePromise) {
    return persistencePromise;
  }

  if (persistenceEnabled) {
    return Promise.resolve();
  }

  if (typeof window === 'undefined') {
    // SSR окружение - персистентность недоступна
    return Promise.resolve();
  }

  persistencePromise = enableIndexedDbPersistence(db)
    .then(() => {
      persistenceEnabled = true;
      console.log('Firestore offline persistence enabled');
    })
    .catch((error) => {
      // Обрабатываем ошибки (например, если уже включена в другой вкладке)
      if (error.code === 'failed-precondition') {
        console.warn(
          'Firestore offline persistence failed: Multiple tabs open, persistence can only be enabled in one tab at a time.'
        );
        // В этом случае персистентность уже включена в другой вкладке, считаем успешным
        persistenceEnabled = true;
      } else if (error.code === 'unimplemented') {
        console.warn(
          'Firestore offline persistence failed: The current browser does not support all of the features required.'
        );
      } else {
        console.error('Firestore offline persistence error:', error);
      }
      // В любом случае разрешаем промис, чтобы не блокировать приложение
      persistenceEnabled = true;
    });

  return persistencePromise;
};

/**
 * Получает экземпляр Firestore с настройкой оффлайн-персистентности.
 * Включает IndexedDB для локального кеширования данных при оффлайн-работе.
 * Использует singleton паттерн для гарантии единого экземпляра.
 * @returns Экземпляр Firestore
 */
export const getFirestoreInstance = (): Firestore => {
  // Если экземпляр уже создан, возвращаем его
  if (firestoreInstance) {
    return firestoreInstance;
  }

  const app = getFirebaseApp();
  const db = getFirestore(app);

  // Сохраняем экземпляр как singleton
  firestoreInstance = db;

  // Инициализируем персистентность ДО любых операций с Firestore
  // Это критически важно - персистентность должна быть включена до первого использования
  if (!persistenceEnabled && !persistencePromise && typeof window !== 'undefined') {
    initializePersistence(db);
  }

  return db;
};

/**
 * Получает экземпляр Firebase Auth.
 * @returns Экземпляр Firebase Auth
 */
export const getAuthInstance = (): Auth => {
  const app = getFirebaseApp();
  return getAuth(app);
};

