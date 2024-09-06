import { CharacterClass } from '../../../types/d2l-types';
import { STATUS } from '../constants';

export type EquipStatus = STATUS.SUCCESS | STATUS.FAIL;

export type EquipResult = {
  status: EquipStatus;
  message: string;
  subject: any;
};

export type setState = (value: React.SetStateAction<any | string[]>) => void;

export type SharedLoadoutDto = {
  mods: {
    helmet: number[];
    gauntlets: number[];
    chest: number[];
    legs: number[];
  };
  subclass: {
    damageType: number;
    super: number;
    aspects: number[];
    fragments: number[];
    classAbility: number;
    meleeAbility: number;
    movementAbility: number;
    grenade: number;
  };
  selectedExoticItemHash: string;
  selectedValues: Record<string, number>;
  statPriority: string[];
  characterClass: CharacterClass | null;
};
