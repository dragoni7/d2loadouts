import { ARMOR } from '../../lib/bungie_api/constants';
import MaxHeap from 'heap-js';
import {
  armor,
  DestinyArmor,
  ArmorBySlot,
  ExoticClassCombo,
} from '../../types/d2l-types';

export interface FragmentStatModifications {
  mobility: number;
  resilience: number;
  recovery: number;
  discipline: number;
  intellect: number;
  strength: number;
}

export function generatePermutations(
  armorClass: ArmorBySlot,
  selectedExoticItem: { itemHash: number | null; slot: armor | null } = {
    itemHash: null,
    slot: null,
  },
  selectedExoticClassCombo?: ExoticClassCombo,
  fragmentStatModifications: FragmentStatModifications = {
    mobility: 0,
    resilience: 0,
    recovery: 0,
    discipline: 0,
    intellect: 0,
    strength: 0
  }
): DestinyArmor[][] {
  console.log('Starting generatePermutations with fragment modifications:', fragmentStatModifications);

  const { helmet, arms, legs, chest, classItem } = armorClass;

  let filteredHelmet = helmet;
  let filteredArms = arms;
  let filteredLegs = legs;
  let filteredChest = chest;
  let filteredClass = classItem;

  if (selectedExoticItem.slot !== null) {
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
  }

  const armorTypes = [filteredHelmet, filteredArms, filteredLegs, filteredChest];

  // Find best class armor to use for permutation
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
    const getTotalStats = (permutation: DestinyArmor[]) => {
      const totalStats = permutation.reduce(
        (sum, item) => ({
          mobility: sum.mobility + item.mobility,
          resilience: sum.resilience + item.resilience,
          recovery: sum.recovery + item.recovery,
          discipline: sum.discipline + item.discipline,
          intellect: sum.intellect + item.intellect,
          strength: sum.strength + item.strength
        }),
        { ...fragmentStatModifications } // Start with fragment modifications
      );
      return Object.values(totalStats).reduce((a, b) => a + b, 0);
    };
    return getTotalStats(b) - getTotalStats(a);
  });

  const generate = (
    currentPermutation: DestinyArmor[],
    currentTypeIndex: number,
    exoticCount: number
  ) => {
    if (currentTypeIndex === armorTypes.length) {
      const modifiedPermutation = [...currentPermutation, bestClassArmor];
      const totalStats = modifiedPermutation.reduce(
        (sum, item) => ({
          mobility: sum.mobility + item.mobility,
          resilience: sum.resilience + item.resilience,
          recovery: sum.recovery + item.recovery,
          discipline: sum.discipline + item.discipline,
          intellect: sum.intellect + item.intellect,
          strength: sum.strength + item.strength
        }),
        { ...fragmentStatModifications } // Start with fragment modifications
      );

      const totalSum = Object.values(totalStats).reduce((a, b) => a + b, 0);

      const baseStats = modifiedPermutation.reduce((sum, item) => 
        sum + item.mobility + item.resilience + item.recovery + 
        item.discipline + item.intellect + item.strength, 0);

      console.log('Generated permutation:', { 
        baseStats,
        totalStats, 
        totalSum,
        fragmentModifications: fragmentStatModifications,
        permutation: modifiedPermutation.map(item => ({ 
          itemHash: item.itemHash, 
          exotic: item.exotic,
          stats: {
            mobility: item.mobility,
            resilience: item.resilience,
            recovery: item.recovery,
            discipline: item.discipline,
            intellect: item.intellect,
            strength: item.strength
          }
        }))
      });

      if (heap.size() < 30000) {
        heap.push(modifiedPermutation);
      } else {
        const smallest = heap.peek();
        if (smallest) {
          const smallestTotalSum = smallest.reduce((sum, item) => 
            sum + item.mobility + item.resilience + item.recovery + 
            item.discipline + item.intellect + item.strength, 0) + 
            Object.values(fragmentStatModifications).reduce((a, b) => a + b, 0);
          if (totalSum > smallestTotalSum) {
            heap.pop();
            heap.push(modifiedPermutation);
            console.log('Replaced permutation in heap. New total sum:', totalSum);
          }
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

  console.log('Finished generating permutations. Total permutations:', heap.size());
  return heap.toArray();
}