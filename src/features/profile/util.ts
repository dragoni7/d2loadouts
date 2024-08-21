import { CLASS_HASH, STAT_MOD_HASHES } from '../../lib/bungie_api/constants';
import { DestinyArmor } from '../../types/d2l-types';

export const modReverseDict: { [key: number]: (armor: DestinyArmor) => void } = {
  [STAT_MOD_HASHES.INTELLECT_MOD]: (armor: DestinyArmor) =>
    (armor.intellect = armor.intellect - 10),
  [STAT_MOD_HASHES.MINOR_INTELLECT_MOD]: (armor: DestinyArmor) =>
    (armor.intellect = armor.intellect - 5),
  [STAT_MOD_HASHES.ARTIFICE_INTELLECT_MOD]: (armor: DestinyArmor) =>
    (armor.intellect = armor.intellect - 3),
  [STAT_MOD_HASHES.RESILIENCE_MOD]: (armor: DestinyArmor) =>
    (armor.resilience = armor.resilience - 10),
  [STAT_MOD_HASHES.MINOR_RESILIENCE_MOD]: (armor: DestinyArmor) =>
    (armor.resilience = armor.resilience - 5),
  [STAT_MOD_HASHES.ARTIFICE_RESILIENCE_MOD]: (armor: DestinyArmor) =>
    (armor.resilience = armor.resilience - 3),
  [STAT_MOD_HASHES.DISCIPLINE_MOD]: (armor: DestinyArmor) =>
    (armor.discipline = armor.discipline - 10),
  [STAT_MOD_HASHES.MINOR_DISCIPLINE_MOD]: (armor: DestinyArmor) =>
    (armor.discipline = armor.discipline - 5),
  [STAT_MOD_HASHES.ARTIFICE_DISCIPLINE_MOD]: (armor: DestinyArmor) =>
    (armor.discipline = armor.discipline - 3),
  [STAT_MOD_HASHES.RECOVERY_MOD]: (armor: DestinyArmor) => (armor.recovery = armor.recovery - 10),
  [STAT_MOD_HASHES.MINOR_RECOVERY_MOD]: (armor: DestinyArmor) =>
    (armor.recovery = armor.recovery - 5),
  [STAT_MOD_HASHES.ARTIFICE_RECOVERY_MOD]: (armor: DestinyArmor) =>
    (armor.recovery = armor.recovery - 3),
  [STAT_MOD_HASHES.MOBILITY_MOD]: (armor: DestinyArmor) => (armor.mobility = armor.mobility - 10),
  [STAT_MOD_HASHES.MINOR_MOBILITY_MOD]: (armor: DestinyArmor) =>
    (armor.mobility = armor.mobility - 5),
  [STAT_MOD_HASHES.ARTIFICE_MOBILITY_MOD]: (armor: DestinyArmor) =>
    (armor.mobility = armor.mobility - 3),
  [STAT_MOD_HASHES.STRENGTH_MOD]: (armor: DestinyArmor) => (armor.strength = armor.strength - 10),
  [STAT_MOD_HASHES.MINOR_STRENGTH_MOD]: (armor: DestinyArmor) =>
    (armor.strength = armor.strength - 5),
  [STAT_MOD_HASHES.ARTIFICE_STRENGTH_MOD]: (armor: DestinyArmor) =>
    (armor.strength = armor.strength - 3),
};

export function getCharacterClass(classHash: number) {
  switch (classHash) {
    case CLASS_HASH.TITAN: {
      return 'titan';
    }
    case CLASS_HASH.HUNTER: {
      return 'hunter';
    }
    case CLASS_HASH.WARLOCK: {
      return 'warlock';
    }
    default: {
      return '';
    }
  }
}
