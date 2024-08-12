import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DamageType, DestinyArmor, Loadout, ManifestPlug, Plug } from '../types';
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
    requiredStatMods: [],
    helmetMods: {
      0: { plugItemHash: '1980618587', socketArrayType: 0, socketIndex: 0 },
      1: { plugItemHash: '1078080765', socketArrayType: 0, socketIndex: 1 },
      2: { plugItemHash: '1078080765', socketArrayType: 0, socketIndex: 2 },
      3: { plugItemHash: '1078080765', socketArrayType: 0, socketIndex: 3 },
      4: { plugItemHash: '4173924323', socketArrayType: 0, socketIndex: 11 },
    },
    gauntletMods: {
      0: { plugItemHash: '1980618587', socketArrayType: 0, socketIndex: 0 },
      1: { plugItemHash: '3820147479', socketArrayType: 0, socketIndex: 1 },
      2: { plugItemHash: '3820147479', socketArrayType: 0, socketIndex: 2 },
      3: { plugItemHash: '3820147479', socketArrayType: 0, socketIndex: 3 },
      4: { plugItemHash: '4173924323', socketArrayType: 0, socketIndex: 11 },
    },
    chestArmorMods: {
      0: { plugItemHash: '1980618587', socketArrayType: 0, socketIndex: 0 },
      1: { plugItemHash: '1803434835', socketArrayType: 0, socketIndex: 1 },
      2: { plugItemHash: '1803434835', socketArrayType: 0, socketIndex: 2 },
      3: { plugItemHash: '1803434835', socketArrayType: 0, socketIndex: 3 },
      4: { plugItemHash: '4173924323', socketArrayType: 0, socketIndex: 11 },
    },
    legArmorMods: {
      0: { plugItemHash: '1980618587', socketArrayType: 0, socketIndex: 0 },
      1: { plugItemHash: '2269836811', socketArrayType: 0, socketIndex: 1 },
      2: { plugItemHash: '2269836811', socketArrayType: 0, socketIndex: 2 },
      3: { plugItemHash: '2269836811', socketArrayType: 0, socketIndex: 3 },
      4: { plugItemHash: '4173924323', socketArrayType: 0, socketIndex: 11 },
    },
    classArmorMods: {
      0: { plugItemHash: '1980618587', socketArrayType: 0, socketIndex: 0 },
      1: { plugItemHash: '3200810407', socketArrayType: 0, socketIndex: 1 },
      2: { plugItemHash: '3200810407', socketArrayType: 0, socketIndex: 2 },
      3: { plugItemHash: '3200810407', socketArrayType: 0, socketIndex: 3 },
      4: { plugItemHash: '4173924323', socketArrayType: 0, socketIndex: 11 },
    },
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
    updateLoadoutArmor: (state, action: PayloadAction<DestinyArmor[]>) => {
      state.loadout.helmet = action.payload[0];
      state.loadout.gauntlets = action.payload[1];
      state.loadout.legArmor = action.payload[2];
      state.loadout.chestArmor = action.payload[3];
      state.loadout.classArmor = action.payload[4];
    },
    updateLoadoutArmorMods: (
      state,
      action: PayloadAction<{ armorType: string; slot: number; plug: Plug }>
    ) => {
      switch (action.payload.armorType) {
        case 'helmet': {
          state.loadout.helmetMods[action.payload.slot] = action.payload.plug;
          break;
        }
        case 'arms': {
          state.loadout.gauntletMods[action.payload.slot] = action.payload.plug;
          break;
        }
        case 'chest': {
          state.loadout.chestArmorMods[action.payload.slot] = action.payload.plug;
          break;
        }
        case 'legs': {
          state.loadout.legArmorMods[action.payload.slot] = action.payload.plug;
          break;
        }
        case 'classItem': {
          state.loadout.classArmorMods[action.payload.slot] = action.payload.plug;
          break;
        }
      }
    },
    updateRequiredStatMods: (state, action: PayloadAction<Plug[]>) => {
      state.loadout.requiredStatMods = action.payload;
    },
    resetLoadoutArmorMods: (state) => {
      state.loadout.helmetMods = initialState.loadout.helmetMods;
      state.loadout.gauntletMods = initialState.loadout.gauntletMods;
      state.loadout.chestArmorMods = initialState.loadout.chestArmorMods;
      state.loadout.legArmorMods = initialState.loadout.legArmorMods;
      state.loadout.classArmorMods = initialState.loadout.classArmorMods;
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
                plugItemHash: String(mods[0].itemHash),
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
            plugItemHash: String(mods[0].itemHash),
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
            plugItemHash: String(mods[0].itemHash),
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
                plugItemHash: String(mods[0].itemHash),
                socketArrayType: 0,
                socketIndex: 1,
              }
            : null;
          break;
        case 'MELEE_ABILITIES':
          state.loadout.subclass.meleeAbility = mods[0]
            ? {
                plugItemHash: String(mods[0].itemHash),
                socketArrayType: 0,
                socketIndex: 3,
              }
            : null;
          break;
        case 'MOVEMENT_ABILITIES':
          state.loadout.subclass.movementAbility = mods[0]
            ? {
                plugItemHash: String(mods[0].itemHash),
                socketArrayType: 0,
                socketIndex: 2,
              }
            : null;
          break;
        case 'GRENADES':
          state.loadout.subclass.grenade = mods[0]
            ? {
                plugItemHash: String(mods[0].itemHash),
                socketArrayType: 0,
                socketIndex: 4,
              }
            : null;
          break;
      }
    },
  },
});

export const {
  updateLoadoutConfig,
  updateLoadoutArmorMods,
  resetLoadoutArmorMods,
  updateRequiredStatMods,
  updateSubclassMods,
  updateSubclassId,
  updateLoadoutArmor,
} = loadoutConfigSlice.actions;

export default loadoutConfigSlice.reducer;
