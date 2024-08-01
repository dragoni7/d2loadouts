import { DestinyArmor, ArmorBySlot } from '../../types';

export const generatePermutations = (
  armorClass: ArmorBySlot,
  selectedExoticItemHash: string | null = null
): DestinyArmor[][] => {
  const { helmet, arms, legs, chest } = armorClass;
  let filteredHelmet = helmet;
  let filteredArms = arms;
  let filteredLegs = legs;
  let filteredChest = chest;

  if (selectedExoticItemHash) {
    filteredHelmet = helmet.filter(item => item.itemHash === selectedExoticItemHash || !item.exotic);
    filteredArms = arms.filter(item => item.itemHash === selectedExoticItemHash || !item.exotic);
    filteredLegs = legs.filter(item => item.itemHash === selectedExoticItemHash || !item.exotic);
    filteredChest = chest.filter(item => item.itemHash === selectedExoticItemHash || !item.exotic);
  }

  const armorTypes = [filteredHelmet, filteredArms, filteredLegs, filteredChest];
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

    const currentSlot = armorTypes[currentTypeIndex];

    for (const item of currentSlot) {
      if (item.exotic && exoticCount > 0 && item.itemHash !== selectedExoticItemHash) {
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
