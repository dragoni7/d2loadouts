import { RootState } from '@/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { generatePermutations } from '../generate-permutations';

export default function usePermutations() {
  const characters = useSelector((state: RootState) => state.profile.characters);
  const {
    selectedExotic,
    selectedExoticClassCombo,
    selectedCharacter,
    assumeExoticArtifice,
    assumeMasterwork,
  } = useSelector((state: RootState) => state.dashboard);

  const permutations = useMemo(() => {
    if (characters[selectedCharacter] && selectedExotic.itemHash !== null) {
      if (selectedExoticClassCombo)
        return generatePermutations(
          characters[selectedCharacter].armor,
          selectedExotic,
          selectedExoticClassCombo,
          assumeMasterwork,
          assumeExoticArtifice
        );

      return generatePermutations(
        characters[selectedCharacter].armor,
        selectedExotic,
        undefined,
        assumeMasterwork,
        assumeExoticArtifice
      );
    }
    return [];
  }, [
    selectedCharacter,
    characters,
    selectedExotic,
    selectedExoticClassCombo,
    assumeMasterwork,
    assumeExoticArtifice,
  ]);

  return permutations;
}
