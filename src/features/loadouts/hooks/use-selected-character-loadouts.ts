import { useState, useEffect } from 'react';
import { DestinyLoadout } from '../../../types/d2l-types';
import { store } from '../../../store';

export default function useSelectedCharacterLoadouts() {
  const [loadouts, setLoadouts] = useState<DestinyLoadout[] | undefined>(undefined);

  useEffect(() => {
    setLoadouts(store.getState().profile.selectedCharacter?.loadouts);
  }, []);

  return loadouts;
}
