import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { getAuthInstance } from '@/shared/services/firebase/config';

/**
 * Состояние аутентификации пользователя.
 * Хранит информацию о текущем пользователе и статусе загрузки.
 */
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

/**
 * Действия для работы с аутентификацией.
 */
interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  initialize: () => void;
}

/**
 * Полный тип store для аутентификации.
 */
type AuthStore = AuthState & AuthActions;

/**
 * Store для управления состоянием аутентификации.
 * Использует Zustand с персистентностью для сохранения состояния пользователя.
 * Автоматически отслеживает изменения состояния аутентификации Firebase.
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => {
      let unsubscribe: (() => void) | null = null;

      return {
        user: null,
        isLoading: true,
        error: null,
        isInitialized: false,

        /**
         * Вход пользователя по email и паролю.
         * @param email - Email адрес пользователя
         * @param password - Пароль пользователя
         * @throws {Error} Если вход не удался
         */
        signIn: async (email: string, password: string) => {
          try {
            set({ isLoading: true, error: null });
            const auth = getAuthInstance();
            await signInWithEmailAndPassword(auth, email, password);
            // Состояние пользователя обновится через onAuthStateChanged
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Ошибка при входе';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        /**
         * Регистрация нового пользователя.
         * @param email - Email адрес пользователя
         * @param password - Пароль пользователя
         * @throws {Error} Если регистрация не удалась
         */
        signUp: async (email: string, password: string) => {
          try {
            set({ isLoading: true, error: null });
            const auth = getAuthInstance();
            await createUserWithEmailAndPassword(auth, email, password);
            // Состояние пользователя обновится через onAuthStateChanged
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Ошибка при регистрации';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        /**
         * Вход через Google OAuth.
         * @throws {Error} Если вход не удался
         */
        signInWithGoogle: async () => {
          try {
            set({ isLoading: true, error: null });
            const auth = getAuthInstance();
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            // Состояние пользователя обновится через onAuthStateChanged
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : 'Ошибка при входе через Google';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        /**
         * Выход пользователя из системы.
         */
        logout: async () => {
          try {
            set({ isLoading: true, error: null });
            const auth = getAuthInstance();
            await signOut(auth);
            set({ user: null, isLoading: false });
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Ошибка при выходе';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        /**
         * Устанавливает текущего пользователя.
         * Используется внутренне для обновления состояния при изменении аутентификации.
         * @param user - Объект пользователя Firebase или null
         */
        setUser: (user: User | null) => {
          set({ user, isLoading: false });
        },

        /**
         * Устанавливает статус загрузки.
         * @param isLoading - Флаг загрузки
         */
        setLoading: (isLoading: boolean) => {
          set({ isLoading });
        },

        /**
         * Устанавливает ошибку аутентификации.
         * @param error - Текст ошибки или null
         */
        setError: (error: string | null) => {
          set({ error });
        },

        /**
         * Инициализирует отслеживание состояния аутентификации.
         * Подписывается на изменения состояния аутентификации Firebase.
         * Должна быть вызвана один раз при старте приложения.
         */
        initialize: () => {
          if (get().isInitialized) {
            return;
          }

          try {
            const auth = getAuthInstance();
            set({ isLoading: true, isInitialized: true });

            unsubscribe = onAuthStateChanged(
              auth,
              (user) => {
                get().setUser(user);
              },
              (error) => {
                const errorMessage =
                  error instanceof Error
                    ? error.message
                    : 'Ошибка аутентификации';
                get().setError(errorMessage);
                get().setLoading(false);
              }
            );
          } catch (error) {
            // Если Firebase не настроен, устанавливаем состояние как неавторизованное
            const errorMessage =
              error instanceof Error
                ? error.message
                : 'Ошибка инициализации Firebase';
            console.error('Firebase initialization error:', errorMessage);
            set({
              user: null,
              isLoading: false,
              error: errorMessage,
              isInitialized: true,
            });
          }
        },
      };
    },
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Сохраняем только user, остальное состояние не персистим
        user: state.user,
      }),
    }
  )
);

