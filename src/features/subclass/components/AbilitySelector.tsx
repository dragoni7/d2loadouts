import HoverCard from '@/components/HoverCard';
import { EMPTY_ASPECT, EMPTY_FRAGMENT } from '@/lib/bungie_api/constants';
import { RootState } from '@/store';
import { updateSubclassMods } from '@/store/LoadoutReducer';
import { ManifestAspect, ManifestPlug, ManifestStatPlug } from '@/types/manifest-types';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { Box, IconButton, Paper, Stack, styled, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const ModSlot = styled(Paper)(({ theme }) => ({
  width: 74,
  height: 74,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: 0,
  backgroundColor: 'transparent',
  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
  '&:hover': {
    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.5)',
  },
}));

const SuperModSlot = styled('div')(({ theme }) => ({
  width: 250,
  height: 250,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundSize: '100%',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundColor: 'transparent',
  position: 'relative',
  boxShadow: 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '70%',
    height: '70%',
    transform: 'translate(-50%, -50%) rotate(45deg)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease',
  },
  '&:hover::before': {
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
}));

const Submenu = styled('div')(({ theme }) => ({
  display: 'none',
  position: 'absolute',
  top: '100%',
  padding: '6px',
  zIndex: 1000,
  borderRadius: '0px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

interface AbilitySelectorProps {
  category: string;
  currentMod: ManifestPlug | ManifestAspect | ManifestStatPlug | null;
  mods: (ManifestPlug | ManifestAspect | ManifestStatPlug)[];
  index?: number;
}

export default function AbilitySelector({
  category,
  currentMod,
  mods,
  index,
}: AbilitySelectorProps) {
  const isEmptyMod = !currentMod || currentMod.itemHash === 0;
  const slotId = `${category}-${index ?? 0}`;

  const SlotComponent = category === 'SUPERS' ? SuperModSlot : ModSlot;

  const loadout = useSelector((state: RootState) => state.loadoutConfig.loadout.subclassConfig);

  const calculateAvailableFragmentSlots = useCallback(() => {
    return loadout.aspects.reduce((total, aspect) => total + (aspect.energyCapacity || 0), 0);
  }, [loadout.aspects]);

  const availableFragmentSlots = calculateAvailableFragmentSlots();
  const isDisabled = category === 'FRAGMENTS' && index! >= availableFragmentSlots;
  const modsPerPage = 10;

  const [startIndex, setStartIndex] = useState(0);
  const dispatch = useDispatch();

  const handleModSelect = (
    category: string,
    mod: ManifestPlug | ManifestAspect | ManifestStatPlug,
    index?: number
  ) => {
    let updatedMods;

    switch (category) {
      case 'ASPECTS':
        updatedMods = [...loadout.aspects] as ManifestAspect[];
        break;
      case 'FRAGMENTS':
        updatedMods = [...loadout.fragments] as ManifestStatPlug[];
        break;
      case 'SUPERS':
      case 'CLASS_ABILITIES':
      case 'MOVEMENT_ABILITIES':
      case 'MELEE_ABILITIES':
      case 'GRENADES':
        updatedMods = [mod] as ManifestPlug[];
        break;
      default:
        return;
    }

    if (category === 'ASPECTS' || category === 'FRAGMENTS') {
      const modIndex = updatedMods.findIndex(
        (existingMod) => existingMod.itemHash === mod.itemHash
      );

      if (modIndex !== -1 && modIndex !== index) {
        updatedMods[modIndex] = category === 'ASPECTS' ? EMPTY_ASPECT : EMPTY_FRAGMENT;
      }

      updatedMods[index!] = mod as (typeof updatedMods)[number];

      if (category === 'ASPECTS') {
        const newAspects = updatedMods as ManifestAspect[];
        const newAvailableSlots = newAspects.reduce(
          (total, aspect) => total + (aspect.energyCapacity || 0),
          0
        );

        const updatedFragments = loadout.fragments.map((fragment, idx) =>
          idx < newAvailableSlots ? fragment : EMPTY_FRAGMENT
        );

        dispatch(
          updateSubclassMods({
            category: 'ASPECTS',
            mods: newAspects,
          })
        );
        dispatch(
          updateSubclassMods({
            category: 'FRAGMENTS',
            mods: updatedFragments,
          })
        );
        return;
      }
    }

    dispatch(
      updateSubclassMods({
        category,
        mods: updatedMods,
      })
    );
  };

  return (
    mods && (
      <Box
        key={slotId}
        data-slot-id={slotId}
        sx={{
          position: 'relative',
          cursor: 'pointer',
          '&:hover .submenu-grid': { display: 'flex' },
          maxWidth: '100%',
          height: 'auto',
        }}
      >
        <HoverCard item={currentMod}>
          <SlotComponent
            style={{
              backgroundImage: currentMod ? `url(${currentMod.icon})` : 'none',
              opacity: isDisabled ? 0.5 : 1,
              pointerEvents: isDisabled ? 'none' : 'auto',
            }}
          >
            {isEmptyMod && (
              <Typography variant="caption" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {isDisabled ? 'Locked' : 'Empty'}
              </Typography>
            )}
          </SlotComponent>
        </HoverCard>

        <Submenu
          className="submenu-grid"
          sx={{
            left: index ? index * -90 : 0,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
          }}
        >
          <Stack direction="row" spacing={1}>
            {startIndex > 0 && (
              <IconButton
                sx={{
                  color: 'white',
                  height: '100%',
                  borderRadius: 0,
                  backgroundColor: 'grey',
                  opacity: 0.6,
                }}
                onClick={() => setStartIndex(Math.max(0, startIndex - modsPerPage))}
                disabled={startIndex === 0}
              >
                <ArrowLeft />
              </IconButton>
            )}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${mods.length < 5 ? mods.length : 5}, 74px)`,
                gap: '5px',
                justifyContent: 'center',
              }}
            >
              {mods?.slice(startIndex, startIndex + modsPerPage).map((mod) => (
                <Box key={mod.itemHash}>
                  <HoverCard item={mod}>
                    <Box
                      className="submenu-item"
                      sx={{
                        width: '74px',
                        height: '74px',
                        backgroundImage: `url(${mod.icon})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: 'rgba(10, 10, 10, 0.8)',
                        filter: !mod.isOwned ? 'grayscale(100%) brightness(50%)' : 'none',
                        transition: 'filter 0.3s ease',
                      }}
                      onClick={() => {
                        if (!isDisabled) handleModSelect(category, mod, index);
                      }}
                    />
                  </HoverCard>
                </Box>
              ))}
            </Box>
            {startIndex + modsPerPage < mods.length && (
              <IconButton
                sx={{
                  color: 'white',
                  height: '100%',
                  borderRadius: 0,
                  backgroundColor: 'grey',
                  opacity: 0.6,
                }}
                onClick={() =>
                  setStartIndex(Math.min(mods.length - modsPerPage, startIndex + modsPerPage))
                }
                disabled={startIndex + modsPerPage >= mods.length}
              >
                <ArrowRight />
              </IconButton>
            )}
          </Stack>
        </Submenu>
      </Box>
    )
  );
}
