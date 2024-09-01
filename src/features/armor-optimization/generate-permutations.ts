import { ARMOR } from '../../lib/bungie_api/constants';
import { DestinyArmor, ArmorBySlot, armor, ExoticClassCombo } from '../../types/d2l-types';
import MaxHeap from 'heap-js';

export const generatePermutations = (
  armorClass: ArmorBySlot,
  selectedExoticItem: { itemHash: number | null; slot: armor | null } = {
    itemHash: null,
    slot: null,
  },
  selectedExoticClassCombo?: ExoticClassCombo
): DestinyArmor[][] => {
  const { helmet, arms, legs, chest, classItem } = armorClass;

  let filteredHelmet = helmet;
  let filteredArms = arms;
  let filteredLegs = legs;
  let filteredChest = chest;
  let filteredClass = classItem;

  switch (selectedExoticItem.slot) {
    case ARMOR.HELMET:
      filteredHelmet = helmet.filter(
        (item) => Number(item.itemHash) === selectedExoticItem.itemHash
      );
      filteredArms = arms.filter((item) => !item.exotic);
      filteredLegs = legs.filter((item) => !item.exotic);
      filteredChest = chest.filter((item) => !item.exotic);
      filteredClass = classItem.filter((item) => !item.exotic);
      break;
    case ARMOR.GAUNTLETS:
      filteredHelmet = helmet.filter((item) => !item.exotic);
      filteredArms = arms.filter((item) => Number(item.itemHash) === selectedExoticItem.itemHash);
      filteredLegs = legs.filter((item) => !item.exotic);
      filteredChest = chest.filter((item) => !item.exotic);
      filteredClass = classItem.filter((item) => !item.exotic);
      break;
    case ARMOR.LEG_ARMOR:
      filteredHelmet = helmet.filter((item) => !item.exotic);
      filteredArms = arms.filter((item) => !item.exotic);
      filteredLegs = legs.filter((item) => Number(item.itemHash) === selectedExoticItem.itemHash);
      filteredChest = chest.filter((item) => !item.exotic);
      filteredClass = classItem.filter((item) => !item.exotic);
      break;
    case ARMOR.CHEST_ARMOR:
      filteredHelmet = helmet.filter((item) => !item.exotic);
      filteredArms = arms.filter((item) => !item.exotic);
      filteredLegs = legs.filter((item) => !item.exotic);
      filteredChest = chest.filter((item) => Number(item.itemHash) === selectedExoticItem.itemHash);
      filteredClass = classItem.filter((item) => !item.exotic);
      break;
    case ARMOR.CLASS_ARMOR:
      filteredHelmet = helmet.filter((item) => !item.exotic);
      filteredArms = arms.filter((item) => !item.exotic);
      filteredLegs = legs.filter((item) => !item.exotic);
      filteredChest = chest.filter((item) => !item.exotic);
      filteredClass = selectedExoticClassCombo
        ? classItem.filter((item) =>
            selectedExoticClassCombo.instanceHashes.includes(item.instanceHash)
          )
        : classItem.filter((item) => Number(item.itemHash) === selectedExoticItem.itemHash);
      break;
  }

  const armorTypes = [filteredHelmet, filteredArms, filteredLegs, filteredChest];

  // find best class armor to use for permutation
  // if additional class armor filtering is implemented, do so here
  let masterworkedClassArmor = undefined;
  let artificeMasterworkedClassArmor = undefined;

  for (const item of filteredClass) {
    if (masterworkedClassArmor !== undefined && artificeMasterworkedClassArmor !== undefined) break;

    if (item.masterwork === true) {
      masterworkedClassArmor = item;

      if (item.artifice === true) artificeMasterworkedClassArmor = item;
    }
  }

  const bestClassArmor: DestinyArmor =
    artificeMasterworkedClassArmor === undefined
      ? masterworkedClassArmor === undefined
        ? filteredClass[0]
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
      if (item.exotic && exoticCount > 0 && Number(item.itemHash) !== selectedExoticItem.itemHash) {
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
