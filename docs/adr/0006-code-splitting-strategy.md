# 6. Стратегия Code Splitting для маршрутов

Date: 2026-01-06

## Status

Accepted

## Context

Необходимо определить стратегию code splitting для оптимизации размера bundle и времени загрузки приложения.

## Decision

Принята следующая стратегия:

1. **Route-based splitting** - каждый маршрут загружается отдельным chunk
2. **Vendor splitting** - разделение vendor библиотек на отдельные chunks
3. **Lazy loading** - использование React.lazy для маршрутов
4. **Preloading** - предзагрузка критичных маршрутов

### Структура chunks
- `react-vendor` - React, React DOM, React Router
- `mui-vendor` - Material-UI компоненты
- `firebase-vendor` - Firebase SDK
- `charts-vendor` - Recharts
- Route chunks - по одному на маршрут

## Rationale

### Route-based splitting
- Каждый маршрут загружается только при необходимости
- Минимальный initial bundle
- Быстрая первая загрузка

### Vendor splitting
- Кеширование vendor библиотек между обновлениями
- Параллельная загрузка chunks
- Оптимизация повторных визитов

## Implementation

```typescript
// Пример lazy loading маршрута
const AccountsPage = lazy(() => import('@/features/accounts/pages/AccountsPage'));
const OperationsPage = lazy(() => import('@/features/operations/pages/OperationsPage'));
```

## Consequences

### Положительные
- Меньший initial bundle
- Быстрая первая загрузка
- Лучшее кеширование
- Оптимизация для мобильных устройств

### Негативные
- Небольшая задержка при переходе на новый маршрут
- Необходимость обработки loading состояний

