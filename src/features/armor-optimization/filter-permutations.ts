import {
  DecodedLoadoutData,
  DestinyArmor,
  FilteredPermutation,
  StatName,
} from '../../types/d2l-types';
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

    const artificeCount = permutation.filter((armor) => armor.artifice).length;

    // Calculate initial stat totals and deficits
    const statDeficits: Record<string, number> = {};
    for (const stat in thresholds) {
      const key = stat.toLowerCase() as keyof DestinyArmor;
      const totalStat = permutation.reduce((sum, item) => sum + ((item[key] as number) || 0), 0);
      statDeficits[stat] = Math.max(0, thresholds[stat] - totalStat);
    }

    // Try to find a valid mod combination
    const tryModCombination = (
      statIndex: number,
      artificeUsed: number,
      regularModsUsed: number
    ): boolean => {
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
        if (artifice <= artificeCount - artificeUsed && minor + major <= 5 - regularModsUsed) {
          // Try this combination
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

export function filterFromSharedLoadout(
  decodedLoadout: DecodedLoadoutData,
  permutations: DestinyArmor[][]
): FilteredPermutation | null {
  console.log('Starting findMatchingArmorSet with decoded loadout:', decodedLoadout);

  // Start with only the highest priority stat
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

    console.log(`\nConsidering stat: ${currentStat}`);
    console.log('Current thresholds:', currentThresholds);

    let found = false;
    while (!found) {
      console.log('Filtering permutations...');
      const filteredPermutations = filterPermutations(permutations, currentThresholds);
      console.log(`Found ${filteredPermutations.length} matching permutations`);

      if (filteredPermutations.length > 0) {
        found = true;
        if (priorityIndex === decodedLoadout.statPriority.length - 1) {
          // If we're on the last stat and found a match, we're done
          console.log('Match found! Returning best matching permutation.');
          console.log('Matched Permutation Details:');
          console.log('Mods Array:', filteredPermutations[0].modsArray);
          return filteredPermutations[0];
        }
      } else {
        // Reduce the threshold of the current stat
        currentThresholds[currentStat] = Math.max(0, currentThresholds[currentStat] - 10);
        console.log(`Reduced ${currentStat} threshold to ${currentThresholds[currentStat]}`);

        if (currentThresholds[currentStat] === 0) {
          // If we've reduced the current stat to 0 and still no match, move to the next stat
          break;
        }
      }
    }

    if (!found) {
      console.log(`Could not find a match considering up to ${currentStat}`);
      break;
    }
  }

  return null;
}
