import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Character, DestinyArmor } from '../types';

export interface ProfileInitialState {
  armor: DestinyArmor[];
  characters: Character[];
}
const initialState: ProfileInitialState = {
  armor: [],
  characters: [],
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfileArmor: (state, action: PayloadAction<DestinyArmor[]>) => {
      state.armor = action.payload;
    },
    updateProfileCharacters: (state, action: PayloadAction<Character[]>) => {
      state.characters = action.payload;
    },
  },
});

export const { updateProfileArmor, updateProfileCharacters } = profileSlice.actions;
export default profileSlice.reducer;
