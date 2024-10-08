import { ARMOR } from '../../lib/bungie_api/constants';
import { Heap } from 'heap-js';
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
  exoticsArtifice: boolean = false,
  fragmentStatModifications: FragmentStatModifications = {
    mobility: 0,
    resilience: 0,
    recovery: 0,
    discipline: 0,
    intellect: 0,
    strength: 0,
  }
): Armor[][] {
  const { helmet, arms, legs, chest, classItem } =
    assumeMasterworked || exoticsArtifice
      ? preFilterArmor(armorClass, assumeMasterworked, exoticsArtifice)
      : armorClass;

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

  const heap = new Heap<Armor[]>((a: Armor[], b: Armor[]) => {
    const getTotalStats = (permutation: Armor[]) => {
      const totalStats = reduceStats(permutation, fragmentStatModifications);
      return Object.values(totalStats).reduce((a, b) => a + b, 0);
    };
    return getTotalStats(a) - getTotalStats(b);
  });

  const generate = (currentPermutation: Armor[], currentTypeIndex: number, exoticCount: number) => {
    if (currentTypeIndex === armorTypes.length) {
      const modifiedPermutation = [...currentPermutation, bestClassArmor];

      const totalStats = reduceStats(modifiedPermutation, fragmentStatModifications);
      const totalSum = Object.values(totalStats).reduce(
        (a, b) => Math.floor(a / 10) * 10 + Math.floor(b / 10) * 10,
        0
      );

      if (heap.size() < 30000) {
        heap.push(modifiedPermutation);
      } else {
        const smallest = heap.peek();

        if (smallest) {
          const smallestTotalStats = reduceStats(smallest, fragmentStatModifications);
          const smallestTotalSum = Object.values(smallestTotalStats).reduce(
            (a, b) => Math.floor(a / 10) * 10 + Math.floor(b / 10) * 10,
            0
          );

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
      return {
        mobility: sum.mobility + item.mobility,
        resilience: sum.resilience + item.resilience,
        recovery: sum.recovery + item.recovery,
        discipline: sum.discipline + item.discipline,
        intellect: sum.intellect + item.intellect,
        strength: sum.strength + item.strength,
      };
    },
    { ...fragmentStatModifications } // Start with fragment modifications
  );
}

function preFilterArmor(
  armorClass: ArmorBySlot,
  allMasterworked: boolean,
  exoticsArtifice: boolean
): ArmorBySlot {
  let modified: ArmorBySlot = structuredClone(armorClass);

  modified.helmet.forEach((armor) => {
    if (!armor.masterwork && allMasterworked) {
      armor.mobility += 2;
      armor.recovery += 2;
      armor.resilience += 2;
      armor.discipline += 2;
      armor.intellect += 2;
      armor.strength += 2;
    }

    if (armor.exotic && exoticsArtifice) armor.artifice = true;
  });

  modified.arms.forEach((armor) => {
    if (!armor.masterwork && allMasterworked) {
      armor.mobility += 2;
      armor.recovery += 2;
      armor.resilience += 2;
      armor.discipline += 2;
      armor.intellect += 2;
      armor.strength += 2;
    }

    if (armor.exotic && exoticsArtifice) armor.artifice = true;
  });

  modified.chest.forEach((armor) => {
    if (!armor.masterwork && allMasterworked) {
      armor.mobility += 2;
      armor.recovery += 2;
      armor.resilience += 2;
      armor.discipline += 2;
      armor.intellect += 2;
      armor.strength += 2;
    }

    if (armor.exotic && exoticsArtifice) armor.artifice = true;
  });

  modified.legs.forEach((armor) => {
    if (!armor.masterwork && allMasterworked) {
      armor.mobility += 2;
      armor.recovery += 2;
      armor.resilience += 2;
      armor.discipline += 2;
      armor.intellect += 2;
      armor.strength += 2;
    }

    if (armor.exotic && exoticsArtifice) armor.artifice = true;
  });

  modified.classItem.forEach((armor) => {
    if (!armor.masterwork && allMasterworked) {
      armor.mobility += 2;
      armor.recovery += 2;
      armor.resilience += 2;
      armor.discipline += 2;
      armor.intellect += 2;
      armor.strength += 2;
    }

    if (armor.exotic && exoticsArtifice) armor.artifice = true;
  });

  return modified;
}
