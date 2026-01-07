/**
 * Public API для модуля аутентификации.
 * Экспортирует публичные интерфейсы для работы с авторизацией.
 */

export { LoginPage } from './pages/LoginPage';
export { HomePage } from './pages/HomePage';
export { ProtectedRoute } from './components/ProtectedRoute';
export { LoginForm } from './components/LoginForm';
export { useAuth } from './hooks/useAuth';
export { useAuthStore } from './stores/authStore';
export type { LoginFormData, RegisterFormData } from './schemas/auth.schema';
export { LoginSchema, RegisterSchema } from './schemas/auth.schema';

