# Инструкция по настройке проекта

## Первоначальная настройка

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка Husky для pre-commit хуков

После установки зависимостей выполните:

```bash
npm run prepare
```

Это инициализирует Husky и настроит pre-commit хуки для автоматического запуска ESLint и Prettier.

### 3. Настройка Firebase

1. Создайте проект в [Firebase Console](https://console.firebase.google.com/)
2. Скопируйте `.env.example` в `.env`
3. Заполните переменные окружения из Firebase Console:
   - Project Settings → General → Your apps → Web app

```bash
cp .env.example .env
```

Заполните переменные в `.env`:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Инициализация Firebase CLI (опционально)

Если вы хотите использовать Firebase CLI для деплоя:

```bash
npm install -g firebase-tools
firebase login
firebase init
```

При инициализации выберите:

- Firestore
- Hosting
- Functions (опционально)

### 5. Запуск проекта

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5173`

## Проверка настройки

### Проверка линтера

```bash
npm run lint
```

### Проверка форматирования

```bash
npm run format:check
```

### Проверка типов

```bash
npm run type-check
```

### Сборка проекта

```bash
npm run build
```

### Запуск тестов

```bash
# Запуск всех тестов
npm run test

# Запуск тестов в watch режиме
npm run test:watch

# Запуск тестов с покрытием
npm run test:coverage
```

## Требования к тестированию

### При создании нового функционала

**Обязательно создавать тесты** для всех новых компонентов, утилит, хуков и сервисов:

- Тесты располагаются в папке `__tests__` рядом с тестируемым файлом
- Имя тестового файла: `{имя_файла}.test.{ts|tsx}`
- Покрытие должно включать основные сценарии использования и граничные случаи

**Пример:**

```typescript
// src/features/accounts/components/AccountCard.tsx
export const AccountCard = () => { ... }

// src/features/accounts/components/__tests__/AccountCard.test.tsx
describe('AccountCard', () => {
  it('should render correctly', () => { ... });
  it('should handle user interactions', () => { ... });
});
```

### При изменении существующего функционала

**Обязательно обновлять тесты** при изменении существующего кода:

- Если функционал изменился, тесты должны отражать новое поведение
- Если тесты падают после изменений, обновите их для соответствия новой логике
- Добавляйте новые тесты для новой функциональности, добавленной к существующим компонентам

**Проверка перед коммитом:**

```bash
# Убедитесь, что все тесты проходят
npm run test

# Проверьте покрытие
npm run test:coverage
```

### Правила написания тестов

1. **Использование Testing Library**: Фокусируйтесь на поведении, а не на внутренней реализации
2. **Описательные имена**: `should render correctly`, `should handle invalid input`
3. **Моки внешних зависимостей**: Используйте папку `__mocks__` для моков модулей
4. **Покрытие критического функционала**: Минимум 80% для бизнес-логики

### Исключения

Тесты НЕ требуются для:

- Простых констант и конфигураций (без логики)
- Типов TypeScript (type definitions)
- Файлов с только экспортами (re-exports)

## Структура проекта

```
src/
├── features/          # Доменные модули
│   ├── accounts/     # Модуль счетов (будет создан в M2)
│   ├── operations/   # Модуль операций (будет создан в M2)
│   └── ...
├── shared/            # Общие ресурсы
│   ├── ui/           # Переиспользуемые UI компоненты
│   ├── hooks/        # Глобальные хуки
│   ├── utils/        # Утилиты
│   └── services/     # Сервисы (Firebase и др.)
├── app/               # Конфигурация приложения
│   ├── routing/      # Роутинг
│   ├── providers/    # Провайдеры контекста
│   └── config/       # Конфигурация
└── index.tsx          # Точка входа
```

### Структура тестов

Unit-тесты располагаются рядом с исходным кодом в папке `__tests__`:

```
src/
├── app/
│   └── config/
│       ├── env.ts
│       └── __tests__/
│           └── env.test.ts
├── features/
│   └── accounts/
│       ├── components/
│       │   ├── AccountCard.tsx
│       │   └── __tests__/
│       │       └── AccountCard.test.tsx
│       └── hooks/
│           ├── useAccounts.ts
│           └── __tests__/
│               └── useAccounts.test.ts
└── shared/
    └── utils/
        ├── zod-helpers.ts
        └── __tests__/
            └── zod-helpers.test.ts
```

**Правила размещения тестов:**

- Тесты находятся в папке `__tests__` рядом с тестируемым файлом
- Имя тестового файла: `{имя_файла}.test.{ts|tsx}`
- Моки для модулей располагаются в папке `__mocks__` рядом с исходным файлом

## Абсолютные импорты

Проект использует абсолютные импорты через алиас `@/`:

```typescript
// Вместо
import { Button } from '../../../shared/ui/Button';

// Используйте
import { Button } from '@/shared/ui/Button';
```

## Code Splitting

Маршруты автоматически разделяются на отдельные chunks для оптимизации загрузки. Vendor библиотеки также разделены на отдельные chunks.

## Дополнительная информация

- [Архитектура](./docs/ARCHITECTURE.md)
- [Roadmap](./docs/ROADMAP.md)
- [ADR документы](./docs/adr/)
