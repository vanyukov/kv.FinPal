# Описание приложения

Основная цель — предоставить пользователям простой, интуитивный инструмент для отслеживания доходов, расходов и финансовых операций, с фокусом на мобильность и безопасность данных.  
Это приложение будет прогрессивным веб\-приложением (PWA), что позволит ему работать оффлайн, устанавливаться на устройства как нативное приложение и синхронизироваться с сервером при подключении. Оно будет использовать Firebase оффлайн-персистентность (своё локальное хранилище)  
Приложение ориентировано на индивидуальных пользователей, желающих вести личный бюджет. 

# Название

## FinPal 

Почему: Дружелюбно, как личный помощник  
Домен: finpal.app, finpal.com (свободен)  
Лого: Смайлик с монетой или графиком  
Слоган: "Your financial buddy"

# Функционал

* ## Приходно-расходная операции

  * Пользователь вводит операцию заполняя данные согласно сущности “Операция”

* ## Регулярные операции

  * Функция для настройки повторяющихся операций (например, аренда, подписки, коммуналка, аванс, зарплата).   
  * Пользователь задает данные согласно сущности “Операция”, дату начала и окончания.  
  * Автоматическое добавление операций в список по расписанию (оффлайн — через локальные уведомления клиентские Web Workers).  
  * Редактирование или отключение регулярных операции.   
  * Отчет о предстоящих доходах/расходах на главном экране (виджет "Ближайшие расходы").

* ## Запланированная операция

  * Планирование будущих операций.   
  * Пользователь вводит данные согласно сущности “Операция”.  
  * Интеграция с календарем: напоминания через уведомления (клиентские Web Workers в PWA).  
  * Визуализация в виде календаря или timeline на отдельном экране.   
  * Автоматическое преобразование запланированного расхода в реальный при подтверждении

* ## Отчеты

  * Базовые отчеты:   
    * Общий баланс,   
    * доходы/расходы за период (день, неделя, месяц, год).  
    * Варианты визуализации   
      * Таблица  
      * Графики (пироговая диаграмма для категорий, линейный график для динамики баланса) с использованием библиотек типа Chart.js.  
  * Расширенные отчеты  
    * Анализ по категориям (топ-расходы)  
    * сравнение периодов  
    * прогноз баланса на основе регулярных и запланированных операций.  
  * Экспорт в CSV   
    * \+ генерируемая ссылка на шаблон Google Sheets  
    * для импорта в Excel  
  * PDF для печати

* ## Оффлайн-режим

  * Все операции сохраняются локально, синхронизация при подключении

* ## Поиск и фильтры

  * Глобальный поиск по операциям, фильтры по сумме, дате, категории

* ## Настройки

  * Темная/светлая тема,   
  * выбор валюты по умолчанию,   
  * выбор счета по умолчанию,   
  * выбор Проекта по умолчанию,   
  * выбор Категории по умолчанию,   
  * уведомления,   
  * резервное копирование данных.

* ## Авторизация 

  * Google  
  * почта

* ## Бэкап 

  * Выгрузка / загрузка  
  * Загрузка / синхронизация из таблицы  
* 

# Сущности

### Список операций \- таблица на главной

Фильтры 

* Период   
* Валюта   
* Категория   
* Проект 

### Операция \- запись в таблице “Список операций”

* Дата  
* Счёт  
* Вид операции \- приход / расход  
* статус  \- запланировано, выполнено, отменено  
* Категория  
* Проект   
* Теги  \- массив, можно выбрать несколько  
* Сумма   
* Комментарии

### Счёт \- Справочник

* Валюта   
* Название   
* Описание   
* Цвет (операция в списке будет выделяться)  
* Архивно 

### Шаблоны операции \- Иерархический справочник 

* Содержит данные согласно сущности “Операция”  
* Используется для быстрого создания операции 

### Категории  \- Иерархический справочник

Иерархический справочник 

* Название   
* parentId: string | null  
* Описание   
* Архивный

### Теги \- Справочник

Используется для дополнительной маркировки операций, их может быть несколько у операции, например “Подарок”, “безнал”, “командировка” 

* Название   
* Описание   
* Архивный

### Валюта  \- Справочник

Справочник 

* Название  
* Международный код (ISO 4217)  
* Сокращённое название символ
* Курсы валют (обновляются ежедневно)

Заполняется загрузкой из онлайн-справочника   
Встроить базовый список из 10 основных валют, обновлять через фон:

#### Схема в Firestore:

```typescript
/currencies/{code}
{
  code: string,        // "USD", "EUR", "RUB"
  name: string,         // "US Dollar"
  symbol: string,       // "$", "€", "₽"
  rates: {
    [targetCode: string]: number // курс к целевой валюте
  },
  baseCurrency: string, // базовая валюта для курсов (обычно "USD")
  lastUpdated: timestamp,
  source: string        // "ECB" или "exchangerate.host"
}
```

#### Обновление курсов:

Cloud Function обновляет курсы ежедневно:
```javascript
exports.updateCurrencyRates = functions.pubsub
  .schedule('0 2 * * *') // 02:00 UTC
  .onRun(async () => {
    const rates = await fetchRatesFromAPI('exchangerate.host');
    const baseCurrency = 'USD';
    
    for (const [code, rate] of Object.entries(rates)) {
      await firestore.doc(`currencies/${code}`).set({
        code,
        rates: { [baseCurrency]: rate },
        lastUpdated: new Date(),
        source: 'exchangerate.host'
      }, { merge: true });
    }
  });
```

#### Конвертация валют:

При отображении операций в разных валютах:
- Используется курс на дату операции (исторический)
- Если курс недоступен - используется последний известный
- Конвертация происходит на клиенте для производительности

### Настройки  \- Справочник

* Название  
* Значение  
  * ссылка на значение другого справочника  
  * булево  
  * дата  
  * число  
  * строка

# Пользовательский интерфейс (UI/UX)

## Верхняя панель

* Текущий баланс (сумма в основной валюте, с индикатором положительный/отрицательный).  
* Offline-индикатор

## Главный экран:

* Список операций  
* Карточки с иконками (зеленая для прихода, красная для расхода, синяя для обмена). Каждая карточка expandable для деталей.  
* Нижняя панель или FAB (Floating Action Button) Кнопки:   
  * "+ Приход",   
  * "- Расход",   
  * "🔛 Обмен".   
* Быстрый доступ к отчетам и настройкам через боковое меню или tabs.  
* Виджеты:   
  * "Ближайшие регулярные расходы"   
  * "Запланированные на неделю".

## Счета

* Список счетов  
  * Название  
  * валюта  
  * Текущий баланс

## Категории

* Иерархический список  
  * Название  
  * parentId: string | null

## Шаблоны

* Иерархический список шаблонов операции  
* название  
* parentId: string | null  
* комментарий  
* сумма  
* валюта  
* кнопка редактирования шаблона  
* кнопка создания по шаблону  
* внизу кнопка добавления нового шаблона

## Отчеты 

* Список отчетов

## Формы добавления

* Модальные окна или отдельные страницы с полями ввода (  
  * сумма — числовой инпут с клавиатурой,   
  * дата — date-picker,   
  * категория — dropdown с поиском).   
* Валидация на фронте (например, сумма \> 0).

## Общий дизайн: 

* Оффлайн-first  
  * mobile first  
  * Минималистичный,   
  * responsive (адаптивный для мобильных и десктоп).   
  * Использовать Material Design или Bootstrap для consistency.   
  * Анимации для переходов (React Spring или CSS transitions).  
* UX-принципы:   
  * Простота (минимум кликов для добавления операции),  
  * визуализация (цвета для типов операций),   
  * доступность (ARIA-атрибуты, поддержка screen readers).

# Техническая архитектура

* Оффлайн-first дизайн  
* Front-End: React.js с PWA-функциями.   
  * State management — Zustand  
  * роутинг \- React Router  
  * UI-библиотека — Material-UI   
  * Для графиков — Recharts   
* Back-End:   
  * Firebase  
* DB  
  * Firestore  
    * оффлайн-персистентность,   
    * realtime sync,   
    * конфликты решаются optimistic concurrency  
  *   
* Hosting  
  * статический хостинг PWA.  
* CI/CD   
  * GitHub Actions для тестов и деплоя на хостинг.  
* Мониторинг:   
  * Sentry для ошибок  
* Тестирование:   
  * Jest для unit-тестов,   
  * PlayWright для E2E.  
* Интеграции:   
  * API для курсов валют (European Central Bank или exchangerate.host — бесплатные без лимита.)

# Безопасность и данные

* Аутентификация:   
  * Google/Firebase Auth   
  * email  
* Данные:   
  * Нет хранения чувствительных данных (как номера карт).   
  * GDPR-соответствие: опция удаления данных.  
  * В бэкграунде Синхронизация локальных данных с данными бэкенда  
* Риски:   
  * Защита от XSS/SQL-инъекций на бэке. 

# Ограничения

## Cloud Firestore offers free quota [https://firebase.google.com/docs/firestore/quotas\#free-quota](https://firebase.google.com/docs/firestore/quotas#free-quota)

| Free tier | Quota |
| :---- | :---- |
| Stored data | 1 GiB |
| Document reads | 50,000 per day |
| Document writes | 20,000 per day |
| Document deletes | 20,000 per day |
| Outbound data transfer | 10 GiB per month |

## Решение:

* Кешировать на клиенте агрегированные данные  
* Использовать подсчеты на стороне клиента  
* Для отчетов \- Cloud Functions которые считают раз в день

  // Вместо запроса всех операций для отчета

  const operations \= await firestore.collection('operations').get(); // 50 reads\!


  // Делать так:

  // 1\. Хранить агрегированные данные

  const dailySummary \= await firestore

    .doc('summaries/user123/2024-01-15')

    .get(); // 1 read


  // 2\. Или считать в Cloud Function

  exports.generateDailyReport \= functions.pubsub

    .schedule('every 24 hours')

    .onRun(async () \=\> {

      // Считаем один раз для всех пользователей

      const summary \= await calculateSummary();

      await saveSummary(summary);

    });

# Firestore

## Схема с полями и типами

### Структура коллекций

// Корневой уровень  
/users/{userId}/  
  /accounts/{accountId}  
  /categories/{categoryId}  
  /tags/{tagId}  
  /templates/{templateId}  
  /operations/{operationId}  
  /settings/{settingKey}  
  /reports/{reportId}
  /projects/{projectId}

### 1\. Аккаунты (Счета)

{  
  id: string,           // auto-generated  
  userId: string,  
  name: string,         // "Основной счет", "Карта Tinkoff"  
  currency: string,     // "USD", "EUR", "RUB" (ISO код)  
  balance: number,      // Текущий баланс (вычисляется из операций)  
  initialBalance: number, // Начальный баланс  
  color: string,        // "\#3B82F6"  
  description: string,  // опционально  
  isArchived: boolean,  
  createdAt: timestamp,  
  updatedAt: timestamp,  
  // Для оптимизации:  
  lastOperationDate: timestamp,  
  lastBalanceUpdate: timestamp,
  // Для валидации баланса:
  balanceLastValidated: timestamp | null,
  balanceValidationHash: string | null // хеш всех операций для проверки целостности
}

// Индексы:  
// userId \+ isArchived \+ currency  
// userId \+ createdAt DESC

### 2\. Категории (с иерархией)

{  
  id: string,  
  userId: string,  
  name: string,         // "Еда", "Транспорт"  
  type: 'income' | 'expense' | 'transfer',  
  parentId: string | null, // Для иерархии  
  path: string,         // "food/restaurants" для запросов  
  icon: string,         // "restaurant", "car" (MUI icon name)  
  color: string,        // "\#EF4444"  
  description: string,  
  isArchived: boolean,  
  order: number,        // для сортировки  
  // Статистика для оптимизации:  
  totalAmount: number,  // Сумма всех операций (обновляется batch)  
  operationCount: number,  
  lastUsed: timestamp,  
  createdAt: timestamp,  
  updatedAt: timestamp  
}

// Индексы:  
// userId \+ type \+ isArchived  
// userId \+ parentId  
// userId \+ path (для иерархических запросов)

### 3\. Теги (просто строки)

{  
  id: string,  
  userId: string,  
  name: string,         // "важное", "работа", "отпуск"  
  color: string,        // опционально  
  description: string,  // опционально  
  isArchived: boolean,  
  usageCount: number,   // сколько раз использован  
  createdAt: timestamp,  
  updatedAt: timestamp  
}

// Индексы:  
// userId \+ name  
// userId \+ usageCount DESC
// userId \+ isArchived \+ usageCount DESC (для автодополнения)

### 4\. Шаблоны операций (и Регулярные)

{  
  id: string,  
  userId: string,  
  name: string,         // "Аренда квартиры", "Зарплата"  
  type: 'income' | 'expense' | 'transfer',  
  amount: number,  
  currency: string,  
  accountId: string,    // ссылка на счет  
  categoryId: string,   // ссылка на категорию  
  description: string,  
  tagIds: string\[\],      // массив ID тегов из справочника  
    
  // Для регулярных операций:  
  isRecurring: boolean,  
  recurrence: {  
    type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom',  
    interval: number,   // каждые N дней/недель и т.д.  
    daysOfWeek: number\[\], // \[1,3,5\] для пн,ср,пт (0=воскр)  
    dayOfMonth: number, // 15-е число  
    monthOfYear: number, // 3 (март)  
  },  
  startDate: timestamp,  
  endDate: timestamp | null,  
  lastGenerated: timestamp | null,  
  nextOccurrence: timestamp, // вычисляется  
    
  // Мета:  
  isActive: boolean,  
  usageCount: number,  
  createdAt: timestamp,  
  updatedAt: timestamp  
}

// Индексы:  
// userId \+ isRecurring \+ isActive  
// userId \+ nextOccurrence ASC (для виджета)  
// userId \+ type \+ categoryId

### 5\. Операции (главная сущность)

{  
  id: string,  
  userId: string,  
  type: 'income' | 'expense' | 'transfer',  
  amount: number,  
  currency: string,  
    
  // Основные ссылки  
  accountId: string,    // с какого счета  
  targetAccountId: string | null, // для transfer  
  categoryId: string,
  projectId: string | null, // ссылка на проект  
    
  // Данные  
  date: timestamp,      // дата операции  
  description: string,  
  tagIds: string\[\],     // массив ID тегов из справочника  
    
  // Статус  
  status: 'pending' | 'completed' | 'cancelled',  
  isPlanned: boolean,   // запланированная операция  
  plannedDate: timestamp | null, // когда планировалась  
    
  // Для регулярных операций  
  templateId: string | null, // если создана из шаблона  
  recurrenceId: string | null, // идентификатор регулярной серии  
    
  // Для синхронизации и конфликтов  
  version: number,      // начинается с 1, увеличивается при изменении  
  createdAt: timestamp,  
  updatedAt: timestamp,  
  createdBy: string,    // deviceId или 'system'  
  updatedBy: string,  
    
  // Вычисляемые поля для оптимизации запросов  
  monthKey: string,     // "2024-01" для группировки по месяцам  
  year: number,         // 2024  
  month: number,        // 1-12  
  day: number,          // 1-31  
    
  // Опционально  
  receiptImage: string | null, // URL чека  
  location: {  
    lat: number,  
    lng: number,  
    address: string  
  } | null  
}

// ВАЖНЫЕ ИНДЕКСЫ (без них превысишь лимит 1 запрос/сек):  
// userId \+ accountId \+ date DESC (главный список)  
// userId \+ categoryId \+ date DESC (отчет по категориям)  
// userId \+ date \+ type (отчеты за период)  
// userId \+ monthKey \+ type (агрегация по месяцам)  
// userId \+ status \+ date (планируемые операции)  
// userId \+ templateId (связь с шаблоном)
// userId \+ projectId \+ date DESC (фильтр по проекту)
// userId \+ tagIds array-contains (поиск операций по тегу)

### 6\. Настройки пользователя

{  
  userId: string,  
  key: string,  // вместо id  
  value: any,  
  type: 'string' | 'number' | 'boolean' | 'date' | 'reference',  
    
  // Примеры документов:  
  // { key: 'defaultCurrency', value: 'RUB', type: 'string' }  
  // { key: 'theme', value: 'dark', type: 'string' }  
  // { key: 'defaultAccountId', value: 'acc123', type: 'reference' }  
  // { key: 'notificationsEnabled', value: true, type: 'boolean' }  
    
  updatedAt: timestamp  
}

// Индекс: userId \+ key

### 8\. Проекты

{  
  id: string,  
  userId: string,  
  name: string,         // "Ремонт квартиры", "Отпуск 2024"  
  description: string,  // опционально  
  color: string,        // "#3B82F6" для визуального выделения  
  isArchived: boolean,  
  createdAt: timestamp,  
  updatedAt: timestamp  
}

// Индексы:  
// userId \+ isArchived  
// userId \+ createdAt DESC

### 7\. Агрегированные данные (для отчетов)

// Ежедневные суммы (обновляется через Cloud Functions)  
{  
  id: string, // "2024-01-15"  
  date: timestamp,  
    
  // По типам  
  totalIncome: number,  
  totalExpense: number,  
  balanceChange: number,  
    
  // По категориям (Map)  
  byCategory: {  
    \[categoryId: string\]: {  
      income: number,  
      expense: number,  
      count: number  
    }  
  },  
    
  // По счетам  
  byAccount: {  
    \[accountId: string\]: {  
      balance: number,  
      income: number,  
      expense: number  
    }  
  },  
    
  updatedAt: timestamp  
}

// Ежемесячные отчеты  
{  
  id: string, // "2024-01"  
  month: number,  
  year: number,  
    
  summary: {  
    totalIncome: number,  
    totalExpense: number,  
    balanceStart: number, // баланс на начало месяца  
    balanceEnd: number,   // баланс на конец месяца  
    avgDailyExpense: number,  
    largestExpense: {  
      amount: number,  
      categoryId: string,  
      description: string  
    }  
  },  
    
  // Топ категорий  
  topCategories: Array\<{  
    categoryId: string,  
    amount: number,  
    percentage: number  
  }\>,  
    
  generatedAt: timestamp  
}

Реляционные связи  
// Операция → Категория  
operation.categoryId \= category.id

// Операция → Счет  
operation.accountId \= account.id

// Регулярная операция → Шаблон  
operation.templateId \= template.id

// Категория → Родительская категория  
category.parentId \= category.id (или null)

Оптимизационные поля  
Для избежания дорогих запросов:  
// В аккаунте храним баланс (вычисляется при операциях)  
async function updateAccountBalance(accountId, amount, type) {  
  const accountRef \= firestore.doc(\`accounts/${accountId}\`);  
  const increment \= type \=== 'income' ? amount : \-amount;  
    
  await accountRef.update({  
    balance: firebase.firestore.FieldValue.increment(increment),  
    lastBalanceUpdate: new Date()  
  });  
}

// В категории храним статистику  
async function updateCategoryStats(categoryId, amount, type) {  
  const field \= type \=== 'income' ? 'totalIncome' : 'totalExpense';  
    
  await firestore.doc(\`categories/${categoryId}\`).update({  
    \[field\]: firebase.firestore.FieldValue.increment(amount),  
    operationCount: firebase.firestore.FieldValue.increment(1),  
    lastUsed: new Date()  
  });  
}

// Пересчет баланса счета (для валидации)
async function recalculateAccountBalance(accountId, userId) {  
  const operationsRef \= firestore  
    .collection(\`users/${userId}/operations\`)  
    .where('accountId', '==', accountId)  
    .where('status', '==', 'completed');  
    
  const snapshot \= await operationsRef.get();  
  let calculatedBalance \= 0;  
  const account \= await firestore.doc(\`users/${userId}/accounts/${accountId}\`).get();  
  const accountData \= account.data();  
  calculatedBalance \= accountData.initialBalance || 0;  
    
  snapshot.docs.forEach(doc \=\> {  
    const op \= doc.data();  
    if (op.type \=== 'income') {  
      calculatedBalance \+= op.amount;  
    } else if (op.type \=== 'expense') {  
      calculatedBalance \-= op.amount;  
    } else if (op.type \=== 'transfer' && op.targetAccountId) {  
      calculatedBalance \-= op.amount;  
    }  
  });  
    
  // Сравниваем с сохраненным балансом  
  const savedBalance \= accountData.balance || 0;  
  if (Math.abs(calculatedBalance \- savedBalance) \> 0.01) {  
    // Расхождение! Логируем и исправляем  
    console.error(\`Balance mismatch for account ${accountId}: saved=${savedBalance}, calculated=${calculatedBalance}\`);  
    await firestore.doc(\`users/${userId}/accounts/${accountId}\`).update({  
      balance: calculatedBalance,  
      balanceLastValidated: new Date(),  
      balanceValidationHash: await calculateOperationsHash(snapshot)  
    });  
  } else {  
    // Все ок, обновляем только метаданные  
    await firestore.doc(\`users/${userId}/accounts/${accountId}\`).update({  
      balanceLastValidated: new Date(),  
      balanceValidationHash: await calculateOperationsHash(snapshot)  
    });  
  }  
    
  return calculatedBalance;  
}

## Правила безопасности Firestore

rules\_version \= '2';  
service cloud.firestore {  
  match /databases/{database}/documents {  
    // Проверка владельца  
    function isOwner(userId) {  
      return request.auth \!= null && request.auth.uid \== userId;  
    }  
    
    // Валидация операции
    function isValidOperation() {
      let data = request.resource.data;
      return data.amount is number 
        && data.amount > 0
        && data.currency is string
        && data.type in ['income', 'expense', 'transfer']
        && data.accountId is string
        && data.categoryId is string
        && data.date is timestamp
        && data.date <= request.time
        && (!('tagIds' in data) || (data.tagIds is list && data.tagIds.size() <= 10)); // максимум 10 тегов
    }
    
    // Все пользовательские данные  
    match /users/{userId}/accounts/{accountId} {  
      allow read: if isOwner(userId);
      allow create, update: if isOwner(userId) 
        && request.resource.data.name is string
        && request.resource.data.currency is string;
      allow delete: if isOwner(userId);
    }  
    
    match /users/{userId}/categories/{categoryId} {  
      allow read: if isOwner(userId);
      allow create, update: if isOwner(userId)
        && request.resource.data.name is string
        && request.resource.data.type in ['income', 'expense', 'transfer'];
      allow delete: if isOwner(userId);
    }  
    
    match /users/{userId}/operations/{operationId} {  
      allow read: if isOwner(userId);
      allow create: if isOwner(userId) && isValidOperation();
      allow update: if isOwner(userId) 
        && isValidOperation()
        && request.resource.data.version == resource.data.version + 1;
      allow delete: if isOwner(userId) 
        && (resource.data.status == 'cancelled' || !resource.data.exists);
    }  
    
    match /users/{userId}/templates/{templateId} {  
      allow read: if isOwner(userId);
      allow write: if isOwner(userId);
    }  
    
    match /users/{userId}/tags/{tagId} {  
      allow read: if isOwner(userId);
      allow write: if isOwner(userId) 
        && request.resource.data.name is string;
    }  
    
    match /users/{userId}/projects/{projectId} {  
      allow read: if isOwner(userId);
      allow write: if isOwner(userId)
        && request.resource.data.name is string;
    }  
  }  
}

## Пример запросов

// Главный список операций (последние 50\)  
const operationsRef \= firestore  
  .collection('users').doc(userId)  
  .collection('operations')  
  .where('accountId', '==', accountId)  
  .orderBy('date', 'desc')  
  .limit(50);

// Отчет за месяц  
const monthlyReport \= firestore  
  .collection('users').doc(userId)  
  .collection('operations')  
  .where('monthKey', '==', '2024-01')  
  .where('type', 'in', \['income', 'expense'\]);

// Регулярные операции на этой неделе  
const upcomingRecurring \= firestore  
  .collection('users').doc(userId)  
  .collection('templates')  
  .where('isRecurring', '==', true)  
  .where('isActive', '==', true)  
  .where('nextOccurrence', '\>=', startOfWeek)  
  .where('nextOccurrence', '\<=', endOfWeek)  
  .orderBy('nextOccurrence', 'asc');

// Баланс по счетам (предварительно вычисленный)  
const accounts \= firestore  
  .collection('users').doc(userId)  
  .collection('accounts')  
  .where('isArchived', '==', false)  
  .orderBy('balance', 'desc');

## Критически важные индексы

В Firestore Console создай эти composite индексы:

* operations → userId Ascending, date Descending  
* operations → userId Ascending, accountId Ascending, date Descending  
* operations → userId Ascending, categoryId Ascending, date Descending  
* operations → userId Ascending, monthKey Ascending, type Ascending  
* operations → userId Ascending, projectId Ascending, date Descending  
* operations → userId Ascending, tagIds Array (для поиска операций по тегу)
* templates → userId Ascending, isRecurring Ascending, nextOccurrence Ascending
* tags → userId Ascending, isArchived Ascending, usageCount Descending

Без этих индексов каждый запрос будет стоить минимум 0.5 секунды и быстро съест дневной лимит\!

## Лимиты и оптимизации

* Не делать collectionGroup запросы — дорого и требует специальных индексов  
* Лимит на документ: 1MB — не храни бинарные данные (чеки храни в Storage)  
* Batch операции при обновлении баланса и статистики  
* Использовать array-contains для тегов вместо array-contains-any (дешевле)

## Стратегия миграции для MVP

### Принципы миграции (упрощенная версия для MVP)

* Версионирование схемы с первого дня (обязательно)
* Миграция на месте для простых изменений (добавление полей)
* Фоновая миграция через Cloud Functions при необходимости
* Backward compatibility через обработку отсутствующих полей в коде

### Версионирование схемы

**Обязательно:** Все документы должны иметь поле `version` с первого дня.

```typescript
// Базовая структура всех документов
{
  version: number,        // начинается с 1
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Хранение версии схемы пользователя:**
```typescript
/users/{userId}/settings/schemaVersion
{
  currentVersion: number,    // текущая версия схемы (начинается с 1)
  lastMigration: timestamp | null,
  needsMigration: boolean    // флаг необходимости миграции
}
```

### Миграция на месте (для простых изменений)

Используется для добавления новых полей, изменения значений по умолчанию и т.д.

**Пример: Добавление нового поля `icon` в категории**

```javascript
// Cloud Function для миграции категорий v1 → v2
exports.migrateCategoriesV1ToV2 = functions.https.onCall(async (data, context) => {
  const userId = context.auth.uid;
  if (!userId) throw new Error('Unauthorized');
  
  const categoriesRef = firestore
    .collection('users').doc(userId)
    .collection('categories');
  
  const snapshot = await categoriesRef
    .where('version', '==', 1)
    .get();
  
  if (snapshot.empty) {
    return { migrated: 0, message: 'No categories to migrate' };
  }
  
  const batch = firestore.batch();
  let count = 0;
  
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    // Добавляем дефолтную иконку по типу
    const icon = getDefaultIcon(data.type);
    
    batch.update(doc.ref, {
      icon: icon,
      version: 2,
      migratedAt: new Date()
    });
    count++;
  });
  
  await batch.commit();
  
  // Обновляем версию схемы пользователя
  await firestore.doc(`users/${userId}/settings/schemaVersion`).set({
    currentVersion: 2,
    lastMigration: new Date(),
    needsMigration: false
  }, { merge: true });
  
  return { migrated: count, message: 'Migration completed' };
});

function getDefaultIcon(type) {
  const iconMap = {
    'income': 'trending_up',
    'expense': 'trending_down',
    'transfer': 'swap_horiz',
    'food': 'restaurant',
    'transport': 'directions_car'
  };
  return iconMap[type] || 'category';
}
```

### Проверка версии при чтении данных

На клиенте всегда проверяем версию и обрабатываем отсутствующие поля:

```typescript
// Пример: Чтение категории с обработкой разных версий
function normalizeCategory(doc: DocumentSnapshot): Category {
  const data = doc.data();
  const version = data.version || 1;
  
  return {
    id: doc.id,
    name: data.name,
    type: data.type,
    icon: data.icon || getDefaultIcon(data.type), // дефолт для v1
    color: data.color || '#3B82F6',              // дефолт для v1
    parentId: data.parentId || null,
    path: data.path || data.name.toLowerCase(),   // дефолт для v1
    isArchived: data.isArchived || false,
    // ... остальные поля
  };
}
```

### Запуск миграции

**Вариант 1: По требованию (рекомендуется для MVP)**

Пользователь запускает миграцию вручную через UI или автоматически при первом открытии после обновления:

```typescript
// На клиенте
async function checkAndMigrate(userId: string) {
  const schemaDoc = await firestore
    .doc(`users/${userId}/settings/schemaVersion`)
    .get();
  
  const currentVersion = schemaDoc.data()?.currentVersion || 1;
  const targetVersion = 2; // версия из конфига приложения
  
  if (currentVersion < targetVersion) {
    // Показываем уведомление пользователю
    showMigrationNotification();
    
    // Запускаем миграцию через Cloud Function
    const migrateFunction = functions.httpsCallable('migrateCategoriesV1ToV2');
    await migrateFunction();
    
    // Перезагружаем данные
    await reloadData();
  }
}
```

**Вариант 2: Фоновая миграция (для больших объемов)**

Для пользователей с большим количеством данных - миграция через Cloud Function по расписанию:

```javascript
// Cloud Function для фоновой миграции всех пользователей
exports.scheduledMigration = functions.pubsub
  .schedule('0 2 * * *') // каждый день в 02:00 UTC
  .onRun(async (context) => {
    const users = await getUsersNeedingMigration(2); // нужна миграция до v2
    
    for (const userId of users) {
      try {
        await migrateUserData(userId, 2);
      } catch (error) {
        console.error(`Migration failed for user ${userId}:`, error);
        // Логируем ошибку, но продолжаем
      }
    }
  });
```

### Когда использовать Dual-write (не для MVP)

Dual-write (запись в старую и новую схему одновременно) нужен только при:
- Изменении структуры коллекций (например, разделение одной коллекции на несколько)
- Breaking changes, которые нельзя обработать через дефолтные значения
- Критичных изменениях, требующих гарантированной совместимости

**Для MVP:** Dual-write не нужен. Используем только миграцию на месте и обработку отсутствующих полей в коде.

# Логика регулярных операций  
  const categoriesRef \= firestore  
    .collection('users').doc(userId)  
    .collection('categories');  
    
  const snapshot \= await categoriesRef.get();  
  const batch \= firestore.batch();  
    
  snapshot.docs.forEach(doc \=\> {  
    const data \= doc.data();  
    if (data.version \=== 1\) {  
      // Добавляем дефолтные иконки по типу  
      const icon \= data.type \=== 'food' ? 'restaurant' : 'shopping\_bag';  
      batch.update(doc.ref, {   
        icon: icon,  
        version: 2,  
        migratedAt: new Date()  
      });  
    }  
  });  
    
  await batch.commit();  
};

### Фаза 2: Dual-write приложения (самый безопасный)

javascript  
// Приложение пишет в старую И новую схему одновременно  
class MigrationAwareFirestore {  
  constructor(userId) {  
    this.userId \= userId;  
    this.oldSchema \= firestore.collection(\`users\_v1/${userId}/operations\`);  
    this.newSchema \= firestore.collection(\`users/${userId}/operations\_v2\`);  
  }  
    
  async addOperation(operation) {  
    // 1\. Пишем в новую схему  
    const newOp \= this.transformToV2(operation);  
    const newRef \= await this.newSchema.add(newOp);  
      
    // 2\. Пишем в старую (для backward compatibility)  
    const oldRef \= await this.oldSchema.add(operation);  
      
    // 3\. Сохраняем связь  
    await this.newSchema.doc(newRef.id).update({  
      legacyId: oldRef.id,  
      migrationStatus: 'dual\_write'  
    });  
      
    return { newId: newRef.id, oldId: oldRef.id };  
  }  
    
  async getOperations() {  
    // Сначала пытаемся из новой схемы  
    const newOps \= await this.newSchema.limit(50).get();  
      
    if (\!newOps.empty) {  
      return newOps.docs.map(doc \=\> this.transformFromV2(doc.data()));  
    }  
      
    // Fallback к старой схеме  
    const oldOps \= await this.oldSchema.limit(50).get();  
    return oldOps.docs.map(doc \=\> doc.data());  
  }  
}

### Фаза 3: Фоновая миграция данных (Cloud Functions)

javascript  
// cloud-functions/migrate-user.js  
exports.migrateUserData \= functions.firestore  
  .document('users/{userId}/migration-tasks/{taskId}')  
  .onCreate(async (snap, context) \=\> {  
    const { userId } \= context.params;  
    const task \= snap.data();  
      
    try {  
      // 1\. Мигрируем операции  
      await migrateOperations(userId);  
        
      // 2\. Мигрируем категории  
      await migrateCategories(userId);  
        
      // 3\. Обновляем статус  
      await firestore.doc(\`users/${userId}/migration-status/current\`)  
        .set({  
          version: 2,  
          completedAt: new Date(),  
          migratedRecords: await getCount(userId),  
          status: 'completed'  
        }, { merge: true });  
          
    } catch (error) {  
      // Записываем ошибку для ручного исправления  
      await firestore.doc(\`users/${userId}/migration-errors/${Date.now()}\`)  
        .set({  
          error: error.message,  
          stack: error.stack,  
          timestamp: new Date()  
        });  
    }  
  });

// Запуск миграции для пользователя  
exports.startUserMigration \= functions.https.onCall(async (data, context) \=\> {  
  const userId \= context.auth.uid;  
    
  // Создаем задачу миграции  
  await firestore.doc(\`users/${userId}/migration-tasks/${Date.now()}\`)  
    .set({  
      userId,  
      targetVersion: 2,  
      startedAt: new Date(),  
      status: 'pending'  
    });  
      
  return { success: true, message: 'Migration started' };  
});

### 🛡️ Конкретные сценарии миграции для твоего приложения

#### Сценарий 1: Добавление нового поля path в категории

javascript  
async function migrateCategoryPaths(userId) {  
  const categoriesRef \= firestore  
    .collection('users').doc(userId)  
    .collection('categories');  
    
  // Получаем все категории  
  const snapshot \= await categoriesRef.get();  
  const categories \= snapshot.docs.map(doc \=\> ({  
    id: doc.id,  
    ...doc.data()  
  }));  
    
  // Строим дерево и вычисляем path  
  const tree \= buildCategoryTree(categories);  
    
  const batch \= firestore.batch();  
  tree.forEach(category \=\> {  
    const ref \= categoriesRef.doc(category.id);  
    batch.update(ref, {  
      path: category.path, // "food/restaurants/fastfood"  
      version: 2,  
      migratedAt: new Date()  
    });  
  });  
    
  await batch.commit();  
}

function buildCategoryTree(categories) {  
  const map \= {};  
  const roots \= \[\];  
    
  // Сначала создаем map  
  categories.forEach(cat \=\> {  
    map\[cat.id\] \= { ...cat, children: \[\] };  
  });  
    
  // Строим дерево  
  categories.forEach(cat \=\> {  
    if (cat.parentId && map\[cat.parentId\]) {  
      map\[cat.parentId\].children.push(map\[cat.id\]);  
    } else {  
      roots.push(map\[cat.id\]);  
    }  
  });  
    
  // Вычисляем path для каждого  
  function setPath(node, parentPath \= '') {  
    const currentPath \= parentPath ? \`${parentPath}/${node.name}\` : node.name;  
    node.path \= currentPath.toLowerCase().replace(/\[^a-z0-9/\]/g, '');  
      
    node.children.forEach(child \=\> {  
      setPath(child, currentPath);  
    });  
  }  
    
  roots.forEach(root \=\> setPath(root));  
  return Object.values(map);  
}

#### Сценарий 2: Изменение структуры тегов (массив → подколлекция)

javascript  
async function migrateTagsStructure(userId) {  
  const operationsRef \= firestore  
    .collection('users').doc(userId)  
    .collection('operations');  
    
  // 1\. Собираем все уникальные теги из операций  
  const snapshot \= await operationsRef.get();  
  const allTags \= new Set();  
    
  snapshot.docs.forEach(doc \=\> {  
    const data \= doc.data();  
    if (data.tags && Array.isArray(data.tags)) {  
      data.tags.forEach(tag \=\> allTags.add(tag));  
    }  
  });  
    
  // 2\. Создаем документы тегов  
  const tagsRef \= firestore  
    .collection('users').doc(userId)  
    .collection('tags');  
    
  const tagMap \= {};  
  for (let tagName of allTags) {  
    const tagDoc \= await tagsRef.add({  
      name: tagName,  
      usageCount: 0,  
      createdAt: new Date(),  
      version: 1  
    });  
    tagMap\[tagName\] \= tagDoc.id;  
  }  
    
  // 3\. Обновляем операции \- добавляем tagIds вместо tags  
  const batch \= firestore.batch();  
  snapshot.docs.forEach(doc \=\> {  
    const data \= doc.data();  
    if (data.tags && Array.isArray(data.tags) && \!data.tagIds) {  
      const tagIds \= data.tags  
        .map(tag \=\> tagMap\[tag\])  
        .filter(id \=\> id);  
        
      batch.update(doc.ref, {  
        tagIds: tagIds,  
        // Сохраняем старые теги для backward compatibility  
        legacyTags: data.tags,  
        version: 2,  
        migratedAt: new Date()  
      });  
    }  
  });  
    
  await batch.commit();  
}

#### Сценарий 3: Разделение большой коллекции на подколлекции

javascript  
// Старая схема: users/{userId}/data/{docId}  
// Новая схема: users/{userId}/operations/{opId}, /categories/{catId}, etc

async function splitCollections(userId) {  
  const oldRef \= firestore.collection('users').doc(userId).collection('data');  
  const snapshot \= await oldRef.get();  
    
  const operationsBatch \= firestore.batch();  
  const categoriesBatch \= firestore.batch();  
  const accountsBatch \= firestore.batch();  
    
  snapshot.docs.forEach(doc \=\> {  
    const data \= doc.data();  
      
    // Определяем тип по полю type или другим признакам  
    if (data.type \=== 'operation' || data.amount \!== undefined) {  
      const newRef \= firestore  
        .collection('users').doc(userId)  
        .collection('operations')  
        .doc(doc.id);  
      operationsBatch.set(newRef, { ...data, migratedFrom: 'data' });  
        
    } else if (data.parentId \!== undefined || data.categoryType) {  
      const newRef \= firestore  
        .collection('users').doc(userId)  
        .collection('categories')  
        .doc(doc.id);  
      categoriesBatch.set(newRef, { ...data, migratedFrom: 'data' });  
        
    } else if (data.currency \!== undefined && data.balance \!== undefined) {  
      const newRef \= firestore  
        .collection('users').doc(userId)  
        .collection('accounts')  
        .doc(doc.id);  
      accountsBatch.set(newRef, { ...data, migratedFrom: 'data' });  
    }  
  });  
    
  // Выполняем все batch  
  await Promise.all(\[  
    operationsBatch.commit(),  
    categoriesBatch.commit(),  
    accountsBatch.commit()  
  \]);  
    
  // Помечаем старые документы как мигрированные  
  const cleanupBatch \= firestore.batch();  
  snapshot.docs.forEach(doc \=\> {  
    cleanupBatch.update(doc.ref, {  
      migratedToNewSchema: true,  
      migrationDate: new Date()  
    });  
  });  
    
  await cleanupBatch.commit();  
}

### 🔄 Миграция в реальном времени с Service Worker

javascript  
// service-worker.js \- миграция при первом открытии после обновления  
self.addEventListener('message', event \=\> {  
  if (event.data.type \=== 'CHECK\_MIGRATION') {  
    event.waitUntil(checkAndMigrate());  
  }  
});

async function checkAndMigrate() {  
  // Проверяем версию схемы  
  const currentVersion \= await getCurrentSchemaVersion();  
  const latestVersion \= 2; // из манифеста или с сервера  
    
  if (currentVersion \< latestVersion) {  
    // Запрашиваем миграцию у основного потока  
    const clients \= await self.clients.matchAll();  
    clients.forEach(client \=\> {  
      client.postMessage({  
        type: 'MIGRATION\_REQUIRED',  
        fromVersion: currentVersion,  
        toVersion: latestVersion  
      });  
    });  
  }  
}

### 📊 Миграция агрегированных данных

javascript  
async function migrateAggregatedData(userId) {  
  // Старая агрегация: operations с groupBy на клиенте  
  // Новая: предварительно вычисленные daily\_summaries  
    
  const operationsRef \= firestore  
    .collection('users').doc(userId)  
    .collection('operations');  
    
  // Получаем операции по месяцам  
  const snapshot \= await operationsRef  
    .where('date', '\>=', startOfYear)  
    .get();  
    
  // Группируем по дням  
  const byDay \= {};  
  snapshot.docs.forEach(doc \=\> {  
    const data \= doc.data();  
    const dayKey \= data.date.toDate().toISOString().split('T')\[0\]; // "2024-01-15"  
      
    if (\!byDay\[dayKey\]) {  
      byDay\[dayKey\] \= {  
        income: 0,  
        expense: 0,  
        operations: \[\]  
      };  
    }  
      
    if (data.type \=== 'income') {  
      byDay\[dayKey\].income \+= data.amount;  
    } else {  
      byDay\[dayKey\].expense \+= data.amount;  
    }  
      
    byDay\[dayKey\].operations.push(doc.id);  
  });  
    
  // Сохраняем агрегированные данные  
  const summariesRef \= firestore  
    .collection('users').doc(userId)  
    .collection('daily\_summaries');  
    
  const batch \= firestore.batch();  
  Object.entries(byDay).forEach((\[date, summary\]) \=\> {  
    const docRef \= summariesRef.doc(date);  
    batch.set(docRef, {  
      date: new Date(date),  
      totalIncome: summary.income,  
      totalExpense: summary.expense,  
      operationCount: summary.operations.length,  
      operationIds: summary.operations,  
      version: 1,  
      generatedAt: new Date()  
    });  
  });  
    
  await batch.commit();  
}

### 🚨 План отката

javascript  
// Функция отката миграции  
exports.rollbackMigration \= functions.https.onCall(async (data, context) \=\> {  
  const userId \= context.auth.uid;  
  const { targetVersion } \= data;  
    
  // 1\. Блокируем новые записи  
  await firestore.doc(\`users/${userId}/migration-lock\`).set({  
    locked: true,  
    reason: 'rollback',  
    timestamp: new Date()  
  });  
    
  // 2\. Восстанавливаем из backup (храним snapshot до миграции)  
  const backup \= await firestore  
    .doc(\`users/${userId}/migration-backups/v${targetVersion}\`)  
    .get();  
    
  if (backup.exists) {  
    const backupData \= backup.data();  
      
    // Восстанавливаем каждую коллекцию  
    for (const \[collectionName, documents\] of Object.entries(backupData)) {  
      const collRef \= firestore  
        .collection('users').doc(userId)  
        .collection(collectionName);  
        
      const batch \= firestore.batch();  
      documents.forEach(doc \=\> {  
        batch.set(collRef.doc(doc.id), doc.data);  
      });  
        
      await batch.commit();  
    }  
  }  
    
  // 3\. Обновляем версию схемы  
  await firestore.doc(\`users/${userId}/settings/schema\`).set({  
    version: targetVersion,  
    rollbackDate: new Date(),  
    previousVersion: targetVersion \+ 1  
  });  
    
  // 4\. Разблокируем  
  await firestore.doc(\`users/${userId}/migration-lock\`).delete();  
    
  return { success: true, message: \`Rollback to v${targetVersion} completed\` };  
});

// Создание backup перед миграцией  
async function createMigrationBackup(userId, version) {  
  const collections \= \['operations', 'categories', 'accounts', 'templates'\];  
  const backup \= {};  
    
  for (const collName of collections) {  
    const snapshot \= await firestore  
      .collection('users').doc(userId)  
      .collection(collName)  
      .get();  
      
    backup\[collName\] \= snapshot.docs.map(doc \=\> ({  
      id: doc.id,  
      data: doc.data()  
    }));  
  }  
    
  await firestore  
    .doc(\`users/${userId}/migration-backups/v${version}\`)  
    .set({  
      ...backup,  
      createdAt: new Date(),  
      recordCount: Object.values(backup).flat().length  
    });  
}

### Мониторинг миграции

javascript  
// Дашборд миграции в Firestore  
const migrationDashboard \= {  
  users: {  
    total: 1000,  
    migrated: 750,  
    pending: 250,  
    failed: 5  
  },  
    
  collections: {  
    operations: {  
      total: 150000,  
      migrated: 145000,  
      avgTimePer1000: '45s'  
    },  
    categories: {  
      total: 5000,  
      migrated: 5000  
    }  
  },  
    
  errors: \[  
    {  
      userId: 'user123',  
      error: 'Invalid category reference',  
      documentId: 'op456',  
      timestamp: '2024-01-15T10:30:00Z',  
      resolved: false  
    }  
  \],  
    
  performance: {  
    avgMigrationTime: '2.5m',  
    peakConcurrency: 45,  
    successRate: 99.8  
  }  
};

### 🎯 Правила миграции для твоего MVP:

#### Начни с версии схемы с самого начала:

javascript  
// В каждом документе:  
{  
  schemaVersion: 1,  
  createdAt: timestamp,  
  updatedAt: timestamp  
}  
Используй dual-write с дня 1:

javascript  
// Всегда пиши в новую схему, даже если она идентична старой  
function writeOperation(operation) {  
  // Основная запись  
  await newSchema.add(operation);  
    
  // Для совместимости (первые 3 месяца)  
  if (Date.now() \< migrationCutoffDate) {  
    await legacySchema.add(operation);  
  }  
}

#### Миграция по требованию:

javascript  
// При первом открытии после обновления  
useEffect(() \=\> {  
  checkMigrationStatus().then(needsMigration \=\> {  
    if (needsMigration) {  
      // Показываем экран миграции  
      showMigrationScreen();  
        
      // Запускаем фоном  
      startBackgroundMigration().then(() \=\> {  
        // Перезагружаем данные  
        loadData();  
      });  
    }  
  });  
}, \[\]);

#### Имей план B всегда:

javascript  
// Экспорт всех данных перед миграцией  
function exportUserData(userId) {  
  const allData \= await getAllUserData(userId);  
  const blob \= new Blob(\[JSON.stringify(allData)\],   
    { type: 'application/json' });  
    
  // Скачиваем файл  
  const url \= URL.createObjectURL(blob);  
  const a \= document.createElement('a');  
  a.href \= url;  
  a.download \= \`backup-${userId}-${Date.now()}.json\`;  
  a.click();  
    
  // Сохраняем в Storage как backup  
  await firebase.storage().ref(\`backups/${userId}/${Date.now()}.json\`)  
    .put(blob);  
}

# Логика регулярных операций

## Генерация операций

Регулярные операции создаются автоматически через Cloud Function, которая запускается ежедневно в 00:01 UTC.

### Алгоритм генерации:

```javascript
// Cloud Function: generateRecurringOperations
exports.generateRecurringOperations = functions.pubsub
  .schedule('0 1 * * *') // каждый день в 00:01 UTC
  .timeZone('UTC')
  .onRun(async (context) => {
    const today = new Date();
    const users = await getAllActiveUsers();
    
    for (const userId of users) {
      // Получаем все активные регулярные операции
      const templates = await firestore
        .collection(`users/${userId}/templates`)
        .where('isRecurring', '==', true)
        .where('isActive', '==', true)
        .where('nextOccurrence', '<=', today)
        .get();
      
      for (const templateDoc of templates.docs) {
        const template = templateDoc.data();
        
        // Проверяем, нужно ли создать операцию сегодня
        if (shouldGenerateOperation(template, today)) {
          // Создаем операцию
          await createOperationFromTemplate(userId, template, today);
          
          // Обновляем nextOccurrence
          const nextDate = calculateNextOccurrence(template, today);
          await templateDoc.ref.update({
            lastGenerated: today,
            nextOccurrence: nextDate
          });
        }
      }
    }
  });
```

### Обработка пропущенных операций

Если пользователь был оффлайн длительное время:
- Создаются операции за пропущенные периоды
- Статус: `status: 'completed'` с пометкой `isBackfilled: true`
- В UI можно фильтровать такие операции

### Изменение шаблона

При изменении регулярной операции:
- **Будущие операции**: создаются с новыми данными
- **Прошлые операции**: остаются без изменений (историческая точность)
- **Текущая операция**: можно обновить вручную

### Отключение регулярной операции

При отключении (`isActive: false`):
- Удаляются только будущие запланированные операции
- Прошлые операции остаются в истории

# Логика работы с тегами

## Обновление usageCount

При создании, обновлении или удалении операции автоматически обновляется счетчик использования тегов через Cloud Function.

### Cloud Function для обновления тегов

```javascript
// Обновление usageCount при создании/обновлении операции
exports.updateTagUsage = functions.firestore
  .document('users/{userId}/operations/{operationId}')
  .onWrite(async (change, context) => {
    const { userId } = context.params;
    const before = change.before.exists ? change.before.data() : null;
    const after = change.after.exists ? change.after.data() : null;
    
    const beforeTagIds = before?.tagIds || [];
    const afterTagIds = after?.tagIds || [];
    
    // Находим теги, которые нужно обновить
    const tagsToIncrement = afterTagIds.filter(id => !beforeTagIds.includes(id));
    const tagsToDecrement = beforeTagIds.filter(id => !afterTagIds.includes(id));
    
    const batch = firestore.batch();
    
    // Увеличиваем счетчик для новых тегов
    for (const tagId of tagsToIncrement) {
      const tagRef = firestore.doc(`users/${userId}/tags/${tagId}`);
      batch.update(tagRef, {
        usageCount: firebase.firestore.FieldValue.increment(1),
        lastUsed: new Date()
      });
    }
    
    // Уменьшаем счетчик для удаленных тегов
    for (const tagId of tagsToDecrement) {
      const tagRef = firestore.doc(`users/${userId}/tags/${tagId}`);
      batch.update(tagRef, {
        usageCount: firebase.firestore.FieldValue.increment(-1)
      });
    }
    
    await batch.commit();
  });
```

### Создание тега при первом использовании

Если пользователь вводит новый тег в операции, который еще не существует в справочнике:

```javascript
// На клиенте или через Cloud Function
async function getOrCreateTag(userId, tagName) {
  // Ищем существующий тег
  const existingTag = await firestore
    .collection(`users/${userId}/tags`)
    .where('name', '==', tagName)
    .where('isArchived', '==', false)
    .limit(1)
    .get();
  
  if (!existingTag.empty) {
    return existingTag.docs[0].id;
  }
  
  // Создаем новый тег
  const newTagRef = await firestore
    .collection(`users/${userId}/tags`)
    .add({
      userId,
      name: tagName,
      color: generateRandomColor(), // или дефолтный цвет
      description: '',
      isArchived: false,
      usageCount: 0, // будет обновлен при создании операции
      createdAt: new Date(),
      updatedAt: new Date()
    });
  
  return newTagRef.id;
}
```

### Автодополнение тегов

При вводе тега в форме операции:
- Поиск по первым буквам в справочнике тегов пользователя
- Сортировка по `usageCount DESC` (часто используемые первыми)
- Показ только неархивных тегов

### Архивация неиспользуемых тегов

Cloud Function для автоматической архивации тегов, которые не использовались более 1 года:

```javascript
exports.archiveUnusedTags = functions.pubsub
  .schedule('0 3 1 * *') // первый день месяца в 03:00
  .onRun(async () => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    // Получаем всех пользователей
    const users = await getAllActiveUsers();
    
    for (const userId of users) {
      const unusedTags = await firestore
        .collection(`users/${userId}/tags`)
        .where('isArchived', '==', false)
        .where('usageCount', '==', 0)
        .where('createdAt', '<', oneYearAgo)
        .get();
      
      const batch = firestore.batch();
      unusedTags.docs.forEach(doc => {
        batch.update(doc.ref, {
          isArchived: true,
          archivedAt: new Date()
        });
      });
      
      if (!unusedTags.empty) {
        await batch.commit();
      }
    }
  });
```

# Стратегия синхронизации и конфликт-резолюция

## Принципы синхронизации

### Optimistic Concurrency Control

Используется версионирование документов для предотвращения конфликтов при одновременном редактировании с разных устройств.

### Стратегия разрешения конфликтов

**Last-Write-Wins с метаданными:**
- При конфликте версий побеждает последняя запись (по timestamp)
- Сохраняются метаданные: `deviceId`, `updatedBy`, `updatedAt`
- Для критичных операций (баланс) - ручное разрешение конфликтов

**Автоматическое разрешение:**
- Для обычных операций - автоматическое слияние изменений
- Для критичных полей (сумма, дата) - последнее изменение побеждает
- Для некритичных полей (описание, теги) - объединение изменений

## Реализация

### Функция обновления с проверкой версии

```typescript
async function updateOperationWithConflictCheck(
  userId: string,
  operationId: string,
  updates: Partial<Operation>
): Promise<Operation> {
  const docRef = firestore.doc(`users/${userId}/operations/${operationId}`);
  
  // Используем транзакцию для атомарного обновления
  return await firestore.runTransaction(async (transaction) => {
    const docSnap = await transaction.get(docRef);
    
    if (!docSnap.exists) {
      throw new Error('Operation not found');
    }
    
    const currentData = docSnap.data() as Operation;
    const currentVersion = currentData.version || 1;
    
    // Проверяем версию
    if (updates.expectedVersion && currentVersion !== updates.expectedVersion) {
      // Конфликт версий - применяем стратегию разрешения
      return resolveConflict(currentData, updates);
    }
    
    // Обновляем с увеличением версии
    const updatedData: Operation = {
      ...currentData,
      ...updates,
      version: currentVersion + 1,
      updatedAt: new Date(),
      updatedBy: getCurrentDeviceId()
    };
    
    transaction.update(docRef, updatedData);
    return updatedData;
  });
}
```

### Разрешение конфликтов

```typescript
function resolveConflict(
  current: Operation,
  incoming: Partial<Operation>
): Operation {
  // Стратегия: Last-Write-Wins для критичных полей
  // Объединение для некритичных полей
  
  const resolved: Operation = {
    ...current,
    ...incoming,
    // Критичные поля - берем из последнего изменения
    amount: incoming.amount ?? current.amount,
    date: incoming.date ?? current.date,
    type: incoming.type ?? current.type,
    accountId: incoming.accountId ?? current.accountId,
    
    // Некритичные поля - объединяем
    description: mergeDescriptions(current.description, incoming.description),
    tagIds: mergeArrays(current.tagIds, incoming.tagIds),
    
    // Метаданные
    version: Math.max(current.version || 1, (incoming.expectedVersion || 0)) + 1,
    updatedAt: new Date(),
    updatedBy: getCurrentDeviceId(),
    conflictResolved: true,
    conflictResolvedAt: new Date()
  };
  
  return resolved;
}

function mergeDescriptions(current: string, incoming?: string): string {
  if (!incoming) return current;
  if (!current) return incoming;
  if (current === incoming) return current;
  
  // Объединяем описания, если они разные
  return `${current} | ${incoming}`;
}

function mergeArrays<T>(current: T[], incoming?: T[]): T[] {
  if (!incoming) return current;
  if (!current) return incoming;
  
  // Объединяем массивы без дубликатов
  return [...new Set([...current, ...incoming])];
}
```

### Обработка конфликтов баланса счетов

Для критичных операций (изменение баланса) требуется ручное разрешение:

```typescript
async function updateAccountBalanceWithConflictCheck(
  userId: string,
  accountId: string,
  amount: number,
  type: 'income' | 'expense'
): Promise<void> {
  const accountRef = firestore.doc(`users/${userId}/accounts/${accountId}`);
  
  return await firestore.runTransaction(async (transaction) => {
    const accountSnap = await transaction.get(accountRef);
    const account = accountSnap.data() as Account;
    
    // Проверяем, не было ли изменений баланса с другого устройства
    const lastUpdate = account.lastBalanceUpdate?.toMillis() || 0;
    const now = Date.now();
    
    if (now - lastUpdate < 1000) {
      // Изменение в течение последней секунды - возможен конфликт
      // Логируем для ручного разрешения
      await logBalanceConflict(userId, accountId, account.balance, amount, type);
    }
    
    const newBalance = type === 'income' 
      ? account.balance + amount 
      : account.balance - amount;
    
    transaction.update(accountRef, {
      balance: newBalance,
      lastBalanceUpdate: new Date(),
      balanceLastValidated: null // требуется пересчет
    });
  });
}
```

### UI для отображения конфликтов

При обнаружении конфликта показываем пользователю:

```typescript
interface ConflictResolution {
  operationId: string;
  currentVersion: Operation;
  incomingVersion: Partial<Operation>;
  conflictFields: string[];
  resolution: 'auto' | 'manual' | 'pending';
}

// Показываем уведомление о конфликте
function showConflictNotification(conflict: ConflictResolution) {
  // Уведомление с возможностью выбора версии
  // Автоматическое разрешение для некритичных конфликтов
  // Ручное разрешение для критичных (баланс)
}
```

### Очередь синхронизации

Для оффлайн-операций используется очередь с приоритетами:

```typescript
interface SyncQueueItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  collection: string;
  documentId?: string;
  data: any;
  priority: number; // 1 - высокий, 5 - низкий
  retryCount: number;
  createdAt: Date;
}

// Приоритеты:
// 1 - Критичные операции (изменение баланса)
// 2 - Создание операций
// 3 - Обновление операций
// 4 - Удаление операций
// 5 - Обновление справочников
```

### Обработка оффлайн-конфликтов

При синхронизации после оффлайн-периода:

```typescript
async function syncOfflineOperations(userId: string) {
  const queue = await getSyncQueue(userId);
  
  // Сортируем по приоритету
  queue.sort((a, b) => a.priority - b.priority);
  
  for (const item of queue) {
    try {
      await processSyncItem(userId, item);
      await removeFromQueue(item.id);
    } catch (error) {
      if (error.code === 'conflict') {
        // Конфликт версий - применяем стратегию разрешения
        await resolveSyncConflict(userId, item, error);
      } else {
        // Другая ошибка - увеличиваем счетчик повторов
        item.retryCount++;
        if (item.retryCount < 3) {
          await updateSyncQueue(item);
        } else {
          // Превышен лимит повторов - помечаем как ошибку
          await markAsFailed(item, error);
        }
      }
    }
  }
}
```

# Обработка ошибок и синхронизация

## Стратегия retry для оффлайн-операций

### Экспоненциальная задержка

```typescript
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Экспоненциальная задержка: 1s, 2s, 4s
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
```

### Очередь синхронизации с приоритетами

```typescript
class SyncQueue {
  private queue: SyncQueueItem[] = [];
  
  async add(item: SyncQueueItem) {
    this.queue.push(item);
    this.queue.sort((a, b) => a.priority - b.priority);
    await this.saveToLocalStorage();
  }
  
  async process() {
    while (this.queue.length > 0) {
      const item = this.queue[0];
      try {
        await this.executeItem(item);
        this.queue.shift();
      } catch (error) {
        item.retryCount++;
        if (item.retryCount >= 3) {
          await this.markAsFailed(item, error);
          this.queue.shift();
        } else {
          // Перемещаем в конец очереди
          this.queue.push(this.queue.shift()!);
        }
      }
      await this.saveToLocalStorage();
    }
  }
}
```

### Логирование ошибок синхронизации

```typescript
interface SyncError {
  id: string;
  userId: string;
  operation: SyncQueueItem;
  error: {
    message: string;
    code: string;
    stack?: string;
  };
  timestamp: Date;
  resolved: boolean;
}

async function logSyncError(error: SyncError) {
  // Сохраняем локально
  await localDB.syncErrors.add(error);
  
  // Отправляем в Sentry (если онлайн)
  if (navigator.onLine) {
    Sentry.captureException(new Error(error.error.message), {
      tags: {
        syncError: true,
        operationType: error.operation.type
      },
      extra: error
    });
  }
}
```

### UI для отображения статуса синхронизации

```typescript
interface SyncStatus {
  isOnline: boolean;
  pendingOperations: number;
  failedOperations: number;
  lastSyncTime: Date | null;
  isSyncing: boolean;
}

// Компонент статуса синхронизации
function SyncStatusIndicator() {
  const status = useSyncStatus();
  
  return (
    <div className="sync-status">
      {status.isOnline ? (
        status.isSyncing ? (
          <Spinner /> // Синхронизация в процессе
        ) : (
          <CheckIcon /> // Все синхронизировано
        )
      ) : (
        <OfflineIcon /> // Оффлайн режим
      )}
      
      {status.pendingOperations > 0 && (
        <Badge>{status.pendingOperations}</Badge>
      )}
      
      {status.failedOperations > 0 && (
        <ErrorBadge onClick={showFailedOperations}>
          {status.failedOperations} ошибок
        </ErrorBadge>
      )}
    </div>
  );
}
```

# PWA Implementation

## Стратегия кеширования

### Cache-first для статики

```typescript
// service-worker.js
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Статика (JS, CSS, изображения)
  if (url.pathname.startsWith('/static/') || 
      url.pathname.match(/\.(js|css|png|jpg|svg)$/)) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(fetchResponse => {
          const cache = caches.open('static-v1');
          cache.then(c => c.put(event.request, fetchResponse.clone()));
          return fetchResponse;
        });
      })
    );
  }
});
```

### Network-first для данных Firestore

```typescript
// Для данных Firestore используем network-first
if (url.pathname.includes('/firestore.googleapis.com/')) {
  event.respondWith(
    fetch(event.request).catch(() => {
      // Если сеть недоступна, пытаемся из кеша
      return caches.match(event.request);
    })
  );
}
```

### Background sync для операций

```typescript
// Регистрация background sync
async function registerBackgroundSync() {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    const registration = await navigator.serviceWorker.ready;
    
    await registration.sync.register('sync-operations');
  }
}

// Обработка в service worker
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-operations') {
    event.waitUntil(syncPendingOperations());
  }
});
```

### Update prompt для пользователя

```typescript
// Проверка обновлений Service Worker
let newWorker: ServiceWorker | null = null;

function checkForUpdates() {
  navigator.serviceWorker.ready.then(registration => {
    registration.update();
  });
}

navigator.serviceWorker.addEventListener('controllerchange', () => {
  // Новый Service Worker активирован
  if (newWorker) {
    newWorker.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }
});

// Показываем уведомление о доступном обновлении
function showUpdatePrompt() {
  const shouldUpdate = confirm('Доступна новая версия приложения. Обновить?');
  if (shouldUpdate) {
    window.location.reload();
  }
}
```

### Размер кеша

- **Статика:** максимум 50MB
- **Firestore данные:** максимум 100MB (с автоматической очисткой старых данных)
- **Изображения:** максимум 20MB

### Стратегия обновления Service Worker

1. **Установка:** новый SW устанавливается в фоне
2. **Активация:** после закрытия всех вкладок или через 24 часа
3. **Уведомление:** пользователю показывается предложение обновить

# Тестирование

## Стратегия тестирования

### Unit тесты (Jest)

**Бизнес-логика:**
```typescript
describe('Account Balance Calculation', () => {
  it('should calculate balance correctly for income', () => {
    const account = { balance: 1000, initialBalance: 0 };
    const operation = { type: 'income', amount: 500 };
    const result = calculateNewBalance(account, operation);
    expect(result).toBe(1500);
  });
  
  it('should calculate balance correctly for expense', () => {
    const account = { balance: 1000, initialBalance: 0 };
    const operation = { type: 'expense', amount: 300 };
    const result = calculateNewBalance(account, operation);
    expect(result).toBe(700);
  });
});

describe('Recurring Operations', () => {
  it('should calculate next occurrence correctly', () => {
    const template = {
      recurrence: { type: 'monthly', dayOfMonth: 15 },
      lastGenerated: new Date('2024-01-15')
    };
    const next = calculateNextOccurrence(template);
    expect(next.getDate()).toBe(15);
    expect(next.getMonth()).toBe(1); // Февраль
  });
});
```

**Покрытие:** минимум 80% для бизнес-логики

### Integration тесты

**Синхронизация Firestore:**
```typescript
describe('Firestore Sync', () => {
  it('should sync operations when online', async () => {
    const operation = createTestOperation();
    await addOperation(operation);
    
    // Проверяем, что операция появилась в Firestore
    const doc = await firestore
      .collection(`users/${userId}/operations`)
      .doc(operation.id)
      .get();
    
    expect(doc.exists).toBe(true);
  });
  
  it('should queue operations when offline', async () => {
    // Симулируем оффлайн
    mockNavigatorOnLine(false);
    
    const operation = createTestOperation();
    await addOperation(operation);
    
    // Проверяем, что операция в очереди
    const queue = await getSyncQueue();
    expect(queue).toContainEqual(expect.objectContaining({ id: operation.id }));
  });
});
```

### E2E тесты (Playwright)

**Критичные сценарии:**
```typescript
test('добавление операции', async ({ page }) => {
  await page.goto('/');
  await page.click('button:has-text("Добавить расход")');
  await page.fill('input[name="amount"]', '1000');
  await page.selectOption('select[name="category"]', 'food');
  await page.click('button:has-text("Сохранить")');
  
  // Проверяем, что операция появилась в списке
  await expect(page.locator('.operation-item')).toContainText('1000');
});

test('отчет за месяц', async ({ page }) => {
  await page.goto('/reports');
  await page.selectOption('select[name="period"]', 'month');
  await page.click('button:has-text("Показать")');
  
  // Проверяем наличие данных
  await expect(page.locator('.report-summary')).toBeVisible();
});
```

### Оффлайн-тесты

```typescript
test('работа в оффлайн режиме', async ({ page, context }) => {
  // Переводим в оффлайн
  await context.setOffline(true);
  
  await page.goto('/');
  
  // Проверяем, что приложение работает
  await page.click('button:has-text("Добавить расход")');
  await page.fill('input[name="amount"]', '500');
  await page.click('button:has-text("Сохранить")');
  
  // Проверяем, что операция сохранена локально
  const operations = await page.evaluate(() => {
    return localStorage.getItem('operations');
  });
  expect(JSON.parse(operations)).toHaveLength(1);
  
  // Включаем онлайн
  await context.setOffline(false);
  
  // Проверяем синхронизацию
  await page.waitForSelector('.sync-status:has-text("Синхронизировано")');
});
```

# Мониторинг и аналитика

## Firebase Performance Monitoring

```typescript
import { getPerformance } from 'firebase/performance';

const perf = getPerformance();

// Отслеживание времени загрузки
const trace = perf.trace('operation_create');
trace.start();

await createOperation(data);

trace.stop();
```

## Custom метрики

```typescript
// Время синхронизации
function trackSyncTime(duration: number) {
  analytics.logEvent('sync_duration', { duration });
}

// Количество оффлайн-операций
function trackOfflineOperations(count: number) {
  analytics.logEvent('offline_operations_count', { count });
}

// Ошибки синхронизации
function trackSyncError(error: Error) {
  analytics.logEvent('sync_error', {
    error_message: error.message,
    error_code: error.code
  });
}
```

## Google Analytics (опционально)

```typescript
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics();

// Отслеживание действий пользователя
logEvent(analytics, 'operation_created', {
  type: 'expense',
  amount: 1000,
  category: 'food'
});
```

# Импорт/Экспорт данных

## Экспорт в CSV

### Формат CSV

```typescript
function exportToCSV(operations: Operation[]): string {
  const headers = [
    'Дата',
    'Тип',
    'Сумма',
    'Валюта',
    'Категория',
    'Счет',
    'Проект',
    'Теги',
    'Описание'
  ];
  
  const rows = operations.map(op => [
    formatDate(op.date),
    op.type,
    op.amount.toString(),
    op.currency,
    op.categoryId,
    op.accountId,
    op.projectId || '',
    op.tagIds.join(';'),
    op.description || ''
  ]);
  
  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
}
```

### Экспорт с шаблоном Google Sheets

```typescript
async function exportToGoogleSheets(operations: Operation[]) {
  const csv = exportToCSV(operations);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  // Генерируем ссылку на Google Sheets
  const sheetsUrl = `https://docs.google.com/spreadsheets/d/create?usp=sharing&importFormat=csv`;
  
  // Открываем в новой вкладке
  window.open(sheetsUrl);
}
```

## Импорт данных

### Валидация при импорте

```typescript
interface ImportValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  operations: Operation[];
}

function validateImport(csv: string): ImportValidationResult {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  const result: ImportValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    operations: []
  };
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const operation = parseOperation(values, headers);
    
    // Валидация
    if (!operation.date) {
      result.errors.push(`Строка ${i}: отсутствует дата`);
      result.valid = false;
    }
    
    if (!operation.amount || operation.amount <= 0) {
      result.errors.push(`Строка ${i}: неверная сумма`);
      result.valid = false;
    }
    
    // Проверка дубликатов
    if (isDuplicate(operation, result.operations)) {
      result.warnings.push(`Строка ${i}: возможный дубликат`);
    }
    
    result.operations.push(operation);
  }
  
  return result;
}
```

### Preview перед импортом

```typescript
function showImportPreview(validation: ImportValidationResult) {
  return (
    <ImportPreview>
      <Summary>
        Найдено операций: {validation.operations.length}
        {validation.errors.length > 0 && (
          <ErrorCount>Ошибок: {validation.errors.length}</ErrorCount>
        )}
        {validation.warnings.length > 0 && (
          <WarningCount>Предупреждений: {validation.warnings.length}</WarningCount>
        )}
      </Summary>
      
      <OperationsList>
        {validation.operations.map((op, idx) => (
          <OperationPreview key={idx} operation={op} />
        ))}
      </OperationsList>
      
      <Actions>
        <Button onClick={cancelImport}>Отмена</Button>
        <Button 
          onClick={confirmImport} 
          disabled={!validation.valid}
        >
          Импортировать
        </Button>
      </Actions>
    </ImportPreview>
  );
}
```

### Откат импорта

```typescript
async function importOperations(operations: Operation[]) {
  // Сохраняем snapshot перед импортом
  const snapshot = await createSnapshot();
  
  try {
    const batch = firestore.batch();
    operations.forEach(op => {
      const ref = firestore
        .collection(`users/${userId}/operations`)
        .doc();
      batch.set(ref, op);
    });
    
    await batch.commit();
    
    // Сохраняем ID импортированных операций для возможного отката
    await saveImportMetadata({
      operationIds: operations.map(op => op.id),
      snapshotId: snapshot.id,
      importedAt: new Date()
    });
  } catch (error) {
    // Откатываем при ошибке
    await rollbackImport(snapshot);
    throw error;
  }
}

async function rollbackImport(snapshot: Snapshot) {
  // Восстанавливаем из snapshot
  await restoreFromSnapshot(snapshot);
}
```

# Оптимизация Firestore: кеширование

## Client-side кеш агрегаций

### Кеш с TTL

```typescript
interface CachedAggregation {
  data: any;
  timestamp: Date;
  ttl: number; // время жизни в миллисекундах
}

class AggregationCache {
  private cache: Map<string, CachedAggregation> = new Map();
  
  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp.getTime();
    if (age > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  set(key: string, data: any, ttl: number = 3600000) { // 1 час по умолчанию
    this.cache.set(key, {
      data,
      timestamp: new Date(),
      ttl
    });
  }
}
```

### Стратегия: сначала кеш, потом Firestore

```typescript
async function getMonthlyReport(userId: string, month: string) {
  const cacheKey = `report_${userId}_${month}`;
  
  // Проверяем кеш
  const cached = aggregationCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // Запрашиваем из Firestore
  const report = await firestore
    .collection(`users/${userId}/reports`)
    .doc(month)
    .get();
  
  if (report.exists) {
    // Сохраняем в кеш на 1 час
    aggregationCache.set(cacheKey, report.data(), 3600000);
    return report.data();
  }
  
  // Если нет в Firestore, считаем на клиенте (для MVP)
  const calculated = await calculateReportOnClient(userId, month);
  
  // Сохраняем в кеш на 5 минут (временные данные)
  aggregationCache.set(cacheKey, calculated, 300000);
  
  return calculated;
}
```

### Инвалидация кеша

```typescript
function invalidateCache(pattern: string) {
  for (const key of aggregationCache.keys()) {
    if (key.match(pattern)) {
      aggregationCache.delete(key);
    }
  }
}

// Инвалидируем кеш при изменении операций
async function onOperationChanged(operation: Operation) {
  const month = getMonthKey(operation.date);
  invalidateCache(`report_.*_${month}`);
}
```

# Трекер задач

* GitHub Projects  
  * чтобы генерить задачи и пошагово их выполнять сохраняя для истории и в текст коммитов  
  * подключение из cursor

# MVP:

* Операции (приход/расход) \+ категории  
* Оффлайн через Firebase  
* Отчет  
  * доходы/расходы за период (день, неделя, месяц, год).  
* Регулярные операции 

# Дальнейшее развитие

* Ввести несколько бюджетов личные , семейные   
* По фотке чека создавать операцию  
* интеграции по апи  
* Автокатегоризация: ML на клиенте (TensorFlow.js Lite) для предложения категорий  
* Голосовой ввод: Web Speech API для быстрого добавления  
* Шаблоны по геолокации: Привязка шаблонов к местам (дома, работе)  
* 