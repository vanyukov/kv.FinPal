import { z } from 'zod';

/**
 * Схема валидации для формы входа.
 * Используется для валидации email и пароля при авторизации.
 */
export const LoginSchema = z.object({
  email: z.string().email('Некорректный email адрес'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

/**
 * Схема валидации для формы регистрации.
 * Расширяет LoginSchema, добавляя подтверждение пароля.
 */
export const RegisterSchema = z
  .object({
    email: z.string().email('Некорректный email адрес'),
    password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

/**
 * Тип для данных входа, сгенерированный из Zod схемы.
 */
export type LoginFormData = z.infer<typeof LoginSchema>;

/**
 * Тип для данных регистрации, сгенерированный из Zod схемы.
 */
export type RegisterFormData = z.infer<typeof RegisterSchema>;

