import { CharacterClass } from '../../types/d2l-types';
import { MANIFEST_ARMOR, MANIFEST_CLASS, STAT_HASH, STAT_MOD_HASHES } from './cont';

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

export function getStatModByCost(cost: number, statHash: number) {
  switch (statHash) {
    case STAT_HASH.MOBILITY: {
      return cost === 10
        ? STAT_MOD_HASHES.MOBILITY_MOD
        : cost === 5
        ? STAT_MOD_HASHES.MINOR_MOBILITY_MOD
        : cost === 3
        ? STAT_MOD_HASHES.ARTIFICE_MOBILITY_MOD
        : 0;
    }

    case STAT_HASH.RESILIENCE: {
      return cost === 10
        ? STAT_MOD_HASHES.RESILIENCE_MOD
        : cost === 5
        ? STAT_MOD_HASHES.MINOR_RESILIENCE_MOD
        : cost === 3
        ? STAT_MOD_HASHES.ARTIFICE_RESILIENCE_MOD
        : 0;
    }

    case STAT_HASH.RECOVERY: {
      return cost === 10
        ? STAT_MOD_HASHES.RECOVERY_MOD
        : cost === 5
        ? STAT_MOD_HASHES.MINOR_RECOVERY_MOD
        : cost === 3
        ? STAT_MOD_HASHES.ARTIFICE_RECOVERY_MOD
        : 0;
    }

    case STAT_HASH.DISCIPLINE: {
      return cost === 10
        ? STAT_MOD_HASHES.DISCIPLINE_MOD
        : cost === 5
        ? STAT_MOD_HASHES.MINOR_DISCIPLINE_MOD
        : cost === 3
        ? STAT_MOD_HASHES.ARTIFICE_DISCIPLINE_MOD
        : 0;
    }

    case STAT_HASH.INTELLECT: {
      return cost === 10
        ? STAT_MOD_HASHES.INTELLECT_MOD
        : cost === 5
        ? STAT_MOD_HASHES.MINOR_INTELLECT_MOD
        : cost === 3
        ? STAT_MOD_HASHES.ARTIFICE_INTELLECT_MOD
        : 0;
    }

    case STAT_HASH.STRENGTH: {
      return cost === 10
        ? STAT_MOD_HASHES.STRENGTH_MOD
        : cost === 5
        ? STAT_MOD_HASHES.MINOR_STRENGTH_MOD
        : cost === 3
        ? STAT_MOD_HASHES.ARTIFICE_STRENGTH_MOD
        : 0;
    }

    default: {
      return 0;
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
