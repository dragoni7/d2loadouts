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

export type DestinyMembership = {
  membershipId: string;
  membershipType: number;
};

export interface ManifestArmor {
  id: number;
  hash: number;
  name: string;
  isExotic: boolean;
  characterClass: string;
  slot: string;
  icon: string;
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