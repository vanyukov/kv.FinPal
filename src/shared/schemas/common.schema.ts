import { z } from 'zod';

/**
 * Схема для пагинации запросов.
 * Используется для ограничения количества возвращаемых записей.
 */
export const PaginationSchema = z.object({
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
  cursor: z.string().optional(),
});

/**
 * Схема для стандартного ответа API.
 * Обеспечивает единообразный формат ответов от сервера.
 * @param dataSchema - Zod схема для данных ответа
 * @returns Схема ответа API с типизированными данными
 */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z
      .object({
        code: z.string(),
        message: z.string(),
        details: z.unknown().optional(),
      })
      .optional(),
  });

/**
 * Тип для пагинации, сгенерированный из Zod схемы.
 */
export type Pagination = z.infer<typeof PaginationSchema>;

/**
 * Тип для ответа API, сгенерированный из Zod схемы.
 */
export type ApiResponse<T> = z.infer<ReturnType<typeof ApiResponseSchema<T>>>;

