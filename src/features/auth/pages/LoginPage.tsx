import { Box, Container } from '@mui/material';
import { LoginForm } from '../components/LoginForm';

/**
 * Страница входа в приложение.
 * Отображает форму входа с поддержкой email/пароль и Google OAuth.
 * Использует Material-UI для адаптивного дизайна.
 */
export const LoginPage = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <LoginForm />
      </Box>
    </Container>
  );
};

