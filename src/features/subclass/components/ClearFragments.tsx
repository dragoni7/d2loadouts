import { D2LButton } from '@/components/D2LButton';
import { EMPTY_FRAGMENT } from '@/lib/bungie_api/constants';
import { RootState } from '@/store';
import { updateSubclassMods } from '@/store/LoadoutReducer';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function ClearFragments() {
  const dispatch = useDispatch();
  const fragments = useSelector(
    (state: RootState) => state.loadoutConfig.loadout.subclassConfig.fragments
  );

  return (
    <D2LButton
      onClick={() =>
        dispatch(updateSubclassMods({ category: 'FRAGMENTS', mods: Array(5).fill(EMPTY_FRAGMENT) }))
      }
    >
      Clear Fragments
    </D2LButton>
  );
}
