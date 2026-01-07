/**
 * Тесты для темы Material-UI.
 * Проверяет корректность настройки цветов и параметров темы.
 */
import { theme } from '../theme';

describe('theme', () => {
  it('should have light mode', () => {
    expect(theme.palette.mode).toBe('light');
  });

  it('should have primary color defined', () => {
    expect(theme.palette.primary).toBeDefined();
    expect(theme.palette.primary.main).toBe('#3B82F6');
  });

  it('should have secondary color defined', () => {
    expect(theme.palette.secondary).toBeDefined();
    expect(theme.palette.secondary.main).toBe('#10B981');
  });

  it('should have error color defined', () => {
    expect(theme.palette.error).toBeDefined();
    expect(theme.palette.error.main).toBe('#EF4444');
  });

  it('should be a valid Material-UI theme', () => {
    expect(theme).toBeDefined();
    expect(theme.palette).toBeDefined();
    expect(typeof theme.palette.mode).toBe('string');
  });

  it('should have valid color hex codes', () => {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    expect(theme.palette.primary.main).toMatch(hexColorRegex);
    expect(theme.palette.secondary.main).toMatch(hexColorRegex);
    expect(theme.palette.error.main).toMatch(hexColorRegex);
  });
});
