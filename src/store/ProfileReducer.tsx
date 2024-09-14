import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Character, DestinyLoadout } from '../types/d2l-types';

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

    updateCharacterLoadouts: (
      state,
      action: PayloadAction<{ loadouts: DestinyLoadout[]; index: number }>
    ) => {
      state.characters[action.payload.index].loadouts = action.payload.loadouts;
    },
  },
});

export const { updateProfileCharacters, updateCharacterLoadouts } = profileSlice.actions;

export default profileSlice.reducer;
