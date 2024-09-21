import { RootState } from '@/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { generatePermutations } from '../generate-permutations';
import useSelectedCharacter from '@/hooks/use-selected-character';

export default function usePermutations() {
  const selectedCharacter = useSelectedCharacter();

  const { selectedExotic, selectedExoticClassCombo, assumeExoticArtifice, assumeMasterwork } =
    useSelector((state: RootState) => state.dashboard);

  const permutations = useMemo(() => {
    if (selectedCharacter && selectedExotic.itemHash !== null) {
      if (selectedExoticClassCombo)
        return generatePermutations(
          selectedCharacter.armor,
          selectedExotic,
          selectedExoticClassCombo,
          assumeMasterwork,
          assumeExoticArtifice
        );

      return generatePermutations(
        selectedCharacter.armor,
        selectedExotic,
        undefined,
        assumeMasterwork,
        assumeExoticArtifice
      );
    }
    return [];
  }, [
    selectedCharacter,
    selectedExotic,
    selectedExoticClassCombo,
    assumeMasterwork,
    assumeExoticArtifice,
  ]);

  return permutations;
}
