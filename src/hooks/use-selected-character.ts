import { RootState } from '@/store';
import { Character } from '@/types/d2l-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function useSelectedCharacter() {
  const characters = useSelector((state: RootState) => state.profile.characters);
  const selectedCharacterIndex = useSelector(
    (state: RootState) => state.dashboard.selectedCharacter
  );

  const [selectedCharacter, setSelectedCharacter] = useState<Character | undefined>(characters[0]);

  useEffect(() => {
    setSelectedCharacter(characters[selectedCharacterIndex]);
  }, [characters, selectedCharacterIndex]);

  return selectedCharacter;
}
