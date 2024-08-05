export type CharacterClass = 'warlock' | 'hunter' | 'titan' | '';

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

export interface ArmorBySlot {
  helmet: DestinyArmor[];
  arms: DestinyArmor[];
  legs: DestinyArmor[];
  chest: DestinyArmor[];
  classItem: DestinyArmor[];
}

export type SubclassConfig = {
  itemId: string;
  super: Plug;
  abilities: Plug[];
  aspects: Plug[];
  fragments: Plug[];
};

export type Plug = {
  plugItemHash: string;
  socketArrayType: number;
  socketIndex: number;
};

export type Loadout = {
  helmet: DestinyArmor;
  gauntlets: DestinyArmor;
  chestArmor: DestinyArmor;
  legArmor: DestinyArmor;
  classArmor: DestinyArmor;
  helmetMods: Plug[];
  gauntletMods: Plug[];
  chestArmorMods: Plug[];
  legArmorMods: Plug[];
  classArmorMods: Plug[];
  characterId: number;
  subclass: SubclassConfig;
};

export type ProfileData = {
  characters: Character[];
};

export type Character = {
  id: number;
  class: CharacterClass;
  emblem?: Emblem;
  armor: ArmorBySlot;
  subclasses: { [key: number]: string };
};

export type Subclass = {
  instanceId: string;
  itemHash: string;
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

export interface ManifestEntry {
  id: number;
  itemHash: string;
  name: string;
  icon: string;
}

export interface ManifestSubclass extends ManifestEntry {
  screenshot: string;
  damageType: number;
  isOwned: boolean;
  class: CharacterClass;
}

export interface ManifestPlug extends ManifestEntry {
  energyCost: number;
  category: number;
  isOwned: boolean;
}

export interface ManifestArmorMod extends ManifestPlug {
  collectibleHash: number;
}

export interface ManifestArmor extends ManifestEntry {
  isExotic: boolean;
  class: CharacterClass;
  slot: string;
}

export interface ManifestExoticArmor extends ManifestEntry {
  isOwned: boolean;
  class: CharacterClass;
  slot: string;
  collectibleHash: number;
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

export interface ManifestEmblem extends Emblem, ManifestEntry {}
