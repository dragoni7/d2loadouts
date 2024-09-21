import { RootState } from '@/store';
import { FragmentStatModifications } from '@/types/d2l-types';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function useFragmentStats() {
  const fragments = useSelector(
    (state: RootState) => state.loadoutConfig.loadout.subclassConfig.fragments
  );

  const fragmentStats = useMemo(() => {
    return fragments.reduce(
      (acc, fragment) => {
        if (fragment.itemHash !== 0) {
          acc.mobility += fragment.mobilityMod;
          acc.resilience += fragment.resilienceMod;
          acc.recovery += fragment.recoveryMod;
          acc.discipline += fragment.disciplineMod;
          acc.intellect += fragment.intellectMod;
          acc.strength += fragment.strengthMod;
        }
        return acc;
      },
      {
        mobility: 0,
        resilience: 0,
        recovery: 0,
        discipline: 0,
        intellect: 0,
        strength: 0,
      } as FragmentStatModifications
    );
  }, [fragments]);

  return fragmentStats;
}
