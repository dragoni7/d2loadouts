import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Loadout, ManifestPlug } from '../types';

export interface InitialState {
  loadout: Loadout;
}
const initialState: InitialState = {
  loadout: {
    helmet: {
      intellect: 0,
      discipline: 0,
      resilience: 0,
      mobility: 0,
      strength: 0,
      recovery: 0,
      instanceHash: '',
      itemHash: '',
      artifice: undefined,
      masterwork: false,
      exotic: undefined,
      class: undefined,
      type: '',
      socket: undefined,
      location: 0,
      icon: '',
      name: '',
    },
    gauntlets: {
      intellect: 0,
      discipline: 0,
      resilience: 0,
      mobility: 0,
      strength: 0,
      recovery: 0,
      instanceHash: '',
      itemHash: '',
      artifice: undefined,
      masterwork: false,
      exotic: undefined,
      class: undefined,
      type: '',
      socket: undefined,
      location: 0,
      icon: '',
      name: '',
    },
    chestArmor: {
      intellect: 0,
      discipline: 0,
      resilience: 0,
      mobility: 0,
      strength: 0,
      recovery: 0,
      instanceHash: '',
      itemHash: '',
      artifice: undefined,
      masterwork: false,
      exotic: undefined,
      class: undefined,
      type: '',
      socket: undefined,
      location: 0,
      icon: '',
      name: '',
    },
    legArmor: {
      intellect: 0,
      discipline: 0,
      resilience: 0,
      mobility: 0,
      strength: 0,
      recovery: 0,
      instanceHash: '',
      itemHash: '',
      artifice: undefined,
      masterwork: false,
      exotic: undefined,
      class: undefined,
      type: '',
      socket: undefined,
      location: 0,
      icon: '',
      name: '',
    },
    classArmor: {
      intellect: 0,
      discipline: 0,
      resilience: 0,
      mobility: 0,
      strength: 0,
      recovery: 0,
      instanceHash: '',
      itemHash: '',
      artifice: undefined,
      masterwork: false,
      exotic: undefined,
      class: undefined,
      type: '',
      socket: undefined,
      location: 0,
      icon: '',
      name: '',
    },
    helmetMods: [],
    gauntletMods: [],
    chestArmorMods: [],
    legArmorMods: [],
    classArmorMods: [],
    characterId: 0,
    subclass: {
      itemId: '',
      super: {
        plugItemHash: '',
        socketArrayType: 0,
        socketIndex: 0,
      },
      aspects: [],
      fragments: [],
      classAbilities: {
        plugItemHash: '',
        socketArrayType: 0,
        socketIndex: 0,
      },
      meleeAbilities: {
        plugItemHash: '',
        socketArrayType: 0,
        socketIndex: 0,
      },
      movementAbilities: {
        plugItemHash: '',
        socketArrayType: 0,
        socketIndex: 0,
      },
      grenades: {
        plugItemHash: '',
        socketArrayType: 0,
        socketIndex: 0,
      },
    },
  },
};

export const loadoutConfigSlice = createSlice({
  name: 'loadoutConfig',
  initialState,
  reducers: {
    updateLoadoutConfig: (state, action: PayloadAction<Loadout>) => {
      state.loadout = action.payload;
    },
    updateSubclassMods: (
      state,
      action: PayloadAction<{ category: string; mods: ManifestPlug[] }>
    ) => {
      const { category, mods } = action.payload;
      switch (category) {
        case 'SUPERS':
          state.loadout.subclass.super = mods[0]
            ? {
                plugItemHash: mods[0].itemHash,
                socketArrayType: 0,
                socketIndex: 0,
              }
            : {
                plugItemHash: '',
                socketArrayType: 0,
                socketIndex: 0,
              };
          break;
        case 'ASPECTS':
          state.loadout.subclass.aspects = mods.map((mod) => ({
            plugItemHash: mod.itemHash,
            socketArrayType: 0,
            socketIndex: 0,
          }));
          break;
        case 'FRAGMENTS':
          state.loadout.subclass.fragments = mods.map((mod) => ({
            plugItemHash: mod.itemHash,
            socketArrayType: 0,
            socketIndex: 0,
          }));
          break;
        case 'CLASS_ABILITIES':
          state.loadout.subclass.classAbilities = mods[0]
            ? {
                plugItemHash: mods[0].itemHash,
                socketArrayType: 0,
                socketIndex: 0,
              }
            : null;
          break;
        case 'MELEE_ABILITIES':
          state.loadout.subclass.meleeAbilities = mods[0]
            ? {
                plugItemHash: mods[0].itemHash,
                socketArrayType: 0,
                socketIndex: 0,
              }
            : null;
          break;
        case 'MOVEMENT_ABILITIES':
          state.loadout.subclass.movementAbilities = mods[0]
            ? {
                plugItemHash: mods[0].itemHash,
                socketArrayType: 0,
                socketIndex: 0,
              }
            : null;
          break;
        case 'GRENADES':
          state.loadout.subclass.grenades = mods[0]
            ? {
                plugItemHash: mods[0].itemHash,
                socketArrayType: 0,
                socketIndex: 0,
              }
            : null;
          break;
      }
    },
  },
});

export const { updateLoadoutConfig } = loadoutConfigSlice.actions;
export const { updateSubclassMods } = loadoutConfigSlice.actions;
export default loadoutConfigSlice.reducer;
