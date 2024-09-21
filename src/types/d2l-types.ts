import { ARMOR } from '../lib/bungie_api/constants';
import {
  ManifestArmorMod,
  ManifestArmorStatMod,
  ManifestAspect,
  ManifestPlug,
  ManifestStatPlug,
  ManifestSubclass,
} from './manifest-types';

export type CharacterClass = 'warlock' | 'hunter' | 'titan' | '';

export type DamageType = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type StatName =
  | 'mobility'
  | 'resilience'
  | 'recovery'
  | 'discipline'
  | 'intellect'
  | 'strength';

export type StatModifiers =
  | 'resilienceMod'
  | 'recoveryMod'
  | 'mobilityMod'
  | 'disciplineMod'
  | 'intellectMod'
  | 'strengthMod';

export type ArmorSlot =
  | ARMOR.HELMET
  | ARMOR.GAUNTLETS
  | ARMOR.CHEST_ARMOR
  | ARMOR.LEG_ARMOR
  | ARMOR.CLASS_ARMOR;

export type ArmorModKeys =
  | 'helmetMods'
  | 'gauntletsMods'
  | 'chestArmorMods'
  | 'legArmorMods'
  | 'classArmorMods';

export type Armor = {
  intellect: number;
  discipline: number;
  resilience: number;
  mobility: number;
  strength: number;
  recovery: number;
  instanceHash: string;
  itemHash: string;
  artifice?: boolean;
  masterwork: boolean;
  exotic?: boolean;
  class?: CharacterClass;
  type: string;
  socket?: string;
  location: number;
  icon: string;
  name: string;
};

export type ExoticClassCombo = {
  instanceHashes: string[];
  firstIntrinsicHash: number;
  secondIntrinsicHash: number;
};

export interface ArmorBySlot {
  helmet: Armor[];
  arms: Armor[];
  legs: Armor[];
  chest: Armor[];
  classItem: Armor[];
}

export type SubclassConfig = {
  subclass: Subclass;
  damageType: DamageType;
  super: ManifestPlug;
  aspects: [ManifestAspect, ManifestAspect];
  fragments: ManifestStatPlug[];
  classAbility: ManifestPlug | null;
  meleeAbility: ManifestPlug | null;
  movementAbility: ManifestPlug | null;
  grenade: ManifestPlug | null;
};

export type Plug = {
  plugItemHash: string;
  socketArrayType?: number;
  socketIndex?: number;
};

export type DestinyLoadout = {
  colorHash: number;
  iconHash: number;
  nameHash: number;
  armor: { itemInstanceId: string; plugItemHashes: number[] }[];
  subclass: { itemInstanceId: string; plugItemHashes: number[] };
};

export type Loadout = {
  helmet: Armor;
  gauntlets: Armor;
  chestArmor: Armor;
  legArmor: Armor;
  classArmor: Armor;
  requiredStatMods: { mod: ManifestArmorStatMod; equipped: boolean }[];
  helmetMods: [
    ManifestArmorStatMod,
    ManifestArmorMod,
    ManifestArmorMod,
    ManifestArmorMod,
    ManifestArmorStatMod
  ];
  gauntletsMods: [
    ManifestArmorStatMod,
    ManifestArmorMod,
    ManifestArmorMod,
    ManifestArmorMod,
    ManifestArmorStatMod
  ];
  chestArmorMods: [
    ManifestArmorStatMod,
    ManifestArmorMod,
    ManifestArmorMod,
    ManifestArmorMod,
    ManifestArmorStatMod
  ];
  legArmorMods: [
    ManifestArmorStatMod,
    ManifestArmorMod,
    ManifestArmorMod,
    ManifestArmorMod,
    ManifestArmorStatMod
  ];
  classArmorMods: [
    ManifestArmorStatMod,
    ManifestArmorMod,
    ManifestArmorMod,
    ManifestArmorMod,
    ManifestArmorStatMod
  ];
  characterId: number;
  subclassConfig: SubclassConfig;
};

export interface DecodedLoadoutData {
  selectedExoticItemHash: string;
  selectedValues: {
    [K in StatName]: number;
  };
  statPriority: StatName[];
  characterClass: CharacterClass;
}

export type Character = {
  id: number;
  class: CharacterClass;
  emblem?: Emblem;
  armor: ArmorBySlot;
  subclasses: { [key: number]: SubclassConfig | undefined };
  exoticClassCombos: ExoticClassCombo[];
  loadouts: DestinyLoadout[];
};

export type Emblem = {
  secondaryOverlay: string;
  secondarySpecial: string;
};

export type DestinyMembership = {
  membershipId: string;
  membershipType: number;
  bungieGlobalDisplayName: string;
};

export interface Subclass extends ManifestSubclass {
  instanceId: string;
}

export interface FilteredPermutation {
  permutation: Armor[];
  modsArray: ModsArray;
}

export type ModsArray = {
  mobility: number[];
  resilience: number[];
  recovery: number[];
  discipline: number[];
  intellect: number[];
  strength: number[];
};

export interface FragmentStatModifications {
  mobility: number;
  resilience: number;
  recovery: number;
  discipline: number;
  intellect: number;
  strength: number;
}
