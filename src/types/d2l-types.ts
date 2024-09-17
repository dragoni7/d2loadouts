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

export type armor =
  | ARMOR.HELMET
  | ARMOR.GAUNTLETS
  | ARMOR.CHEST_ARMOR
  | ARMOR.LEG_ARMOR
  | ARMOR.CLASS_ARMOR;

export type armorMods =
  | 'helmetMods'
  | 'gauntletsMods'
  | 'chestArmorMods'
  | 'legArmorMods'
  | 'classArmorMods';

export type DestinyArmor = {
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
  helmet: DestinyArmor[];
  arms: DestinyArmor[];
  legs: DestinyArmor[];
  chest: DestinyArmor[];
  classItem: DestinyArmor[];
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
  helmet: DestinyArmor;
  gauntlets: DestinyArmor;
  chestArmor: DestinyArmor;
  legArmor: DestinyArmor;
  classArmor: DestinyArmor;
  requiredStatMods: { mod: ManifestArmorStatMod; equipped: boolean }[];
  helmetMods: (ManifestArmorMod | ManifestArmorStatMod)[];
  gauntletsMods: (ManifestArmorMod | ManifestArmorStatMod)[];
  chestArmorMods: (ManifestArmorMod | ManifestArmorStatMod)[];
  legArmorMods: (ManifestArmorMod | ManifestArmorStatMod)[];
  classArmorMods: (ManifestArmorMod | ManifestArmorStatMod)[];
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
  permutation: DestinyArmor[];
  modsArray: {
    mobility: number[];
    resilience: number[];
    recovery: number[];
    discipline: number[];
    intellect: number[];
    strength: number[];
  };
}

export interface FragmentStatModifications {
  mobility: number;
  resilience: number;
  recovery: number;
  discipline: number;
  intellect: number;
  strength: number;
}
