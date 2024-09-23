import { RouterProvider } from 'react-router-dom';
import { useMemo } from 'react';
import { createRouter } from './routes';
import { Provider } from 'react-redux';
import { store } from '../store';
import { createTheme, ThemeProvider } from '@mui/material';

const AppRouter = () => {
  const router = useMemo(() => createRouter(), []);

  return <RouterProvider router={router} />;
};

const theme = createTheme({
  typography: {
    fontFamily: ['Helvetica'].join(','),
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 2000,
      xl: 3000,
    },
  },
  palette: {
    mode: 'dark',
    background: {},
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </ThemeProvider>
  );
}

export default App;
