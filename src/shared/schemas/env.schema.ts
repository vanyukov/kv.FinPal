import { z } from 'zod';

/**
 * Схема валидации конфигурации Firebase.
 * Используется для проверки корректности переменных окружения при инициализации приложения.
 */
export const FirebaseConfigSchema = z.object({
  apiKey: z.string().min(1, 'API ключ Firebase обязателен'),
  authDomain: z.string().min(1, 'Auth домен Firebase обязателен'),
  projectId: z.string().min(1, 'Project ID Firebase обязателен'),
  storageBucket: z.string().min(1, 'Storage bucket Firebase обязателен'),
  messagingSenderId: z.string().min(1, 'Messaging sender ID Firebase обязателен'),
  appId: z.string().min(1, 'App ID Firebase обязателен'),
  measurementId: z.string().optional(),
});

/**
 * Тип конфигурации Firebase, сгенерированный из Zod схемы.
 */
export type FirebaseConfig = z.infer<typeof FirebaseConfigSchema>;

