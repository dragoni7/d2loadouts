import MembershipReducer from "./MembershipReducer";
import ProfileReducer from "./ProfileReducer";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    membership: MembershipReducer,
    profile: ProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
