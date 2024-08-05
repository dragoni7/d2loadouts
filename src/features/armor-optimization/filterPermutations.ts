import { DestinyArmor } from '../../types';

interface SelectedThresholds {
  [key: string]: number;
}

interface CachedPermutation {
  permutation: DestinyArmor[];
  totalStats: { [key: string]: number };
}

export const filterPermutations = (
  permutations: DestinyArmor[][],
  thresholds: SelectedThresholds
): DestinyArmor[][] => {
  const thresholdKeys = Object.keys(thresholds);

  // Precompute and cache the total stats for each permutation
  const cachedPermutations: CachedPermutation[] = permutations.map(permutation => {
    const totalStats: { [key: string]: number } = {};
    thresholdKeys.forEach(stat => {
      const key = stat.toLowerCase() as keyof DestinyArmor;
      totalStats[stat] = permutation.reduce((sum, item) => {
        const value = item[key];
        return typeof value === 'number' ? sum + value : sum;
      }, 0);
    });
    return { permutation, totalStats };
  });

  return cachedPermutations.filter((cachedPerm, index) => {
    const modsArray = Array(5).fill(0);
    let totalModsUsed = 0;

    console.log('------------------------------');
    console.log(`Evaluating permutation ${index + 1}:`);

    let meetsAllThresholdsWithoutMods = true;
    let meetsAllThresholdsWithMods = true;

    for (const stat of thresholdKeys) {
      const totalStat = cachedPerm.totalStats[stat];
      const threshold = thresholds[stat];

      if (totalStat < threshold) {
        meetsAllThresholdsWithoutMods = false;

        const neededBoosts = Math.ceil((threshold - totalStat) / 10);
        totalModsUsed += neededBoosts;

        if (totalModsUsed > 5) {
          console.log(`Permutation ${index + 1} requires more than 5 mods. Discarding.`);
          meetsAllThresholdsWithMods = false;
          break;
        }

        let boostsAdded = 0;
        for (let i = 0; i < modsArray.length && boostsAdded < neededBoosts; i++) {
          if (modsArray[i] === 0) {
            modsArray[i] = 10; // Populate the mod slot with +10
            boostsAdded++;
          }
        }

        console.log(`It would take ${neededBoosts} +10 mods to reach the ${stat} threshold`);
        console.log(`Mods array after adding ${stat} mods:`, modsArray);
      } else {
        console.log(`Total ${stat} for permutation: ${totalStat} meets the threshold of ${threshold}`);
      }
    }

    console.log(`Final Mods array for permutation ${index + 1}:`, modsArray);
    return meetsAllThresholdsWithMods;
  }).map(cachedPerm => cachedPerm.permutation); // Return the original permutations
};
