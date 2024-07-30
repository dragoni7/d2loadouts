import { CharacterClass } from '../../types';
import { MANIFEST_ARMOR, MANIFEST_CLASS } from './Constants';

export function getManifestItemSlot(slotNum: number): string {
  switch (slotNum) {
    case MANIFEST_ARMOR.HELMET: {
      return 'helmet';
    }
    case MANIFEST_ARMOR.CHEST: {
      return 'chest';
    }
    case MANIFEST_ARMOR.GAUNTLETS: {
      return 'arms';
    }
    case MANIFEST_ARMOR.LEGS: {
      return 'legs';
    }
    case MANIFEST_ARMOR.CLASS: {
      return 'class';
    }
    default: {
      return '';
    }
  }
}

export function getManifestItemClass(classNum: number): CharacterClass {
  switch (classNum) {
    case MANIFEST_CLASS.HUNTER: {
      return 'hunter';
    }
    case MANIFEST_CLASS.WARLOCK: {
      return 'warlock';
    }
    case MANIFEST_CLASS.TITAN: {
      return 'titan';
    }
    default: {
      return '';
    }
  }
}
