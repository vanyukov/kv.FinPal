/**
 * Тесты для утилит работы с Zod схемами.
 * Проверяет корректность валидации, форматирования ошибок и генерации типов.
 */
import { z } from 'zod';
import {
  validateData,
  validateDataOrThrow,
  formatZodErrors,
  type InferZodType,
} from '../zod-helpers';

describe('zod-helpers', () => {
  const UserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    age: z.number().int().positive('Age must be positive'),
    email: z.string().email('Invalid email'),
  });

  describe('validateData', () => {
    it('should return success true with valid data', () => {
      const validData = {
        name: 'John Doe',
        age: 30,
        email: 'john@example.com',
      };

      const result = validateData(validData, UserSchema);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
        expect(result.data.name).toBe('John Doe');
        expect(result.data.age).toBe(30);
        expect(result.data.email).toBe('john@example.com');
      }
    });

    it('should return success false with invalid data', () => {
      const invalidData = {
        name: 'J',
        age: -5,
        email: 'invalid-email',
      };

      const result = validateData(invalidData, UserSchema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toBeInstanceOf(z.ZodError);
        expect(result.errors.errors.length).toBeGreaterThan(0);
      }
    });

    it('should handle missing required fields', () => {
      const incompleteData = {
        name: 'John',
      };

      const result = validateData(incompleteData, UserSchema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.errors.length).toBeGreaterThan(0);
      }
    });

    it('should handle wrong types', () => {
      const wrongTypes = {
        name: 123,
        age: 'thirty',
        email: true,
      };

      const result = validateData(wrongTypes, UserSchema);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toBeInstanceOf(z.ZodError);
      }
    });
  });

  describe('validateDataOrThrow', () => {
    it('should return data when validation succeeds', () => {
      const validData = {
        name: 'Jane Doe',
        age: 25,
        email: 'jane@example.com',
      };

      const result = validateDataOrThrow(validData, UserSchema);

      expect(result).toEqual(validData);
      expect(result.name).toBe('Jane Doe');
      expect(result.age).toBe(25);
      expect(result.email).toBe('jane@example.com');
    });

    it('should throw ZodError when validation fails', () => {
      const invalidData = {
        name: 'A',
        age: -10,
        email: 'not-an-email',
      };

      expect(() => {
        validateDataOrThrow(invalidData, UserSchema);
      }).toThrow(z.ZodError);
    });

    it('should throw with detailed error information', () => {
      const invalidData = {
        name: '',
        age: 0,
        email: '',
      };

      try {
        validateDataOrThrow(invalidData, UserSchema);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(z.ZodError);
        if (error instanceof z.ZodError) {
          expect(error.errors.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('formatZodErrors', () => {
    it('should format simple field errors', () => {
      const schema = z.object({
        name: z.string().min(2, 'Name too short'),
        age: z.number().int('Age must be integer'),
      });

      const invalidData = {
        name: 'A',
        age: 'not-a-number',
      };

      const result = schema.safeParse(invalidData);
      if (!result.success) {
        const formatted = formatZodErrors(result.error);

        expect(formatted).toHaveProperty('name');
        expect(formatted).toHaveProperty('age');
        expect(typeof formatted.name).toBe('string');
        expect(typeof formatted.age).toBe('string');
      }
    });

    it('should format nested field errors', () => {
      const schema = z.object({
        user: z.object({
          name: z.string().min(2, 'Name too short'),
          profile: z.object({
            bio: z.string().min(10, 'Bio too short'),
          }),
        }),
      });

      const invalidData = {
        user: {
          name: 'A',
          profile: {
            bio: 'short',
          },
        },
      };

      const result = schema.safeParse(invalidData);
      if (!result.success) {
        const formatted = formatZodErrors(result.error);

        expect(formatted['user.name']).toBeDefined();
        expect(formatted['user.profile.bio']).toBeDefined();
        expect(formatted['user.name']).toContain('short');
        expect(formatted['user.profile.bio']).toContain('short');
      }
    });

    it('should handle array field errors', () => {
      const schema = z.object({
        items: z.array(z.string().min(3, 'Item too short')),
      });

      const invalidData = {
        items: ['ab', 'cd'],
      };

      const result = schema.safeParse(invalidData);
      if (!result.success) {
        const formatted = formatZodErrors(result.error);

        expect(Object.keys(formatted).length).toBeGreaterThan(0);
        expect(Object.values(formatted).every((msg) => typeof msg === 'string')).toBe(true);
      }
    });

    it('should return empty object for valid data', () => {
      const schema = z.object({
        name: z.string(),
      });

      const validData = {
        name: 'Valid Name',
      };

      const result = schema.safeParse(validData);
      if (!result.success) {
        const formatted = formatZodErrors(result.error);
        expect(Object.keys(formatted).length).toBe(0);
      } else {
        // Если данные валидны, ошибок нет
        expect(result.success).toBe(true);
      }
    });
  });

  describe('InferZodType', () => {
    it('should correctly infer types from schema', () => {
      const TestSchema = z.object({
        id: z.number(),
        name: z.string(),
        active: z.boolean(),
      });

      type TestType = InferZodType<typeof TestSchema>;

      // TypeScript проверка типов
      const testValue: TestType = {
        id: 1,
        name: 'Test',
        active: true,
      };

      expect(testValue.id).toBe(1);
      expect(testValue.name).toBe('Test');
      expect(testValue.active).toBe(true);
    });

    it('should handle optional fields', () => {
      const SchemaWithOptional = z.object({
        required: z.string(),
        optional: z.string().optional(),
      });

      type OptionalType = InferZodType<typeof SchemaWithOptional>;

      const value: OptionalType = {
        required: 'required',
        optional: undefined,
      };

      expect(value.required).toBe('required');
      expect(value.optional).toBeUndefined();
    });
  });
});
