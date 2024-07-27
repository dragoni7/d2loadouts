export type CharacterClass = 'warlock' | 'hunter' | 'titan';

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
  // TODO: name, icon, etc
};

export interface ArmorBySlot {
  helmet: DestinyArmor[];
  arms: DestinyArmor[];
  legs: DestinyArmor[];
  chest: DestinyArmor[];
  classItem: DestinyArmor[];
}

export type Subclass = {
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
  subclass: Subclass;
};

export type ProfileData = {
  characters: Character[];
};

export type Character = {
  id: number;
  class: CharacterClass;
  emblem?: Emblem;
  armor: ArmorBySlot;
  exotics: ArmorBySlot;
  // TODO: plugs
};

export type Emblem = {
  secondaryOverlay?: string;
  secondarySpecial?: string;
};

export type DestinyMembership = {
  membershipId: string;
  membershipType: number;
  bungieGlobalDisplayName: string;
};

export interface ManifestEntry {
  id: number;
  hash: number;
}

export interface ManifestPlug extends ManifestEntry {
  name: string;
  icon: string;
  energyCost: number;
  category: number;
}

export interface ManifestArmor extends ManifestEntry {
  name: string;
  isExotic: boolean;
  characterClass: string;
  slot: string;
  icon: string;
}

export interface ManifestEmblem extends Emblem, ManifestEntry {}
