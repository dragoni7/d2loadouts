import { store } from '../../store';
import { DestinyArmor } from '../../types';


interface ArmorByType {
  helmet: DestinyArmor[];
  arms: DestinyArmor[];
  legs: DestinyArmor[];
  chest: DestinyArmor[];
  classItem: DestinyArmor[];
}

interface ArmorByClass {
  warlock: ArmorByType;
  hunter: ArmorByType;
  titan: ArmorByType;
}

export const separateArmor = (armorArray: DestinyArmor[]): ArmorByClass => {
  const result: ArmorByClass = {
    warlock: { helmet: [], arms: [], legs: [], chest: [], classItem: [] },
    hunter: { helmet: [], arms: [], legs: [], chest: [], classItem: [] },
    titan: { helmet: [], arms: [], legs: [], chest: [], classItem: [] }
  };

  armorArray.forEach(item => {
    const armorClass = item.class as keyof ArmorByClass;
    const armorType = item.type as keyof ArmorByType;

    if (result[armorClass] && result[armorClass][armorType]) {
      result[armorClass][armorType].push(item);
    }
  });

  return result;
};