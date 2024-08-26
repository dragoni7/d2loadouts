import { STATUS } from '../constants';

export type EquipStatus = STATUS.SUCCESS | STATUS.FAIL;

export type EquipResult = {
  status: EquipStatus;
  message: string;
  subject: any;
};

export type armor = 'helmet' | 'gauntlets' | 'chestArmor' | 'legArmor';

export type armorMods = 'helmetMods' | 'gauntletMods' | 'chestArmorMods' | 'legArmorMods';

export type setState = (value: React.SetStateAction<any | string[]>) => void;
