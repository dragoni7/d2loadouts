import { DestinyArmor, ArmorBySlot } from '../../types/d2l-types';
import MaxHeap from 'heap-js';

export const generatePermutations = (
  armorClass: ArmorBySlot,
  selectedExoticItemHash: string | null = null
): DestinyArmor[][] => {
  const { helmet, arms, legs, chest, classItem } = armorClass;

  let filteredHelmet = helmet;
  let filteredArms = arms;
  let filteredLegs = legs;
  let filteredChest = chest;
  let filteredClass = classItem;

  if (selectedExoticItemHash) {
    const allItems = [...helmet, ...arms, ...legs, ...chest, ...classItem];
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
        case 'class':
          console.log('exotic class item selected');
          break;
      }
    } else {
      console.error('Selected exotic items not found!');
    }
  }

  const armorTypes = [filteredHelmet, filteredArms, filteredLegs, filteredChest];

  // find best class armor to use for permutation
  // if additionally class armor filtering is implemented, do so here
  let masterworkedClassArmor = undefined;
  let artificeMasterworkedClassArmor = undefined;

  for (const item of classItem) {
    if (masterworkedClassArmor !== undefined && artificeMasterworkedClassArmor !== undefined) break;

    if (item.masterwork === true) {
      masterworkedClassArmor = item;

      if (item.artifice === true) artificeMasterworkedClassArmor = item;
    }
  }

  const bestClassArmor: DestinyArmor =
    artificeMasterworkedClassArmor === undefined
      ? masterworkedClassArmor === undefined
        ? classItem[0]
        : masterworkedClassArmor
      : artificeMasterworkedClassArmor;

  const heap = new MaxHeap<DestinyArmor[]>((a: DestinyArmor[], b: DestinyArmor[]) => {
    const sumStats = (items: DestinyArmor[]) =>
      items.reduce(
        (sum: number, item: DestinyArmor) =>
          sum +
          item.mobility +
          item.resilience +
          item.recovery +
          item.discipline +
          item.intellect +
          item.strength,
        0
      );

    return sumStats(a) - sumStats(b);
  });

  const generate = (
    currentPermutation: DestinyArmor[],
    currentTypeIndex: number,
    exoticCount: number
  ) => {
    if (currentTypeIndex === armorTypes.length) {
      const modifiedPermutation = [...currentPermutation, bestClassArmor];
      const totalStats = modifiedPermutation.reduce(
        (sum: number, item: DestinyArmor) =>
          sum +
          item.mobility +
          item.resilience +
          item.recovery +
          item.discipline +
          item.intellect +
          item.strength,
        0
      );

      if (heap.size() < 30000) {
        heap.push(modifiedPermutation);
      } else {
        const smallest = heap.peek();
        if (
          smallest &&
          totalStats >
            smallest.reduce(
              (sum: number, item: DestinyArmor) =>
                sum +
                item.mobility +
                item.resilience +
                item.recovery +
                item.discipline +
                item.intellect +
                item.strength,
              0
            )
        ) {
          heap.pop();
          heap.push(modifiedPermutation);
        }
      }
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

  return heap.toArray();
};
