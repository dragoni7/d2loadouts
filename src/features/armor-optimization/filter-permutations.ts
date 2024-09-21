import { generatedModCombos } from '../../generated/generated-mod-combos';
import { STATS } from '../../lib/bungie_api/constants';
import {
  DecodedLoadoutData,
  Armor,
  FilteredPermutation,
  StatName,
  FragmentStatModifications,
  ExoticClassCombo,
} from '../../types/d2l-types';

/**
 * Finds the stat deficit by considering the total armor in each permutation and the fragment modifications.
 * Then, it tries pre-calculated mod combinations to meet the required threshold.
 * It returns a sorted, filtered permutation array based on the lowest number of mods used.
 */

interface SelectedThresholds {
  [key: string]: number;
}

export const filterPermutations = (
  permutations: Armor[][],
  thresholds: SelectedThresholds,
  fragmentStatModifications: FragmentStatModifications,
  selectedExotic: { itemHash: number | null; slot: string | null },
  selectedExoticClass: ExoticClassCombo | null
): FilteredPermutation[] => {
  const results: FilteredPermutation[] = [];
  let filtered = permutations;

  // use permutations with the selected exotic
  if (selectedExotic.itemHash) {
    filtered = filtered.filter(
      (p) => p.find((armor) => Number(armor.itemHash) === selectedExotic.itemHash!) !== undefined
    );
  }

  for (const permutation of filtered) {
    const modsArray: FilteredPermutation['modsArray'] = {
      mobility: [],
      resilience: [],
      recovery: [],
      discipline: [],
      intellect: [],
      strength: [],
    };

    const artificeCount = permutation.filter((armor) => armor.artifice === true).length;

    const statDeficits: Record<string, number> = {};

    for (const stat in thresholds) {
      const key = stat.toLowerCase() as keyof Armor & keyof FragmentStatModifications;
      const totalStat =
        permutation.reduce((sum, item) => sum + ((item[key] as number) || 0), 0) +
        fragmentStatModifications[key];
      statDeficits[stat] = Math.max(0, thresholds[stat] - totalStat);
    }

    const tryModCombination = (
      statIndex: number,
      artificeUsed: number,
      regularModsUsed: number
    ): boolean => {
      if (statIndex === Object.keys(statDeficits).length) {
        return true;
      }

      const stat = Object.keys(statDeficits)[statIndex];
      const deficit = statDeficits[stat];

      if (deficit <= 0) {
        return tryModCombination(statIndex + 1, artificeUsed, regularModsUsed);
      }

      const combinations = generatedModCombos[deficit] || [];
      for (const [artifice, minor, major] of combinations) {
        if (artifice <= artificeCount - artificeUsed && minor + major <= 5 - regularModsUsed) {
          modsArray[stat.toLowerCase() as keyof FilteredPermutation['modsArray']] = [
            ...Array(artifice).fill(3),
            ...Array(minor).fill(5),
            ...Array(major).fill(10),
          ];

          if (
            tryModCombination(
              statIndex + 1,
              artificeUsed + artifice,
              regularModsUsed + minor + major
            )
          ) {
            return true;
          }

          modsArray[stat.toLowerCase() as keyof FilteredPermutation['modsArray']] = [];
        }
      }

      return false;
    };

    if (tryModCombination(0, 0, 0)) {
      results.push({ permutation, modsArray });
    }
  }

  return results.sort((p1, p2) => calculateTotalCost(p1) - calculateTotalCost(p2));
};

function calculateTotalCost(perm: FilteredPermutation): number {
  let total = 0;
  (STATS as StatName[]).map((stat) => {
    total += perm.modsArray[stat].reduce((prev, curr) => prev + curr, 0);
  });

  return total;
}

/**
 * The algorithm for the ShareLoadout link to find optimal armor from the receiving user's armor pool.
 * It starts with the highest priority stat at its maximum threshold and decrements
 * the threshold until a permutation is found. This allows us to find the best or closest
 * possible armor from the receiving user's armor pool.
 */

export function filterFromSharedLoadout(
  decodedLoadout: DecodedLoadoutData,
  permutations: Armor[][],
  fragmentStatModifications: FragmentStatModifications
): FilteredPermutation | null {
  let currentThresholds: { [K in StatName]: number } = {
    mobility: 0,
    resilience: 0,
    recovery: 0,
    discipline: 0,
    intellect: 0,
    strength: 0,
  };

  for (let priorityIndex = 0; priorityIndex < decodedLoadout.statPriority.length; priorityIndex++) {
    const currentStat = decodedLoadout.statPriority[priorityIndex];
    currentThresholds[currentStat] = 100;

    let found = false;
    while (!found) {
      const filteredPermutations = filterPermutations(
        permutations,
        currentThresholds,
        fragmentStatModifications
      );

      if (filteredPermutations.length > 0) {
        found = true;
        if (priorityIndex === decodedLoadout.statPriority.length - 1) {
          return filteredPermutations[0];
        }
      } else {
        currentThresholds[currentStat] = Math.max(0, currentThresholds[currentStat] - 10);

        if (currentThresholds[currentStat] === 0) {
          break;
        }
      }
    }

    if (!found) {
      break;
    }
  }

  return null;
}
