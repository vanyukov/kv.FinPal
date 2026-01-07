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

## Структура проекта

```
src/
├── features/          # Доменные модули (accounts, operations, categories, etc.)
├── shared/            # Общие ресурсы (UI компоненты, утилиты, сервисы)
├── app/               # Конфигурация приложения (роутинг, провайдеры)
└── index.tsx          # Точка входа
```

## Документация

- [Архитектура](./docs/ARCHITECTURE.md)
- [Roadmap](./docs/ROADMAP.md)
- [Спецификация](./docs/SPECIFICATION.md)
- [ADR (Architecture Decision Records)](./docs/adr/)

## Лицензия

MIT
