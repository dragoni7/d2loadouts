import { createBrowserRouter } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { ProtectedRoute } from '../../lib/bungie_api/Authorization';

export const createRouter = () => {
  return createBrowserRouter([
    {
      path: '/',
      lazy: async () => {
        const { LandingRoute } = await import('./Landing');
        return { Component: LandingRoute };
      },
    },
    {
      path: '/return',
      lazy: async () => {
        const { ReturnRoute } = await import('./Return');
        return { Component: ReturnRoute };
      },
    },
    {
      path: '/app',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
  ]);
};
