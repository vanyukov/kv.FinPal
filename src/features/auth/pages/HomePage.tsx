import { Box, Container, Typography, Button, Paper, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '@/app/routing/routes.config';

/**
 * Главная страница приложения.
 * Показывает приветствие для авторизованных пользователей
 * или ссылку на страницу авторизации для неавторизованных.
 * Отображает индикатор загрузки во время инициализации аутентификации.
 */
export const HomePage = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Показываем индикатор загрузки во время инициализации аутентификации
  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: 3,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="body1" color="text.secondary">
            Загрузка...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: 3,
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            FinPal
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center">
            Ваш помощник в управлении финансами
          </Typography>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Typography variant="body1" paragraph>
              Для продолжения работы необходимо войти в систему
            </Typography>
            <Button
              component={Link}
              to={ROUTES.LOGIN}
              variant="contained"
              size="large"
              fullWidth
              aria-label="Перейти на страницу входа"
            >
              Войти
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 3,
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Добро пожаловать в FinPal!
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center">
          {user?.email && `Вы вошли как: ${user.email}`}
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Typography variant="body1" paragraph>
            Здесь будет главная панель управления вашими финансами
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

