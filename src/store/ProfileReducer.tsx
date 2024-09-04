import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileData, Character } from '../types/d2l-types';

export interface ProfileInitialState {
  profileData: ProfileData;
  selectedCharacter: Character | null;
}

const initialState: ProfileInitialState = {
  profileData: {
    characters: [],
  },
  selectedCharacter: null,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfileData: (state, action: PayloadAction<ProfileData>) => {
      state.profileData = action.payload;
    },
    updateSelectedCharacter: (state, action: PayloadAction<Character>) => {
      state.selectedCharacter = action.payload;
    },
  },
});

export const { updateProfileData, updateSelectedCharacter } = profileSlice.actions;

export default profileSlice.reducer;
