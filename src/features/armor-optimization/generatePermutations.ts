import { DestinyArmor, ArmorByType } from '../../types';

export const generatePermutations = (armorClass: ArmorByType): DestinyArmor[][] => {
  const { helmet, arms, legs, chest } = armorClass;
  const armorTypes = [helmet, arms, legs, chest];
  const permutations: DestinyArmor[][] = [];

  const generate = (
    currentPermutation: DestinyArmor[],
    currentTypeIndex: number,
    exoticCount: number
  ) => {
    if (currentTypeIndex === armorTypes.length) {
      permutations.push([...currentPermutation]);
      return;
    }

    for (const item of armorTypes[currentTypeIndex]) {
      if (item.exotic && exoticCount > 0) {
        continue;
      }

      currentPermutation.push(item);
      generate(currentPermutation, currentTypeIndex + 1, exoticCount + (item.exotic ? 1 : 0));
      currentPermutation.pop();
    }
  };

  generate([], 0, 0);

  return permutations;
};
