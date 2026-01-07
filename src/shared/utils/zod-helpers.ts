import { z } from 'zod';

/**
 * Утилиты для работы с Zod схемами и генерации TypeScript типов.
 * Обеспечивает типобезопасность и единообразие валидации данных.
 */

/**
 * Валидирует данные с помощью Zod схемы и возвращает результат.
 * Используется для безопасной валидации данных с обработкой ошибок.
 * @param data - Данные для валидации
 * @param schema - Zod схема для валидации
 * @returns Объект с результатом валидации: success (boolean) и data/errors
 * @example
 * const result = validateData(userInput, UserSchema);
 * if (result.success) {
 *   // result.data содержит валидированные данные
 * } else {
 *   // result.errors содержит ошибки валидации
 * }
 */
export const validateData = <T extends z.ZodTypeAny>(
  data: unknown,
  schema: T
): { success: true; data: z.infer<T> } | { success: false; errors: z.ZodError } => {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error };
};

/**
 * Валидирует данные и выбрасывает исключение при ошибке.
 * Используется когда ошибка валидации должна прервать выполнение.
 * @param data - Данные для валидации
 * @param schema - Zod схема для валидации
 * @returns Валидированные данные
 * @throws {z.ZodError} Если данные не прошли валидацию
 * @example
 * try {
 *   const user = validateDataOrThrow(userInput, UserSchema);
 *   // user содержит валидированные данные
 * } catch (error) {
 *   // error - ZodError с деталями ошибок
 * }
 */
export const validateDataOrThrow = <T extends z.ZodTypeAny>(
  data: unknown,
  schema: T
): z.infer<T> => {
  return schema.parse(data);
};

/**
 * Форматирует ошибки Zod для отображения в формах.
 * Преобразует ZodError в объект с полями формы и сообщениями об ошибках.
 * @param error - Ошибка валидации Zod
 * @returns Объект с ошибками по полям формы
 * @example
 * const result = validateData(formData, FormSchema);
 * if (!result.success) {
 *   const fieldErrors = formatZodErrors(result.errors);
 *   // fieldErrors = { email: "Invalid email", password: "Too short" }
 * }
 */
export const formatZodErrors = (error: z.ZodError): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};

  error.errors.forEach((err) => {
    const path = err.path.join('.');
    fieldErrors[path] = err.message;
  });

  return fieldErrors;
};

/**
 * Создает тип из Zod схемы для использования в TypeScript.
 * Удобная обертка для z.infer для более читаемого кода.
 * @param schema - Zod схема
 * @returns TypeScript тип, выведенный из схемы
 * @example
 * const UserSchema = z.object({ name: z.string(), age: z.number() });
 * type User = InferZodType<typeof UserSchema>; // { name: string; age: number }
 */
export type InferZodType<T extends z.ZodTypeAny> = z.infer<T>;

