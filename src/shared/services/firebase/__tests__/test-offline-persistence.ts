/**
 * Утилита для тестирования оффлайн-персистентности Firestore.
 * Используйте эту функцию в консоли браузера для проверки работы оффлайн-режима.
 *
 * @example
 * // В консоли браузера после загрузки приложения:
 * import { testOfflinePersistence } from '@/shared/services/firebase/__tests__/test-offline-persistence';
 * testOfflinePersistence();
 */

import { getFirestoreInstance } from '../config';
import {
  collection,
  getDocs,
  addDoc,
  enableNetwork,
  disableNetwork,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

/**
 * Тестирует оффлайн-персистентность Firestore.
 * Проверяет, что данные доступны при отключенной сети.
 */
export const testOfflinePersistence = async (): Promise<void> => {
  const db = getFirestoreInstance();
  const testCollection = collection(db, 'test-offline');

  console.log('🧪 Начинаем тест оффлайн-персистентности...\n');

  try {
    // Шаг 1: Проверяем онлайн-режим
    console.log('1️⃣ Проверка онлайн-режима...');
    const onlineSnapshot = await getDocs(testCollection);
    console.log(`   ✅ Онлайн: получено ${onlineSnapshot.size} документов\n`);

    // Шаг 2: Отключаем сеть
    console.log('2️⃣ Отключение сети...');
    await disableNetwork(db);
    console.log('   ✅ Сеть отключена\n');

    // Шаг 3: Пытаемся прочитать данные из кеша
    console.log('3️⃣ Чтение данных из кеша (оффлайн)...');
    const offlineSnapshot = await getDocs(testCollection);
    console.log(
      `   ✅ Оффлайн: получено ${offlineSnapshot.size} документов из кеша\n`
    );

    // Шаг 4: Пытаемся записать данные (должны быть в очереди)
    console.log('4️⃣ Запись данных в оффлайн-режиме...');
    const testDoc = await addDoc(testCollection, {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Тест оффлайн-персистентности',
    });
    console.log(`   ✅ Документ добавлен в очередь: ${testDoc.id}\n`);

    // Шаг 5: Включаем сеть обратно
    console.log('5️⃣ Включение сети...');
    await enableNetwork(db);
    console.log('   ✅ Сеть включена, синхронизация началась\n');

    // Шаг 6: Проверяем, что данные синхронизировались
    console.log('6️⃣ Проверка синхронизации...');
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Ждем синхронизации
    const syncedSnapshot = await getDocs(testCollection);
    console.log(
      `   ✅ После синхронизации: ${syncedSnapshot.size} документов\n`
    );

    console.log('✅ Тест оффлайн-персистентности завершен успешно!');
  } catch (error: unknown) {
    console.error('❌ Ошибка при тестировании:', error);
    // Включаем сеть обратно в случае ошибки
    try {
      await enableNetwork(db);
    } catch (enableError) {
      console.error('❌ Не удалось включить сеть:', enableError);
    }
  }
};

/**
 * Проверяет статус оффлайн-персистентности через IndexedDB.
 * Выводит информацию о кешированных данных.
 */
export const checkPersistenceStatus = (): void => {
  if (typeof window === 'undefined') {
    console.warn('⚠️ Проверка доступна только в браузере');
    return;
  }

  console.log('🔍 Проверка статуса оффлайн-персистентности...\n');

  // Проверяем наличие IndexedDB
  if (!window.indexedDB) {
    console.error('❌ IndexedDB не поддерживается в этом браузере');
    return;
  }

  console.log('✅ IndexedDB поддерживается');

  // Пытаемся найти базу данных Firestore
  const dbName = 'firestore';
  const request = indexedDB.open(dbName);

  request.onsuccess = () => {
    const db = request.result;
    console.log(`✅ База данных "${dbName}" найдена`);
    console.log(`   Object stores: ${db.objectStoreNames.length}`);

    // Выводим список object stores
    const stores: string[] = [];
    for (let i = 0; i < db.objectStoreNames.length; i++) {
      stores.push(db.objectStoreNames[i]);
    }
    console.log(`   Stores: ${stores.join(', ')}`);
    db.close();
  };

  request.onerror = () => {
    console.warn(
      `⚠️ База данных "${dbName}" не найдена. Это нормально, если приложение еще не использовало Firestore.`
    );
  };
};

