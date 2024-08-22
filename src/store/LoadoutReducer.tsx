import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Character, DamageType, DestinyArmor, Loadout, Plug, Subclass } from '../types/d2l-types';
import {
  DAMAGE_TYPE,
  EMPTY_ASPECT,
  EMPTY_FRAGMENT,
  EMPTY_MANIFEST_PLUG,
} from '../lib/bungie_api/constants';
import { ManifestArmorStatMod, ManifestPlug } from '../types/manifest-types';

const EMPTY_PLUG: Plug = {
  plugItemHash: '',
  socketArrayType: 0,
  socketIndex: -1,
};

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
    helmetMods: [
      {
        itemHash: 1980618587,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 1078080765,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 1078080765,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 1078080765,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 4173924323,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
    ],
    gauntletMods: [
      {
        itemHash: 1980618587,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 3820147479,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 3820147479,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 3820147479,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 4173924323,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
    ],
    chestArmorMods: [
      {
        itemHash: 1980618587,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 1803434835,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 1803434835,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 1803434835,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 4173924323,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
    ],
    legArmorMods: [
      {
        itemHash: 1980618587,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 2269836811,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 2269836811,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 2269836811,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 4173924323,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
    ],
    classArmorMods: [
      {
        itemHash: 1980618587,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 3200810407,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 3200810407,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 3200810407,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
      {
        itemHash: 4173924323,
        perkName: '',
        perkDescription: '',
        perkIcon: '',
        category: 0,
        isOwned: false,
        name: '',
        icon: '',
      },
    ],
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
      super: EMPTY_MANIFEST_PLUG,
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
      state.loadout.legArmor = action.payload[2];
      state.loadout.chestArmor = action.payload[3];
      state.loadout.classArmor = action.payload[4];
    },
    updateLoadoutArmorMods: (
      state,
      action: PayloadAction<{
        armorType: string;
        slot: number;
        plug: ManifestPlug | ManifestArmorStatMod;
      }>
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
    updateRequiredStatMods: (state, action: PayloadAction<ManifestArmorStatMod[]>) => {
      state.loadout.requiredStatMods = action.payload;
    },
    resetLoadoutArmorMods: (state) => {
      state.loadout.helmetMods = initialState.loadout.helmetMods;
      state.loadout.gauntletMods = initialState.loadout.gauntletMods;
      state.loadout.chestArmorMods = initialState.loadout.chestArmorMods;
      state.loadout.legArmorMods = initialState.loadout.legArmorMods;
      state.loadout.classArmorMods = initialState.loadout.classArmorMods;
    },
    updateSubclass: (
      state,
      action: PayloadAction<{ damageType: DamageType; subclass: Subclass }>
    ) => {
      state.loadout.subclassConfig = {
        subclass: action.payload.subclass,
        damageType: action.payload.damageType,
        super: EMPTY_MANIFEST_PLUG,
        aspects: [EMPTY_ASPECT, EMPTY_ASPECT],
        fragments: [EMPTY_FRAGMENT, EMPTY_FRAGMENT, EMPTY_FRAGMENT, EMPTY_FRAGMENT, EMPTY_FRAGMENT],
        classAbility: null,
        meleeAbility: null,
        movementAbility: null,
        grenade: null,
      };
    },
    updateSubclassMods: (state, action: PayloadAction<{ category: string; mods: any[] }>) => {
      const { category, mods } = action.payload;

      switch (category) {
        case 'SUPERS':
          state.loadout.subclassConfig.super = mods[0] || EMPTY_MANIFEST_PLUG;
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
      state.loadout.subclassConfig = action.payload.equippedLoadout.subclassConfig;
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
