import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileData } from '../types/d2l-types';

export interface ProfileInitialState {
  profileData: ProfileData;
}

const initialState: ProfileInitialState = {
  profileData: {
    characters: [],
  },
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfileData: (state, action: PayloadAction<ProfileData>) => {
      state.profileData = action.payload;
    },
  },
});

export const { updateProfileData } = profileSlice.actions;

export default profileSlice.reducer;
