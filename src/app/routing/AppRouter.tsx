import { Routes, Route } from 'react-router-dom';

/**
 * Главный роутер приложения.
 * Определяет все маршруты с lazy loading для code splitting.
 */
export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<div>FinPal - Главная страница</div>} />
    </Routes>
  );
};

