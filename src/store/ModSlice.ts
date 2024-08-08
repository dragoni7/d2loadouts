// ModSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ManifestPlug, ManifestSubclass } from '../types';

interface ModState {
  mods: { [key: string]: ManifestPlug[] };
}

const initialState: ModState = {
  mods: {
    SUPERS: [],
    CLASS_ABILITIES: [],
    MELEE_ABILITIES: [],
    MOVEMENT_ABILITIES: [],
    ASPECTS: [],
    GRENADES: [],
    FRAGMENTS: [],
  },
};

const modSlice = createSlice({
  name: 'mods',
  initialState,
  reducers: {
    setMods: (state, action: PayloadAction<{ [key: string]: ManifestPlug[] }>) => {
      state.mods = action.payload;
    },
  },
});

export const { setMods } = modSlice.actions;
export default modSlice.reducer;
