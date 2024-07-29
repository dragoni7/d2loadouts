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
  unlockedArmorModPlugs: string[];
};

export type Character = {
  id: number;
  class: CharacterClass;
  emblem?: Emblem;
  armor: ArmorBySlot;
  exotics: ArmorBySlot;
  subclasses: { [key: number]: Subclass };
};

export type Subclass = {
  instanceId: string;
  itemHash: string;
  supers: string[];
  aspects: string[];
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
