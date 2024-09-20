import { ARMOR } from '../../lib/bungie_api/constants';
import MaxHeap from 'heap-js';
import {
  ArmorSlot,
  Armor,
  ArmorBySlot,
  ExoticClassCombo,
  FragmentStatModifications,
} from '../../types/d2l-types';
/**
 * This function generates all possible permutations of armor based on class, selected exotic item (if any),
 * and fragment modifications. It tracks and stores the top 30,000 permutations in a max heap based on the total stats.
 * The function returns a sorted array of permutations of type DestinyArmor[].
 */
export function generatePermutations(
  armorClass: ArmorBySlot,
  selectedExoticItem: { itemHash: number | null; slot: ArmorSlot | null } = {
    itemHash: null,
    slot: null,
  },
  selectedExoticClassCombo?: ExoticClassCombo,
  assumeMasterworked: boolean = false,
  fragmentStatModifications: FragmentStatModifications = {
    mobility: 0,
    resilience: 0,
    recovery: 0,
    discipline: 0,
    intellect: 0,
    strength: 0,
  }
): Armor[][] {
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
        filteredChest = chest.filter(
          (item) => Number(item.itemHash) === selectedExoticItem.itemHash
        );
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

  const armorTypes = [filteredHelmet, filteredArms, filteredChest, filteredLegs];

  // Find best class armor to use for permutation
  let masterworkedClassArmor = undefined;
  let artificeMasterworkedClassArmor = undefined;

  for (const item of filteredClass) {
    if (masterworkedClassArmor !== undefined && artificeMasterworkedClassArmor !== undefined) break;

    if (
      (selectedExoticItem.slot === null ||
        selectedExoticItem.slot !== (ARMOR.CLASS_ARMOR as ArmorSlot)) &&
      item.exotic === true
    )
      continue;

    if (item.masterwork === true) {
      masterworkedClassArmor = item;

      if (item.artifice === true) artificeMasterworkedClassArmor = item;
    }
  }

  const bestClassArmor: Armor =
    artificeMasterworkedClassArmor === undefined
      ? masterworkedClassArmor === undefined
        ? filteredClass[0]
        : masterworkedClassArmor
      : artificeMasterworkedClassArmor;

  const heap = new MaxHeap<Armor[]>((a: Armor[], b: Armor[]) => {
    const getTotalStats = (permutation: Armor[]) => {
      const totalStats = reduceStats(permutation, assumeMasterworked, fragmentStatModifications);
      return Object.values(totalStats).reduce((a, b) => a + b, 0);
    };
    return getTotalStats(b) - getTotalStats(a);
  });

  const generate = (currentPermutation: Armor[], currentTypeIndex: number, exoticCount: number) => {
    if (currentTypeIndex === armorTypes.length) {
      const modifiedPermutation = [...currentPermutation, bestClassArmor];

      const totalStats = reduceStats(
        modifiedPermutation,
        assumeMasterworked,
        fragmentStatModifications
      );

      const totalSum = Object.values(totalStats).reduce((a, b) => a + b, 0);

      if (heap.size() < 30000) {
        heap.push(modifiedPermutation);
      } else {
        const smallest = heap.peek();
        if (smallest) {
          const smallestTotalSum =
            smallest.reduce((sum, item) => {
              const extra = assumeMasterworked && !item.masterwork ? 2 : 0;
              return (
                sum +
                item.mobility +
                extra +
                item.resilience +
                extra +
                item.recovery +
                extra +
                item.discipline +
                extra +
                item.intellect +
                extra +
                item.strength
              );
            }, 0) + Object.values(fragmentStatModifications).reduce((a, b) => a + b, 0);
          if (totalSum > smallestTotalSum) {
            heap.pop();
            heap.push(modifiedPermutation);
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

  return heap.toArray();
}

function reduceStats(
  permutation: Armor[],
  assumeMasterworked: boolean,
  fragmentStatModifications: FragmentStatModifications
): {
  mobility: number;
  resilience: number;
  recovery: number;
  discipline: number;
  intellect: number;
  strength: number;
} {
  return permutation.reduce(
    (sum, item) => {
      const extra = assumeMasterworked && !item.masterwork ? 2 : 0;

      return {
        mobility: sum.mobility + item.mobility + extra,
        resilience: sum.resilience + item.resilience + extra,
        recovery: sum.recovery + item.recovery + extra,
        discipline: sum.discipline + item.discipline + extra,
        intellect: sum.intellect + item.intellect + extra,
        strength: sum.strength + item.strength + extra,
      };
    },
    { ...fragmentStatModifications } // Start with fragment modifications
  );
}
