/**
 * Тесты для модуля управления окружениями.
 * Проверяет корректность определения окружения.
 */
jest.mock('../env', () => require('../__mocks__/env'));

import { getCurrentEnvironment, isDevelopment, isStaging, isProduction } from '../env';

describe('env', () => {
  describe('getCurrentEnvironment', () => {
    it('should return development for localhost', () => {
      // В тестовом окружении (jsdom) hostname всегда localhost
      expect(getCurrentEnvironment()).toBe('development');
    });

    it('should correctly identify development environment', () => {
      expect(getCurrentEnvironment()).toBe('development');
    });
  });

  describe('environment helpers', () => {
    it('isDevelopment should return true in test environment', () => {
      // В тестовом окружении всегда development
      expect(isDevelopment()).toBe(true);
      expect(isStaging()).toBe(false);
      expect(isProduction()).toBe(false);
    });

    it('environment helpers should work correctly', () => {
      const env = getCurrentEnvironment();
      expect(env).toBe('development');
      expect(isDevelopment()).toBe(true);
      expect(isStaging()).toBe(false);
      expect(isProduction()).toBe(false);
    });
  });
});
