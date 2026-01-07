# Проверка оффлайн-персистентности Firestore

## Способ 1: Проверка через DevTools браузера

1. **Запустите приложение:**
   ```bash
   npm run dev
   ```

2. **Откройте DevTools (F12 или Cmd+Option+I)**

3. **Проверьте консоль:**
   - Сразу при загрузке приложения должно появиться сообщение: `Firestore offline persistence enabled`
   - Сообщение появляется автоматически, так как Firestore инициализируется при старте приложения
   - Если видите предупреждение о множественных вкладках - это нормально (персистентность работает только в одной вкладке)

4. **Проверьте IndexedDB:**
   - Перейдите в DevTools → Application (или Storage) → IndexedDB
   - Должна быть база данных с названием вида `firestore/[project-id]`
   - Внутри должны быть object stores для кеширования данных

5. **Проверьте Network:**
   - Перейдите в DevTools → Network
   - При первом запросе к Firestore должны быть видны запросы к Firebase
   - После загрузки данных они кешируются в IndexedDB

## Способ 2: Практический тест оффлайн-режима

1. **Запустите приложение и откройте в браузере**

2. **Выполните запрос к Firestore** (если есть код для этого):
   - Данные должны загрузиться и отобразиться

3. **Отключите интернет:**
   - В Chrome DevTools: Network → Throttling → Offline
   - Или отключите Wi-Fi/сеть в системе

4. **Попробуйте выполнить тот же запрос:**
   - Данные должны загрузиться из кеша IndexedDB
   - В консоли не должно быть ошибок сети

5. **Включите интернет обратно:**
   - Данные должны синхронизироваться автоматически

## Способ 3: Проверка через код

Создайте временный компонент или выполните в консоли браузера:

```typescript
import { getFirestoreInstance } from '@/shared/services/firebase/config';
import { collection, getDocs, enableNetwork, disableNetwork } from 'firebase/firestore';

const db = getFirestoreInstance();

// Проверка, что персистентность включена
// В консоли должно быть сообщение "Firestore offline persistence enabled"

// Тест оффлайн-режима
async function testOfflinePersistence() {
  try {
    // Отключаем сеть
    await disableNetwork(db);
    console.log('✅ Network disabled');
    
    // Пытаемся прочитать данные (должны быть из кеша)
    const testCollection = collection(db, 'users');
    const snapshot = await getDocs(testCollection);
    console.log('✅ Data read from cache:', snapshot.size, 'documents');
    
    // Включаем сеть обратно
    await enableNetwork(db);
    console.log('✅ Network enabled, sync will happen automatically');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Вызовите testOfflinePersistence() в консоли браузера
```

## Способ 4: Проверка через тесты

Запустите существующие тесты:

```bash
npm run test -- src/shared/services/firebase/__tests__/config.test.ts
```

## Ожидаемые результаты

✅ **Успешная настройка:**
- В консоли: `Firestore offline persistence enabled`
- В IndexedDB есть база данных Firestore
- Данные доступны при отключенном интернете
- Нет ошибок в консоли

❌ **Проблемы:**
- Предупреждение о множественных вкладках - нормально, персистентность работает только в одной вкладке
- Ошибка `unimplemented` - браузер не поддерживает (редко, обычно в старых браузерах)
- Другие ошибки - проверьте конфигурацию Firebase

