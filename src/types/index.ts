export type CharacterClass = 'warlock' | 'hunter' | 'titan';

export type DestinyArmor = {
  intellect: number;
  discipline: number;
  resilience: number;
  mobility: number;
  strength: number;
  recovery: number;
  instanceHash: string;
  itemHash?: string;
  artifice?: boolean;
  masterwork: boolean;
  exotic?: boolean;
  class?: string;
  type?: string;
  socket?: string;
};

export type Character = {
  id: number;
  class: CharacterClass;
  emblem?: Emblem;
};

export type ProfileData = {
  characters: Character[];
  armor: DestinyArmor[];
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

export interface ManifestArmor extends ManifestEntry {
  name: string;
  isExotic: boolean;
  characterClass: string;
  slot: string;
  icon: string;
}

export interface ManifestEmblem extends Emblem {
  id: number;
  hash: number;
}

export interface ArmorByType {
  helmet: DestinyArmor[];
  arms: DestinyArmor[];
  legs: DestinyArmor[];
  chest: DestinyArmor[];
  classItem: DestinyArmor[];
}

export interface ArmorByClass {
  warlock: ArmorByType;
  hunter: ArmorByType;
  titan: ArmorByType;
}
