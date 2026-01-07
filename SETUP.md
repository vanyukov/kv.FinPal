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

