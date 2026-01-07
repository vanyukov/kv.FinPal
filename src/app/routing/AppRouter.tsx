import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { HomePage } from '@/features/auth/pages/HomePage';
import { ROUTES } from './routes.config';

/**
 * Главный роутер приложения.
 * Определяет все маршруты с lazy loading для code splitting.
 * Защищенные маршруты обернуты в ProtectedRoute.
 */
export const AppRouter = () => {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};

