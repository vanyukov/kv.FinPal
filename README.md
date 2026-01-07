# FinPal

**FinPal** — прогрессивное веб-приложение (PWA) для управления личными финансами с оффлайн-первым подходом.

## Технологический стек

- **Frontend:** React 19 + TypeScript, Material-UI, Zustand, React Router, Recharts
- **Backend:** Firebase (Firestore, Auth, Functions, Hosting)
- **Валидация:** Zod
- **CI/CD:** GitHub Actions
- **Мониторинг:** Sentry, Cloud Logging

## Быстрый старт

### Требования

- Node.js 18+
- npm или yarn

### Установка

```bash
npm install
```

### Разработка

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5173`

### Сборка

```bash
npm run build
```

### Линтинг и форматирование

```bash
npm run lint
npm run format
```

### Тестирование

```bash
# Запуск всех тестов
npm run test

# Запуск тестов в watch режиме
npm run test:watch

# Запуск тестов с покрытием
npm run test:coverage
```

**Важно:** При создании нового функционала обязательно добавляйте тесты. При изменении существующего функционала обновляйте соответствующие тесты. Подробнее см. [SETUP.md](./SETUP.md#требования-к-тестированию).

## Структура проекта

```
src/
├── features/          # Доменные модули (accounts, operations, categories, etc.)
├── shared/            # Общие ресурсы (UI компоненты, утилиты, сервисы)
├── app/               # Конфигурация приложения (роутинг, провайдеры)
└── index.tsx          # Точка входа
```

## Документация

- [Инструкция по настройке](./SETUP.md) - включает требования к тестированию
- [Архитектура](./docs/ARCHITECTURE.md)
- [Roadmap](./docs/ROADMAP.md)
- [Спецификация](./docs/SPECIFICATION.md)
- [ADR (Architecture Decision Records)](./docs/adr/)

## Лицензия

MIT
