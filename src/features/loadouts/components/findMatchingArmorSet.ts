import { RootState } from "../../../store";
import { CharacterClass, FilteredPermutation, DestinyArmor, StatName } from "../../../types/d2l-types";
import { filterPermutations } from "../../armor-optimization/filter-permutations";
import { generatePermutations } from "../../armor-optimization/generate-permutations";



export interface DecodedLoadoutInfo {
  selectedExoticItemHash: string;
  selectedValues: {
    [K in StatName]: number;
  };
  statPriority: StatName[];
  characterClass: CharacterClass;
}

const logArmorSet = (armorSet: DestinyArmor[]) => {
  console.log("Armor Set Details:");
  armorSet.forEach((piece, index) => {
    console.log(`Piece ${index + 1}: ${piece.name}`);
    console.log(`  Mobility: ${piece.mobility}, Resilience: ${piece.resilience}, Recovery: ${piece.recovery}`);
    console.log(`  Discipline: ${piece.discipline}, Intellect: ${piece.intellect}, Strength: ${piece.strength}`);
  });
};

export const findMatchingArmorSet = (
  decodedLoadout: DecodedLoadoutInfo,
  state: RootState
): FilteredPermutation | null => {
  console.log("Starting findMatchingArmorSet with decoded loadout:", decodedLoadout);

  const matchingCharacter = state.profile.profileData.characters.find(
    char => char.class.toLowerCase() === decodedLoadout.characterClass.toLowerCase()
  );

  if (!matchingCharacter) {
    console.error('No matching character found');
    return null;
  }

  console.log("Generating permutations...");
  const permutations = generatePermutations(matchingCharacter.armor, decodedLoadout.selectedExoticItemHash);
  console.log(`Generated ${permutations.length} permutations`);

  // Initialize all stats to 100
  let allStats: { [K in StatName]: number } = {
    mobility: 100,
    resilience: 100,
    recovery: 100,
    discipline: 100,
    intellect: 100,
    strength: 100
  };

  // Start with only the highest priority stat
  let currentThresholds: { [K in StatName]: number } = {
    mobility: 0,
    resilience: 0,
    recovery: 0,
    discipline: 0,
    intellect: 0,
    strength: 0
  };

  for (let priorityIndex = 0; priorityIndex < decodedLoadout.statPriority.length; priorityIndex++) {
    const currentStat = decodedLoadout.statPriority[priorityIndex];
    currentThresholds[currentStat] = 100;

    console.log(`\nConsidering stat: ${currentStat}`);
    console.log("Current thresholds:", currentThresholds);

    let found = false;
    while (!found) {
      console.log("Filtering permutations...");
      const filteredPermutations = filterPermutations(permutations, currentThresholds);
      console.log(`Found ${filteredPermutations.length} matching permutations`);

      if (filteredPermutations.length > 0) {
        found = true;
        if (priorityIndex === decodedLoadout.statPriority.length - 1) {
          // If we're on the last stat and found a match, we're done
          console.log("Match found! Returning best matching permutation.");
          console.log("Matched Permutation Details:");
          logArmorSet(filteredPermutations[0].permutation);
          console.log("Mods Array:", filteredPermutations[0].modsArray);
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
};