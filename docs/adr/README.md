# Architecture Decision Records

Этот каталог содержит Architecture Decision Records (ADR) для проекта FinPal.

## Что такое ADR?

ADR - это документ, который фиксирует важное архитектурное решение, принятое в проекте, вместе с его контекстом и последствиями.

## Формат

Каждый ADR следует стандартному формату:
- **Title** - номер и краткое описание решения
- **Date** - дата принятия решения
- **Status** - текущий статус (Proposed, Accepted, Deprecated, Superseded)
- **Context** - контекст и проблема, которую решает решение
- **Decision** - принятое решение
- **Consequences** - последствия решения (положительные и негативные)

## Список ADR

1. [0001-record-architecture-decisions.md](./0001-record-architecture-decisions.md) - Запись архитектурных решений
2. [0002-technology-stack-selection.md](./0002-technology-stack-selection.md) - Выбор технологического стека
3. [0003-state-management-zustand.md](./0003-state-management-zustand.md) - State Management: Zustand vs Redux Toolkit
4. [0004-offline-sync-strategy.md](./0004-offline-sync-strategy.md) - Стратегия оффлайн-синхронизации
5. [0005-firestore-data-structure.md](./0005-firestore-data-structure.md) - Структура данных в Firestore
6. [0006-code-splitting-strategy.md](./0006-code-splitting-strategy.md) - Стратегия Code Splitting для маршрутов
7. [0007-feature-based-folder-structure.md](./0007-feature-based-folder-structure.md) - Feature-based структура папок

## Как добавить новый ADR

1. Создайте новый файл с номером следующим за последним ADR
2. Используйте шаблон из [0001-record-architecture-decisions.md](./0001-record-architecture-decisions.md)
3. Обновите этот README, добавив ссылку на новый ADR

