import { generatedModCombos } from '../../generated/generated-mod-combos';
import { STATS } from '../../lib/bungie_api/constants';
import {
  DecodedLoadoutData,
  DestinyArmor,
  FilteredPermutation,
  StatName,
  FragmentStatModifications,
} from '../../types/d2l-types';

interface SelectedThresholds {
  [key: string]: number;
}

export const filterPermutations = (
  permutations: DestinyArmor[][],
  thresholds: SelectedThresholds,
  fragmentStatModifications: FragmentStatModifications
): FilteredPermutation[] => {
  const results: FilteredPermutation[] = [];

  for (const permutation of permutations) {
    const modsArray: FilteredPermutation['modsArray'] = {
      mobility: [],
      resilience: [],
      recovery: [],
      discipline: [],
      intellect: [],
      strength: [],
    };

    const artificeCount = permutation.filter((armor) => armor.artifice).length;

    const statDeficits: Record<string, number> = {};
    for (const stat in thresholds) {
      const key = stat.toLowerCase() as keyof DestinyArmor & keyof FragmentStatModifications;
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

      if (deficit === 0) {
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

export function filterFromSharedLoadout(
  decodedLoadout: DecodedLoadoutData,
  permutations: DestinyArmor[][],
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
