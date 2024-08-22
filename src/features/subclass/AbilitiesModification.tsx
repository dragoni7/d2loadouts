import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Paper, Button, Typography, styled, CircularProgress } from '@mui/material';
import { Box, Container } from '@mui/system';
import { PLUG_CATEGORY_HASH } from '../../lib/bungie_api/subclass-constants';
import { RootState } from '../../store';
import { db } from '../../store/db';
import { updateSubclassMods } from '../../store/LoadoutReducer';
import {
  ManifestSubclass,
  ManifestPlug,
  ManifestAspect,
  ManifestStatPlug,
} from '../../types/manifest-types';
import { DamageType } from '../../types/d2l-types';

interface AbilitiesModificationProps {
  subclass: ManifestSubclass;
}

export const EMPTY_MANIFEST_PLUG: ManifestPlug = {
  perkName: '',
  perkDescription: '',
  perkIcon: '',
  category: 0,
  isOwned: false,
  itemHash: 0,
  name: '',
  icon: '',
};

export const EMPTY_ASPECT: ManifestAspect = {
  energyCapacity: 0,
  perkName: '',
  perkDescription: '',
  perkIcon: '',
  category: 0,
  isOwned: false,
  itemHash: 0,
  name: '',
  icon: '',
};

export const EMPTY_FRAGMENT: ManifestStatPlug = {
  mobilityMod: 0,
  resilienceMod: 0,
  recoveryMod: 0,
  disciplineMod: 0,
  intellectMod: 0,
  strengthMod: 0,
  perkName: '',
  perkDescription: '',
  perkIcon: '',
  category: 0,
  isOwned: false,
  itemHash: 0,
  name: '',
  icon: '',
};

const subclassTypeMap: { [key in DamageType]: string } = {
  1: 'PRISMATIC',
  2: 'ARC',
  3: 'SOLAR',
  4: 'VOID',
  6: 'STASIS',
  7: 'STRAND',
  5: '',
};

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

const SubmenuContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  zIndex: 1500,
  padding: theme.spacing(1.5),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  maxWidth: '550px',
  boxShadow: theme.shadows[10],
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),
}));

const OptionButton = styled(Button)(({ theme }) => ({
  width: 74,
  height: 74,
  padding: 0,
  minWidth: 'unset',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: 0,
  margin: theme.spacing(0.25),
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

const StyledTitle = styled(Typography)(({ theme }) => ({
  opacity: 0.7,
  borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(2),
  width: '40%',
}));

const fetchMods = async (subclass: ManifestSubclass) => {
  const modsData: { [key: string]: (ManifestPlug | ManifestAspect | ManifestStatPlug)[] } = {
    SUPERS: [],
    CLASS_ABILITIES: [],
    MOVEMENT_ABILITIES: [],
    MELEE_ABILITIES: [],
    GRENADES: [],
    ASPECTS: [],
    FRAGMENTS: [],
  };

  const classType = subclass.class.toUpperCase() as keyof typeof PLUG_CATEGORY_HASH;
  const damageType = subclassTypeMap[
    subclass.damageType as DamageType
  ] as keyof (typeof PLUG_CATEGORY_HASH)[typeof classType];

  if (!PLUG_CATEGORY_HASH[classType] || !PLUG_CATEGORY_HASH[classType][damageType]) {
    console.error(`Invalid class type ${classType} or damage type ${damageType}`);
    return modsData;
  }

  const categoryHashes = PLUG_CATEGORY_HASH[classType][damageType];

  try {
    const queries = [
      { category: 'SUPERS', table: db.manifestSubclassModDef, hash: categoryHashes.SUPERS },
      {
        category: 'CLASS_ABILITIES',
        table: db.manifestSubclassModDef,
        hash: categoryHashes.CLASS_ABILITIES,
      },
      {
        category: 'MOVEMENT_ABILITIES',
        table: db.manifestSubclassModDef,
        hash: categoryHashes.MOVEMENT_ABILITIES,
      },
      {
        category: 'MELEE_ABILITIES',
        table: db.manifestSubclassModDef,
        hash: categoryHashes.MELEE_ABILITIES,
      },
      { category: 'GRENADES', table: db.manifestSubclassModDef, hash: categoryHashes.GRENADES },
      { category: 'ASPECTS', table: db.manifestSubclassAspectsDef, hash: categoryHashes.ASPECTS },
      {
        category: 'FRAGMENTS',
        table: db.manifestSubclassFragmentsDef,
        hash: categoryHashes.FRAGMENTS,
      },
    ];

    await Promise.all(
      queries.map(async ({ category, table, hash }) => {
        const hashValues = Object.values(hash);
        const results = await table.where('category').anyOf(hashValues).toArray();
        modsData[category] = results;
      })
    );

    return modsData;
  } catch (error) {
    console.error('Error fetching mods:', error);
    return modsData;
  }
};

const AbilitiesModification: React.FC<AbilitiesModificationProps> = ({ subclass }) => {
  const [mods, setMods] = useState<{
    [key: string]: (ManifestPlug | ManifestAspect | ManifestStatPlug)[];
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });
  const dispatch = useDispatch();
  const loadout = useSelector((state: RootState) => state.loadoutConfig.loadout.subclassConfig);

  useEffect(() => {
    if (subclass) {
      setLoading(true);
      setError(null);
      fetchMods(subclass)
        .then((modsData) => {
          setMods(modsData);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to fetch mods. Please try again.');
          setLoading(false);
        });
    }
  }, [subclass]);

  const handleModSelect = (
    category: string,
    mod: ManifestPlug | ManifestAspect | ManifestStatPlug,
    index?: number
  ) => {
    let updatedMods;

    switch (category) {
      case 'ASPECTS':
        updatedMods = [...loadout.aspects];
        break;
      case 'FRAGMENTS':
        updatedMods = [...loadout.fragments];
        break;
      case 'SUPERS':
      case 'CLASS_ABILITIES':
      case 'MOVEMENT_ABILITIES':
      case 'MELEE_ABILITIES':
      case 'GRENADES':
        updatedMods = [mod];
        break;
      default:
        return;
    }

    // Check if the mod already exists in another slot and replace it with an empty mod
    if (category === 'ASPECTS' || category === 'FRAGMENTS') {
      const modIndex = updatedMods.findIndex(
        (existingMod) => existingMod.itemHash === mod.itemHash
      );

      if (modIndex !== -1 && modIndex !== index) {
        updatedMods[modIndex] = category === 'ASPECTS' ? EMPTY_ASPECT : EMPTY_FRAGMENT;
      }

      // Assign the mod to the selected slot
      updatedMods[index!] = mod;
    } else {
      // Directly assign the mod for SUPERS and abilities
      updatedMods[0] = mod;
    }

    dispatch(
      updateSubclassMods({
        category,
        mods: updatedMods,
      })
    );
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>, slotId: string) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSubmenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setHoveredSlot(slotId);
  };

  const handleMouseLeave = () => {
    setHoveredSlot(null);
  };

  const renderModCategory = useCallback(
    (
      category: string,
      currentMod: ManifestPlug | ManifestAspect | ManifestStatPlug | null,
      index?: number
    ) => {
      const isEmptyMod = !currentMod || currentMod.itemHash === 0;
      const slotId = `${category}-${index ?? 0}`;
      const isHovered = hoveredSlot === slotId;

      const SlotComponent = category === 'SUPERS' ? SuperModSlot : ModSlot;

      return (
        <Box key={slotId} position="relative" display="inline-block">
          <div onMouseEnter={(e) => handleMouseEnter(e, slotId)} onMouseLeave={handleMouseLeave}>
            <SlotComponent
              style={{
                backgroundImage: currentMod ? `url(${currentMod.icon})` : 'none',
              }}
            >
              {isEmptyMod && (
                <Typography variant="caption" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Empty
                </Typography>
              )}
            </SlotComponent>
            {isHovered && (
              <SubmenuContainer
                style={{
                  top: submenuPosition.top,
                  left: submenuPosition.left,
                }}
              >
                {mods[category]?.map((mod) => (
                  <OptionButton
                    key={mod.itemHash}
                    onClick={() => handleModSelect(category, mod, index)}
                    style={{ backgroundImage: `url(${mod.icon})` }}
                    title={mod.name}
                  />
                ))}
              </SubmenuContainer>
            )}
          </div>
        </Box>
      );
    },
    [mods, handleModSelect, hoveredSlot, submenuPosition]
  );

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <div className="abilities-modification">
      <Container maxWidth="md">
        <Box marginBottom={4} marginTop={10}>
          <StyledTitle variant="h4">{subclass.name}</StyledTitle>
        </Box>

        <Box display="flex" flexDirection="row" gap={10}>
          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
            marginTop={15}
          >
            {renderModCategory('SUPERS', loadout.super)}
          </Box>

          <Box flex={3}>
            <Box marginBottom={2}>
              <StyledTitle variant="h6">ABILITIES</StyledTitle>
              <Box display="flex" flexWrap="wrap" gap={2}>
                {renderModCategory('CLASS_ABILITIES', loadout.classAbility)}
                {renderModCategory('MOVEMENT_ABILITIES', loadout.movementAbility)}
                {renderModCategory('MELEE_ABILITIES', loadout.meleeAbility)}
                {renderModCategory('GRENADES', loadout.grenade)}
              </Box>
            </Box>

            <Box marginBottom={2}>
              <StyledTitle variant="h6">ASPECTS</StyledTitle>
              <Box display="flex" flexWrap="wrap" gap={2}>
                {loadout.aspects.map((aspect, index) => (
                  <React.Fragment key={index}>
                    {renderModCategory('ASPECTS', aspect, index)}
                  </React.Fragment>
                ))}
              </Box>
            </Box>

            <Box marginBottom={2}>
              <StyledTitle variant="h6">FRAGMENTS</StyledTitle>
              <Box display="flex" flexWrap="wrap" gap={2}>
                {loadout.fragments.map((fragment, index) => (
                  <React.Fragment key={index}>
                    {renderModCategory('FRAGMENTS', fragment, index)}
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default AbilitiesModification;
