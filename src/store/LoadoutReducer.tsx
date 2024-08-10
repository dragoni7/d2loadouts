import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DamageType, Loadout, ManifestPlug } from '../types';
import { DAMAGE_TYPE } from '../lib/bungie_api/Constants';

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
      damageType: 1,
      super: {
        plugItemHash: '',
        socketArrayType: 0,
        socketIndex: 0,
      },
      aspects: [],
      fragments: [],
      classAbility: null,
      meleeAbility: null,
      movementAbility: null,
      grenade: null,
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
    updateSubclassId: (
      state,
      action: PayloadAction<{ damageType: DamageType; itemId: string }>
    ) => {
      state.loadout.subclass = {
        itemId: action.payload.itemId,
        damageType: action.payload.damageType,
        super: {
          plugItemHash: '',
          socketArrayType: 0,
          socketIndex: 0,
        },
        aspects: [],
        fragments: [],
        classAbility: null,
        meleeAbility: null,
        movementAbility: null,
        grenade: null,
      };
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
            socketIndex:
              state.loadout.subclass.aspects.length + state.loadout.subclass.damageType ===
              DAMAGE_TYPE.KINETIC
                ? 7
                : 5,
          }));
          break;
        case 'FRAGMENTS':
          state.loadout.subclass.fragments = mods.map((mod) => ({
            plugItemHash: mod.itemHash,
            socketArrayType: 0,
            socketIndex:
              state.loadout.subclass.fragments.length + state.loadout.subclass.damageType ===
              DAMAGE_TYPE.KINETIC
                ? 9
                : 7,
          }));
          break;
        case 'CLASS_ABILITIES':
          state.loadout.subclass.classAbility = mods[0]
            ? {
                plugItemHash: mods[0].itemHash,
                socketArrayType: 0,
                socketIndex: 1,
              }
            : null;
          break;
        case 'MELEE_ABILITIES':
          state.loadout.subclass.meleeAbility = mods[0]
            ? {
                plugItemHash: mods[0].itemHash,
                socketArrayType: 0,
                socketIndex: 3,
              }
            : null;
          break;
        case 'MOVEMENT_ABILITIES':
          state.loadout.subclass.movementAbility = mods[0]
            ? {
                plugItemHash: mods[0].itemHash,
                socketArrayType: 0,
                socketIndex: 2,
              }
            : null;
          break;
        case 'GRENADES':
          state.loadout.subclass.grenade = mods[0]
            ? {
                plugItemHash: mods[0].itemHash,
                socketArrayType: 0,
                socketIndex: 4,
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
