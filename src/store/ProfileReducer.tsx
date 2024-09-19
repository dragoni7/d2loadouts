import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Character, DestinyLoadout } from '../types/d2l-types';

export interface ProfileInitialState {
  characters: Character[];
}

const initialState: ProfileInitialState = {
  characters: [],
};

/**
 * States related to user profile data
 */
export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfileCharacters: (state, action: PayloadAction<Character[]>) => {
      state.characters = action.payload;
    },

    updateCharacter: (
      state,
      action: PayloadAction<{ character: Character; characterIndex: number }>
    ) => {
      state.characters[action.payload.characterIndex] = action.payload.character;
    },

    updateCharacterLoadouts: (
      state,
      action: PayloadAction<{ loadouts: DestinyLoadout[]; characterIndex: number }>
    ) => {
      state.characters[action.payload.characterIndex].loadouts = action.payload.loadouts;
    },
  },
});

export const { updateProfileCharacters, updateCharacter, updateCharacterLoadouts } =
  profileSlice.actions;

export default profileSlice.reducer;
