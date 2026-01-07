/**
 * Мок для модуля env.ts для тестирования.
 * Используется для обхода проблем с import.meta в Jest.
 */
export type Environment = 'development' | 'staging' | 'production';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export const getCurrentEnvironment = (): Environment => {
  if (typeof window === 'undefined') {
    return 'development';
  }

  const hostname = window.location.hostname;

  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return 'development';
  }

  if (hostname.includes('staging') || hostname.includes('preview')) {
    return 'staging';
  }

  return 'production';
};

export const getFirebaseConfig = (): FirebaseConfig => {
  // В тестах используем пустые значения
  return {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: undefined,
  };
};

export const isDevelopment = () => getCurrentEnvironment() === 'development';
export const isStaging = () => getCurrentEnvironment() === 'staging';
export const isProduction = () => getCurrentEnvironment() === 'production';
