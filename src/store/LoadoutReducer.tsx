import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Character,
  DamageType,
  DestinyArmor,
  Loadout,
  Subclass,
  SubclassConfig,
} from '../types/d2l-types';
import {
  EMPTY_ASPECT,
  EMPTY_FRAGMENT,
  EMPTY_SUBCLASS_MOD,
  EMPTY_SOCKETS,
} from '../lib/bungie_api/constants';
import { ManifestArmorMod, ManifestArmorStatMod } from '../types/manifest-types';

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
    helmetMods: EMPTY_SOCKETS.HELMET,
    gauntletsMods: EMPTY_SOCKETS.GAUNTLETS,
    chestArmorMods: EMPTY_SOCKETS.CHEST_ARMOR,
    legArmorMods: EMPTY_SOCKETS.LEG_ARMOR,
    classArmorMods: EMPTY_SOCKETS.CLASS_ARMOR,
    characterId: 0,
    subclassConfig: {
      subclass: {
        instanceId: '',
        screenshot: '',
        damageType: 0,
        isOwned: false,
        class: '',
        itemHash: 0,
        name: '',
        icon: '',
      },
      damageType: 1,
      super: EMPTY_SUBCLASS_MOD,
      aspects: [EMPTY_ASPECT, EMPTY_ASPECT],
      fragments: [EMPTY_FRAGMENT, EMPTY_FRAGMENT, EMPTY_FRAGMENT, EMPTY_FRAGMENT, EMPTY_FRAGMENT],
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
      state.loadout.chestArmor = action.payload[2];
      state.loadout.legArmor = action.payload[3];
      state.loadout.classArmor = action.payload[4];
    },
    updateLoadoutArmorMods: (
      state,
      action: PayloadAction<{
        armorType: string;
        slot: number;
        plug: ManifestArmorMod | ManifestArmorStatMod;
      }>
    ) => {
      switch (action.payload.armorType) {
        case 'helmet': {
          state.loadout.helmetMods[action.payload.slot] = action.payload.plug;
          break;
        }
        case 'gauntlets': {
          state.loadout.gauntletsMods[action.payload.slot] = action.payload.plug;
          break;
        }
        case 'chestArmor': {
          state.loadout.chestArmorMods[action.payload.slot] = action.payload.plug;
          break;
        }
        case 'legArmor': {
          state.loadout.legArmorMods[action.payload.slot] = action.payload.plug;
          break;
        }
        case 'classArmor': {
          state.loadout.classArmorMods[action.payload.slot] = action.payload.plug;
          break;
        }
      }
    },
    updateRequiredStatMods: (
      state,
      action: PayloadAction<{ mod: ManifestArmorStatMod; equipped: boolean }[]>
    ) => {
      state.loadout.requiredStatMods = action.payload;
    },
    resetLoadoutArmorMods: (state) => {
      state.loadout.helmetMods = initialState.loadout.helmetMods;
      state.loadout.gauntletsMods = initialState.loadout.gauntletsMods;
      state.loadout.chestArmorMods = initialState.loadout.chestArmorMods;
      state.loadout.legArmorMods = initialState.loadout.legArmorMods;
      state.loadout.classArmorMods = initialState.loadout.classArmorMods;
    },
    updateSubclass: (state, action: PayloadAction<{ subclass: SubclassConfig | undefined }>) => {
      if (action.payload.subclass !== undefined) {
        state.loadout.subclassConfig = action.payload.subclass;
      }
    },
    updateSubclassMods: (state, action: PayloadAction<{ category: string; mods: any[] }>) => {
      const { category, mods } = action.payload;

      switch (category) {
        case 'SUPERS':
          state.loadout.subclassConfig.super = mods[0] || EMPTY_SUBCLASS_MOD;
          break;
        case 'ASPECTS':
          mods.forEach((mod, index) => {
            state.loadout.subclassConfig.aspects[index] = mod || EMPTY_ASPECT;
          });
          break;
        case 'FRAGMENTS':
          mods.forEach((mod, index) => {
            state.loadout.subclassConfig.fragments[index] = mod || EMPTY_FRAGMENT;
          });
          break;
        case 'CLASS_ABILITIES':
          state.loadout.subclassConfig.classAbility = mods[0] || null;
          break;
        case 'MELEE_ABILITIES':
          state.loadout.subclassConfig.meleeAbility = mods[0] || null;
          break;
        case 'MOVEMENT_ABILITIES':
          state.loadout.subclassConfig.movementAbility = mods[0] || null;
          break;
        case 'GRENADES':
          state.loadout.subclassConfig.grenade = mods[0] || null;
          break;
        default:
          break;
      }
    },
    updateLoadoutCharacter: (state, action: PayloadAction<Character>) => {
      state.loadout.characterId = action.payload.id;
    },
    resetLoadout: () => initialState,
  },
});

export const {
  updateLoadoutConfig,
  updateLoadoutArmorMods,
  resetLoadoutArmorMods,
  updateRequiredStatMods,
  updateSubclassMods,
  updateSubclass,
  updateLoadoutArmor,
  updateLoadoutCharacter,
  resetLoadout,
} = loadoutConfigSlice.actions;

export default loadoutConfigSlice.reducer;
