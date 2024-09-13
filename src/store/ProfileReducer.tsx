import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Character } from '../types/d2l-types';

export interface ProfileInitialState {
  characters: Character[];
}

const initialState: ProfileInitialState = {
  characters: [],
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfileCharacters: (state, action: PayloadAction<Character[]>) => {
      state.characters = action.payload;
    },
  },
});

export const { updateProfileCharacters } = profileSlice.actions;

export default profileSlice.reducer;
