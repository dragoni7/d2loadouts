import { DestinyArmor, FilteredPermutation } from '../../types';
import { precalculatedModCombinations } from './precalculatedModCombinations';

interface SelectedThresholds {
  [key: string]: number;
}

export const filterPermutations = (
  permutations: DestinyArmor[][],
  thresholds: SelectedThresholds
): FilteredPermutation[] => {

  let acceptedCount = 0;
  let discardedCount = 0;

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
    
    const artificeCount = permutation.filter(armor => armor.artifice).length;

    // Calculate initial stat totals and deficits
    const statDeficits: Record<string, number> = {};
    for (const stat in thresholds) {
      const key = stat.toLowerCase() as keyof DestinyArmor;
      const totalStat = permutation.reduce((sum, item) => sum + (item[key] as number || 0), 0);
      statDeficits[stat] = Math.max(0, thresholds[stat] - totalStat);
    }

    // Try to find a valid mod combination
    const tryModCombination = (statIndex: number, artificeUsed: number, regularModsUsed: number): boolean => {
      if (statIndex === Object.keys(statDeficits).length) {
        return true; // All stats processed successfully
      }

      const stat = Object.keys(statDeficits)[statIndex];
      const deficit = statDeficits[stat];

      if (deficit === 0) {
        return tryModCombination(statIndex + 1, artificeUsed, regularModsUsed);
      }

      const combinations = precalculatedModCombinations[deficit] || [];
      for (const [artifice, minor, major, total] of combinations) {
        if (artifice <= artificeCount - artificeUsed && 
            minor + major <= 5 - regularModsUsed) {
          // Try this combination
          modsArray[stat.toLowerCase() as keyof FilteredPermutation['modsArray']] = 
            [...Array(artifice).fill(3), ...Array(minor).fill(5), ...Array(major).fill(10)];
          
          if (tryModCombination(statIndex + 1, artificeUsed + artifice, regularModsUsed + minor + major)) {
            return true;
          }

          // If it doesn't work, reset this stat's mods
          modsArray[stat.toLowerCase() as keyof FilteredPermutation['modsArray']] = [];
        }
      }

      return false;
    };

    if (tryModCombination(0, 0, 0)) {
      acceptedCount++;
      results.push({ permutation, modsArray });
    } else {
      discardedCount++;
    }
  }

  return results;
};