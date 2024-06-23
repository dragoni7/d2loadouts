import { createBrowserRouter } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { ProtectedRoute } from '../../lib/AuthService';

export const createRouter = () => {
    return createBrowserRouter ([
        {
            path: '/',
            lazy: async () => {
                const { LandingRoute } = await import ('./Landing')
                return { Component: LandingRoute }
            }
        },
        {
            path: '/app',
            element: (
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            )
        }
    ])
}