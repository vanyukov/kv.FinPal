/**
 * Public API для feature модулей.
 * Экспортирует публичные интерфейсы каждого модуля.
 */

export { LoginPage } from './auth/pages/LoginPage';
export { ProtectedRoute } from './auth/components/ProtectedRoute';
export { useAuth } from './auth/hooks/useAuth';
export { useAuthStore } from './auth/stores/authStore';
export type { LoginFormData, RegisterFormData } from './auth/schemas/auth.schema';

