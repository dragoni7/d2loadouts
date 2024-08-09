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
    const allItems = [...helmet, ...arms, ...legs, ...chest];
    const selectedExoticItems: DestinyArmor[] = allItems.filter(
      (item) => Number(item.itemHash) === Number(selectedExoticItemHash)
    );

    if (selectedExoticItems.length > 0) {
      const selectedExoticItem = selectedExoticItems[0];

      switch (selectedExoticItem.type) {
        case 'helmet':
          filteredHelmet = helmet.filter(
            (item) => Number(item.itemHash) === Number(selectedExoticItemHash)
          );
          filteredArms = arms.filter((item) => !item.exotic);
          filteredLegs = legs.filter((item) => !item.exotic);
          filteredChest = chest.filter((item) => !item.exotic);
          break;
        case 'arms':
          filteredHelmet = helmet.filter((item) => !item.exotic);
          filteredArms = arms.filter(
            (item) => Number(item.itemHash) === Number(selectedExoticItemHash)
          );
          filteredLegs = legs.filter((item) => !item.exotic);
          filteredChest = chest.filter((item) => !item.exotic);
          break;
        case 'legs':
          filteredHelmet = helmet.filter((item) => !item.exotic);
          filteredArms = arms.filter((item) => !item.exotic);
          filteredLegs = legs.filter(
            (item) => Number(item.itemHash) === Number(selectedExoticItemHash)
          );
          filteredChest = chest.filter((item) => !item.exotic);
          break;
        case 'chest':
          filteredHelmet = helmet.filter((item) => !item.exotic);
          filteredArms = arms.filter((item) => !item.exotic);
          filteredLegs = legs.filter((item) => !item.exotic);
          filteredChest = chest.filter(
            (item) => Number(item.itemHash) === Number(selectedExoticItemHash)
          );
          break;
      }
    } else {
      console.error('Selected exotic items not found!');
    }
  }

  const armorTypes = [filteredHelmet, filteredArms, filteredLegs, filteredChest];

  const fakeClassItem: DestinyArmor = {
    intellect: 2,
    discipline: 2,
    resilience: 2,
    mobility: 2,
    strength: 2,
    recovery: 2,
    instanceHash: 'fake_class_item',
    itemHash: 'fake_class_item',
    artifice: false,
    masterwork: false,
    exotic: false,
    class: undefined,
    type: 'classItem',
    location: -1,
    icon: 'https://www.bungie.net/common/destiny2_content/icons/faeea62cd4cfaec3683a0ad84f1fa2ac.jpg',
    name: 'Class Item Bonus',
  };

  const permutations: DestinyArmor[][] = [];

  const generate = (
    currentPermutation: DestinyArmor[],
    currentTypeIndex: number,
    exoticCount: number
  ) => {
    if (currentTypeIndex === armorTypes.length) {
      const modifiedPermutation = [...currentPermutation, fakeClassItem];
      permutations.push(modifiedPermutation);
      return;
    }

    const currentSlot = armorTypes[currentTypeIndex];

    for (const item of currentSlot) {
      if (
        item.exotic &&
        exoticCount > 0 &&
        Number(item.itemHash) !== Number(selectedExoticItemHash)
      ) {
        continue;
      }

      currentPermutation.push(item);
      generate(currentPermutation, currentTypeIndex + 1, exoticCount + (item.exotic ? 1 : 0));
      currentPermutation.pop();
    }
  };

  generate([], 0, 0);

  console.log('began sorting permutations');

  permutations.sort((a, b) => {
    const sumStats = (armor: DestinyArmor[]) => {
      let sum: number = 0;
      armor.forEach((armor) => {
        sum +=
          armor.mobility + armor.resilience + armor.recovery + armor.discipline + armor.strength;
      });

      return sum;
    };

    const statSumA = sumStats(a);
    const statSumB = sumStats(b);

    return statSumB - statSumA;
  });

  return permutations.slice(0, 30000);
};
