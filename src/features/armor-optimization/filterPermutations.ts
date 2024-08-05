import { DestinyArmor, FilteredPermutation } from '../../types';

interface SelectedThresholds {
  [key: string]: number;
}

export const filterPermutations = (
  permutations: DestinyArmor[][],
  thresholds: SelectedThresholds
): FilteredPermutation[] => {
  return permutations.map((permutation) => {
    const modsArray: FilteredPermutation['modsArray'] = {
      mobility: [],
      resilience: [],
      recovery: [],
      discipline: [],
      intellect: [],
      strength: [],
    };
    let totalModsUsed = 0;
    let meetsAllThresholds = true;

    for (const stat of Object.keys(thresholds)) {
      const key = stat.toLowerCase() as keyof DestinyArmor;
      const totalStat = permutation.reduce((sum, item) => {
        const value = item[key];
        return typeof value === 'number' ? sum + value : sum;
      }, 0);
      const threshold = thresholds[stat];

      if (totalStat < threshold) {
        const neededBoosts = Math.ceil((threshold - totalStat) / 10);
        totalModsUsed += neededBoosts;

        if (totalModsUsed > 5) {
          meetsAllThresholds = false;
          break;
        }

        for (let i = 0; i < neededBoosts && totalModsUsed <= 5; i++) {
          if (!modsArray[stat as keyof FilteredPermutation['modsArray']]) {
            modsArray[stat as keyof FilteredPermutation['modsArray']] = [];
          }
          modsArray[stat as keyof FilteredPermutation['modsArray']].push(10);
        }
        meetsAllThresholds = false;
      }
    }

    if (totalModsUsed > 5) {
      return null;
    }

    return { permutation, modsArray };
  }).filter((perm): perm is FilteredPermutation => perm !== null);
};
