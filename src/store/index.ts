// store.ts
import { configureStore } from '@reduxjs/toolkit';
import MembershipReducer from './MembershipReducer';
import ProfileReducer from './ProfileReducer';
import ModReducer from './ModSlice';
import LoadoutReducer from './LoadoutReducer';

export const store = configureStore({
  reducer: {
    destinyMembership: MembershipReducer,
    profile: ProfileReducer,
    mods: ModReducer,
    loadoutConfig: LoadoutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
