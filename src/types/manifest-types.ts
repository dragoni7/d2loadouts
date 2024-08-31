import { CharacterClass, Emblem } from './d2l-types';

export interface ManifestEntry {
  itemHash: number;
  name: string;
  icon: string;
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

export interface ManifestSubclass extends ManifestEntry {
  screenshot: string;
  damageType: number;
  isOwned: boolean;
  class: CharacterClass;
}

export interface ManifestPlug extends ManifestEntry {
  perkName: string;
  perkDescription: string;
  perkIcon: string;
  secondaryIcon?: string;
  category: number;
  isOwned: boolean;
}

export interface ManifestStatPlug extends ManifestPlug {
  mobilityMod?: number;
  resilienceMod?: number;
  recoveryMod?: number;
  disciplineMod?: number;
  intellectMod?: number;
  strengthMod?: number;
}

export interface ManifestAspect extends ManifestPlug {
  energyCapacity?: number;
}

export interface ManifestArmorMod extends ManifestPlug {
  energyCost: number;
  collectibleHash: number;
  unique: boolean;
}

export interface ManifestArmorStatMod extends ManifestStatPlug {
  energyCost: number;
  collectibleHash: number;
}

export interface ManifestEmblem extends Emblem, ManifestEntry {}
