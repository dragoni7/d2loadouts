import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ManifestPlug, ManifestSubclass, Plug } from '../types';
import { RootState } from '../store';
import { db } from '../store/db';
import { PLUG_CATEGORY_HASH } from '../lib/bungie_api/SubclassConstants';
import { updateSubclassMods } from '../store/LoadoutReducer';
import { Container, Box, Typography, Paper, Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AbilitiesModificationProps {
  subclass: ManifestSubclass;
}

const EMPTY_PLUG: Plug = {
  plugItemHash: '',
  socketArrayType: 0,
  socketIndex: -1,
};

const subclassTypeMap: { [key: number]: string } = {
  1: 'PRISMATIC',
  2: 'ARC',
  3: 'SOLAR',
  4: 'VOID',
  6: 'STASIS',
  7: 'STRAND',
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

const getCategoryHashes = (subclass: ManifestSubclass) => {
  const subclassType = subclassTypeMap[
    subclass.damageType
  ] as keyof typeof PLUG_CATEGORY_HASH.TITAN.ARC;
  const classType = subclass.class.toUpperCase() as 'TITAN' | 'HUNTER' | 'WARLOCK';

  const classAndSubclass =
    (PLUG_CATEGORY_HASH[classType] as Record<string, any>)[subclassType] || {};

  const categoryHashes = {
    SUPERS: Object.values(classAndSubclass.SUPERS || []),
    CLASS_ABILITIES: Object.values(classAndSubclass.CLASS_ABILITIES || []),
    MOVEMENT_ABILITIES: Object.values(classAndSubclass.MOVEMENT_ABILITIES || []),
    MELEE_ABILITIES: Object.values(classAndSubclass.MELEE_ABILITIES || []),
    GRENADES: Object.values(classAndSubclass.GRENADES || []),
    ASPECTS: Object.values(classAndSubclass.ASPECTS || []),
    FRAGMENTS: Object.values(classAndSubclass.FRAGMENTS || []),
  };

  return categoryHashes;
};

const fetchMods = async (subclass: ManifestSubclass) => {
  const categoryHashes = getCategoryHashes(subclass);
  const modsData: { [key: string]: ManifestPlug[] } = {};

  await Promise.all(
    Object.entries(categoryHashes).map(async ([key, hashes]) => {
      const typedHashes = hashes as number[];
      const mods = await db.manifestSubclassModDef.where('category').anyOf(typedHashes).toArray();
      modsData[key] = Array.from(new Set(mods.map((mod) => mod.itemHash))).map((itemHash) =>
        mods.find((mod) => mod.itemHash === itemHash)
      ) as ManifestPlug[];
    })
  );

  return modsData;
};

const AbilitiesModification: React.FC<AbilitiesModificationProps> = ({ subclass }) => {
  const [mods, setMods] = useState<{ [key: string]: ManifestPlug[] }>({});
  const [selectedMods, setSelectedMods] = useState<{ [key: string]: ManifestPlug[] }>({});
  const [modIcons, setModIcons] = useState<{ [key: string]: string }>({});
  const loadout = useSelector((state: RootState) => state.loadoutConfig.loadout.subclass);
  const dispatch = useDispatch();

  useEffect(() => {
    if (subclass) {
      fetchMods(subclass).then((fetchedMods) => {
        setMods(fetchedMods);

        const initialSelectedMods: { [key: string]: ManifestPlug[] } = {};
        Object.keys(fetchedMods).forEach((category) => {
          initialSelectedMods[category] = [];
          if (loadout) {
            switch (category) {
              case 'SUPERS':
                initialSelectedMods[category] = [
                  fetchedMods[category].find(
                    (mod) => String(mod.itemHash) === loadout.super.plugItemHash
                  ),
                ].filter(Boolean) as ManifestPlug[];
                break;
              case 'ASPECTS':
                initialSelectedMods[category] = loadout.aspects
                  .map((aspect) =>
                    fetchedMods[category].find(
                      (mod) => String(mod.itemHash) === aspect.plugItemHash
                    )
                  )
                  .filter(Boolean) as ManifestPlug[];
                break;
              case 'FRAGMENTS':
                initialSelectedMods[category] = loadout.fragments
                  .map((fragment) =>
                    fetchedMods[category].find(
                      (mod) => String(mod.itemHash) === fragment.plugItemHash
                    )
                  )
                  .filter(Boolean) as ManifestPlug[];
                break;
              case 'CLASS_ABILITIES':
                if (loadout.classAbility) {
                  initialSelectedMods[category] = [
                    fetchedMods[category].find(
                      (mod) => String(mod.itemHash) === loadout.classAbility?.plugItemHash
                    ),
                  ].filter(Boolean) as ManifestPlug[];
                }
                break;
              case 'MOVEMENT_ABILITIES':
                if (loadout.movementAbility) {
                  initialSelectedMods[category] = [
                    fetchedMods[category].find(
                      (mod) => String(mod.itemHash) === loadout.movementAbility?.plugItemHash
                    ),
                  ].filter(Boolean) as ManifestPlug[];
                }
                break;
              case 'MELEE_ABILITIES':
                if (loadout.meleeAbility) {
                  initialSelectedMods[category] = [
                    fetchedMods[category].find(
                      (mod) => String(mod.itemHash) === loadout.meleeAbility?.plugItemHash
                    ),
                  ].filter(Boolean) as ManifestPlug[];
                }
                break;
              case 'GRENADES':
                if (loadout.grenade) {
                  initialSelectedMods[category] = [
                    fetchedMods[category].find(
                      (mod) => String(mod.itemHash) === loadout.grenade?.plugItemHash
                    ),
                  ].filter(Boolean) as ManifestPlug[];
                }
                break;
            }
          }
        });
        setSelectedMods(initialSelectedMods);
      });
    }
  }, [subclass, loadout]);

  const fetchModIcon = useCallback(
    async (plugItemHash: string): Promise<string> => {
      if (modIcons[plugItemHash]) return modIcons[plugItemHash];

      const mod = await db.manifestSubclassModDef
        .where('itemHash')
        .equals(Number(plugItemHash))
        .first();
      if (mod && mod.icon) {
        setModIcons((prev) => ({ ...prev, [plugItemHash]: mod.icon }));
        return mod.icon;
      }
      return '';
    },
    [modIcons]
  );

  const handleModSelect = (category: string, mod: ManifestPlug, index?: number) => {
    let payload;

    if (category === 'ASPECTS') {
      const newMods = [...loadout.aspects];
      if (index !== undefined && index < 2) {
        // Remove the mod from its previous position if it exists elsewhere
        const existingIndex = newMods.findIndex((m) => m?.plugItemHash === String(mod.itemHash));
        if (existingIndex !== -1) {
          newMods[existingIndex] = EMPTY_PLUG;
        }
        newMods[index] = { plugItemHash: String(mod.itemHash) };
      }
      payload = { category, mods: newMods };
    } else if (category === 'FRAGMENTS') {
      const newMods = Array(5)
        .fill(EMPTY_PLUG)
        .map((plug, i) => loadout.fragments[i] || plug);
      if (index !== undefined && index < 5) {
        // Remove the mod from its previous position if it exists elsewhere
        const existingIndex = newMods.findIndex((m) => m?.plugItemHash === String(mod.itemHash));
        if (existingIndex !== -1) {
          newMods[existingIndex] = EMPTY_PLUG;
        }
        newMods[index] = { plugItemHash: String(mod.itemHash) };
      }
      payload = { category, mods: newMods };
    } else {
      payload = { category, mods: [{ plugItemHash: String(mod.itemHash) }] };
    }

    dispatch(updateSubclassMods(payload));
  };

  const renderModCategory = useCallback(
    (category: string, currentMod: Plug | null, index?: number) => {
      const [currentModIcon, setCurrentModIcon] = useState<string | null>(null);
      const [isHovered, setIsHovered] = useState<boolean>(false);
      const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });

      useEffect(() => {
        if (currentMod) {
          fetchModIcon(currentMod.plugItemHash).then(setCurrentModIcon);
        } else {
          setCurrentModIcon(null);
        }
      }, [currentMod]);

      const isEmptyMod = !currentMod || currentMod.plugItemHash === '';

      const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setSubmenuPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
        setIsHovered(true);
      };

      const SlotComponent = category === 'SUPERS' ? SuperModSlot : ModSlot;

      return (
        <Box position="relative" display="inline-block">
          <div onMouseEnter={handleMouseEnter} onMouseLeave={() => setIsHovered(false)}>
            <SlotComponent
              style={{
                backgroundImage: currentModIcon ? `url(${currentModIcon})` : 'none',
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
    [mods, handleModSelect, fetchModIcon]
  );
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
                {[0, 1].map((index) => (
                  <React.Fragment key={index}>
                    {renderModCategory('ASPECTS', loadout.aspects[index] || EMPTY_PLUG, index)}
                  </React.Fragment>
                ))}
              </Box>
            </Box>

            <Box marginBottom={2}>
              <StyledTitle variant="h6">FRAGMENTS</StyledTitle>
              <Box display="flex" flexWrap="wrap" gap={2}>
                {[0, 1, 2, 3, 4].map((index) => (
                  <React.Fragment key={index}>
                    {renderModCategory('FRAGMENTS', loadout.fragments[index] || EMPTY_PLUG, index)}
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
