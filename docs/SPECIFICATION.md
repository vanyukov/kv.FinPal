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
* Международный код   
* Сокращённое название символ

Заполняется загрузкой из онлайн-справочника   
Встроить базовый список из 10 основных валют, обновлять через фон:

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
  lastBalanceUpdate: timestamp  
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
  tags: string\[\],       // массив tag names, НЕ IDs  
    
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
    
  // Данные  
  date: timestamp,      // дата операции  
  description: string,  
  tags: string\[\],       // массив строк, например \["важное", "работа"\]  
    
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

## Правила безопасности Firestore

rules\_version \= '2';  
service cloud.firestore {  
  match /databases/{database}/documents {  
    // Проверка владельца  
    function isOwner(userId) {  
      return request.auth \!= null && request.auth.uid \== userId;  
    }  
      
    // Все пользовательские данные  
    match /users/{userId}/accounts/{accountId} {  
      allow read, write: if isOwner(userId);  
    }  
      
    match /users/{userId}/categories/{categoryId} {  
      allow read, write: if isOwner(userId);  
    }  
      
    match /users/{userId}/operations/{operationId} {  
      allow read, write: if isOwner(userId);  
    }  
      
    match /users/{userId}/templates/{templateId} {  
      allow read, write: if isOwner(userId);  
    }  
      
    match /users/{userId}/tags/{tagId} {  
      allow read, write: if isOwner(userId);  
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
* templates → userId Ascending, isRecurring Ascending, nextOccurrence Ascending

Без этих индексов каждый запрос будет стоить минимум 0.5 секунды и быстро съест дневной лимит\!

## Лимиты и оптимизации

* Не делать collectionGroup запросы — дорого и требует специальных индексов  
* Лимит на документ: 1MB — не храни бинарные данные (чеки храни в Storage)  
* Batch операции при обновлении баланса и статистики  
* Использовать array-contains для тегов вместо array-contains-any (дешевле)

## Стратегия миграции с нулевым downtime

### Принципы миграции

* Backward compatibility \- старый код должен работать с новой схемой  
* Двойная запись во время миграции  
* Миграция на лету при обращении пользователя  
* Откат в один клик

### Фаза 0: Подготовка (всегда)

// 1\. Добавляем поле version в ВСЕ документы  
const addVersionField \= async (collectionName) \=\> {  
  const snapshot \= await firestore.collection(collectionName).get();  
  const batch \= firestore.batch();  
    
  snapshot.docs.forEach(doc \=\> {  
    if (\!doc.data().version) {  
      batch.update(doc.ref, { version: 1 });  
    }  
  });  
    
  await batch.commit();  
};

// 2\. Добавляем миграционный статус в настройки пользователя  
const userMigrationSchema \= {  
  currentSchemaVersion: 1,  
  lastMigration: null,  
  migrationErrors: \[\],  
  needsMigration: false  
};

### Фаза 1: Миграция на месте (для простых изменений)

javascript  
// Пример: Добавляем новое поле "icon" в категории  
const migrateCategoriesV1\_to\_V2 \= async (userId) \=\> {  
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

# конфликт-резолюция

// Функция для обновления с проверкой версии  
async function updateOperationWithConflictCheck(operationId, updates) {  
  const docRef \= firestore.doc(\`users/${userId}/operations/${operationId}\`);  
  const docSnap \= await docRef.get();  
    
  if (\!docSnap.exists) throw new Error('Operation not found');  
    
  const currentData \= docSnap.data();  
    
  // Проверяем версию  
  if (updates.expectedVersion && currentData.version \!== updates.expectedVersion) {  
    throw new Error('Version conflict');  
  }  
    
  // Обновляем с увеличением версии  
  await docRef.update({  
    ...updates,  
    version: (currentData.version || 0\) \+ 1,  
    updatedAt: new Date(),  
    updatedBy: getCurrentDeviceId()  
  });  
}

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