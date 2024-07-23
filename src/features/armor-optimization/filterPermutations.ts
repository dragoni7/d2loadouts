import { DestinyArmor } from "../../types";

interface SelectedThresholds {
  [key: string]: number;
}

export const filterPermutations = (
  permutations: DestinyArmor[][],
  thresholds: SelectedThresholds
): DestinyArmor[][] => {
  return permutations.filter(permutation => {
    for (const stat of Object.keys(thresholds)) {
      const key = stat.toLowerCase() as keyof DestinyArmor;
      const totalStat = permutation.reduce((sum, item) => {
        const value = item[key];
        return typeof value === 'number' ? sum + value : sum;
      }, 0);
      if (totalStat < thresholds[stat]) {
        return false;
      }
    }
    return true;
  });
};
