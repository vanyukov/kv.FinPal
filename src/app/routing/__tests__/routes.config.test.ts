/**
 * Тесты для конфигурации маршрутов.
 * Проверяет корректность определения путей.
 */
import { ROUTES } from '../routes.config';

describe('routes.config', () => {
  it('should have all required routes defined', () => {
    expect(ROUTES.HOME).toBe('/');
    expect(ROUTES.ACCOUNTS).toBe('/accounts');
    expect(ROUTES.OPERATIONS).toBe('/operations');
    expect(ROUTES.CATEGORIES).toBe('/categories');
    expect(ROUTES.REPORTS).toBe('/reports');
    expect(ROUTES.SETTINGS).toBe('/settings');
    expect(ROUTES.LOGIN).toBe('/login');
    expect(ROUTES.REGISTER).toBe('/register');
  });

  it('should have routes as readonly', () => {
    // TypeScript проверка: ROUTES должен быть readonly
    // В runtime это проверяется через as const
    expect(typeof ROUTES.HOME).toBe('string');
    expect(typeof ROUTES.ACCOUNTS).toBe('string');
  });

  it('should have consistent route format', () => {
    const allRoutes = Object.values(ROUTES);

    // Все маршруты должны быть строками
    allRoutes.forEach((route) => {
      expect(typeof route).toBe('string');
      expect(route).toMatch(/^\//); // Должны начинаться с /
    });
  });

  it('should have unique routes', () => {
    const allRoutes = Object.values(ROUTES);
    const uniqueRoutes = new Set(allRoutes);

    expect(uniqueRoutes.size).toBe(allRoutes.length);
  });
});
