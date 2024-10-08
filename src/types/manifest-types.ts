import { CharacterClass, Emblem } from './d2l-types';

export interface ManifestEntry {
  itemHash: number;
  name: string;
  icon: string;
  secondaryIcon?: string;
  description?: string;
  flavorText?: string;
  perks?: number[];
}

interface ManifestLoadoutIdentifier {
  hash: number;
  index: number;
}

export interface ManifestLoadoutName extends ManifestLoadoutIdentifier {
  name: string;
}

export interface ManifestLoadoutColor extends ManifestLoadoutIdentifier {
  imagePath: string;
}

export interface ManifestLoadoutIcon extends ManifestLoadoutColor {}

export interface ManifestArmor extends ManifestEntry {
  isExotic: boolean;
  class: CharacterClass;
  slot: string;
}

export interface ManifestExoticArmor extends ManifestEntry {
  collectibleHash: number;
  isOwned: boolean;
  class: CharacterClass;
  slot: string;
}

export interface ManifestSubclass extends ManifestEntry {
  screenshot: string;
  damageType: number;
  isOwned: boolean;
  class: CharacterClass;
}

export interface ManifestPlug extends ManifestEntry {
  category: number;
  isOwned: boolean;
}

export interface ManifestStatPlug extends ManifestPlug {
  mobilityMod: number;
  resilienceMod: number;
  recoveryMod: number;
  disciplineMod: number;
  intellectMod: number;
  strengthMod: number;
}

export interface ManifestAspect extends ManifestPlug {
  energyCapacity: number;
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
