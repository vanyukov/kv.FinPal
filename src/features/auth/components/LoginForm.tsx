import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../hooks/useAuth';
import { LoginSchema, type LoginFormData } from '../schemas/auth.schema';

/**
 * Компонент формы входа.
 * Предоставляет интерфейс для входа через email/пароль и через Google OAuth.
 * Включает валидацию полей через Zod схемы.
 */
export const LoginForm = () => {
  const { signIn, signInWithGoogle, isLoading, error } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});

  /**
   * Обработчик изменения полей формы.
   * Обновляет состояние формы и очищает ошибки валидации для изменяемого поля.
   */
  const handleChange = (field: keyof LoginFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    // Очищаем ошибку валидации для изменяемого поля
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  /**
   * Обработчик отправки формы.
   * Валидирует данные через Zod схему и выполняет вход.
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Валидация через Zod
    const result = LoginSchema.safeParse(formData);
    if (!result.success) {
      const errors: Partial<Record<keyof LoginFormData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as keyof LoginFormData] = err.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    try {
      await signIn(formData.email, formData.password);
    } catch (error) {
      // Ошибка уже обработана в store
    }
  };

  /**
   * Обработчик входа через Google.
   */
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      // Ошибка уже обработана в store
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        maxWidth: 400,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Вход
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange('email')}
        error={!!validationErrors.email}
        helperText={validationErrors.email}
        disabled={isLoading}
        required
        fullWidth
        autoComplete="email"
        aria-label="Email адрес"
      />

      <TextField
        label="Пароль"
        type="password"
        value={formData.password}
        onChange={handleChange('password')}
        error={!!validationErrors.password}
        helperText={validationErrors.password}
        disabled={isLoading}
        required
        fullWidth
        autoComplete="current-password"
        aria-label="Пароль"
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isLoading}
        aria-label="Войти"
      >
        {isLoading ? <CircularProgress size={24} /> : 'Войти'}
      </Button>

      <Divider>или</Divider>

      <Button
        type="button"
        variant="outlined"
        fullWidth
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        startIcon={<GoogleIcon />}
        aria-label="Войти через Google"
      >
        Войти через Google
      </Button>
    </Box>
  );
};

