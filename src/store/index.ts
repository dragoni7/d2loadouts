import { configureStore } from '@reduxjs/toolkit';
import MembershipReducer from './MembershipReducer';
import ProfileReducer from './ProfileReducer';
import LoadoutReducer from './LoadoutReducer';
import DashboardReducer from './DashboardReducer';

export const store = configureStore({
  reducer: {
    destinyMembership: MembershipReducer,
    profile: ProfileReducer,
    loadoutConfig: LoadoutReducer,
    dashboard: DashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;