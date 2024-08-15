import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ManifestPlug, ManifestSubclass, Plug } from '../types';
import { RootState } from '../store';
import { db } from '../store/db';
import { PLUG_CATEGORY_HASH } from '../lib/bungie_api/SubclassConstants';
import { updateSubclassMods } from '../store/LoadoutReducer';
import { Container, Box, Stack, Typography, Paper, Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AbilitiesModificationProps {
  onBackClick: () => void;
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
  width: 54,
  height: 54,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.background.default,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const OptionButton = styled(Button)(({ theme }) => ({
  width: 54,
  height: 54,
  padding: 0,
  minWidth: 'unset',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const getCategoryHashes = (subclass: ManifestSubclass) => {
  console.log('getCategoryHashes called with subclass:', subclass);
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

  console.log('Generated categoryHashes:', categoryHashes);
  return categoryHashes;
};

const fetchMods = async (subclass: ManifestSubclass) => {
  console.log('fetchMods called with subclass:', subclass);
  const categoryHashes = getCategoryHashes(subclass);
  const modsData: { [key: string]: ManifestPlug[] } = {};

  await Promise.all(
    Object.entries(categoryHashes).map(async ([key, hashes]) => {
      const typedHashes = hashes as number[];
      console.log(`Fetching mods for ${key} with hashes:`, typedHashes);
      const mods = await db.manifestSubclassModDef.where('category').anyOf(typedHashes).toArray();
      console.log(`Fetched mods for ${key}:`, mods);

      modsData[key] = Array.from(new Set(mods.map((mod) => mod.itemHash))).map((itemHash) =>
        mods.find((mod) => mod.itemHash === itemHash)
      ) as ManifestPlug[];
    })
  );

  console.log('Final modsData:', modsData);
  return modsData;
};

const AbilitiesModification: React.FC<AbilitiesModificationProps> = ({ onBackClick, subclass }) => {
  const [mods, setMods] = useState<{ [key: string]: ManifestPlug[] }>({});
  const [selectedMods, setSelectedMods] = useState<{ [key: string]: ManifestPlug[] }>({});
  const [modIcons, setModIcons] = useState<{ [key: string]: string }>({});
  const loadout = useSelector((state: RootState) => state.loadoutConfig.loadout.subclass);
  const dispatch = useDispatch();

  console.log('Component rendered with subclass:', subclass);
  console.log('Current loadout:', loadout);

  useEffect(() => {
    console.log('useEffect triggered');
    if (subclass) {
      console.log('Fetching mods for subclass:', subclass);
      fetchMods(subclass).then((fetchedMods) => {
        console.log('Mods fetched:', fetchedMods);
        setMods(fetchedMods);
        // Initialize selected mods based on loadout
        const initialSelectedMods: { [key: string]: ManifestPlug[] } = {};
        Object.keys(fetchedMods).forEach((category) => {
          initialSelectedMods[category] = [];
          if (loadout) {
            console.log(`Processing category: ${category}`);
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
            console.log(`Selected mods for ${category}:`, initialSelectedMods[category]);
          }
        });
        console.log('Initial selected mods:', initialSelectedMods);
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
        // Check if the mod is already selected in another slot
        const existingIndex = newMods.findIndex((m) => m.plugItemHash === String(mod.itemHash));
        if (existingIndex !== -1 && existingIndex !== index) {
          // If it exists in another slot, clear that slot
          newMods[existingIndex] = EMPTY_PLUG;
        }
        // Set the new mod in the current slot
        newMods[index] = { plugItemHash: String(mod.itemHash) };
      }
      payload = { category, mods: newMods };
    } else if (category === 'FRAGMENTS') {
      const newMods = [...loadout.fragments];
      if (index !== undefined && index < 5) {
        // Check if the mod is already selected in another slot
        const existingIndex = newMods.findIndex((m) => m.plugItemHash === String(mod.itemHash));
        if (existingIndex !== -1 && existingIndex !== index) {
          // If it exists in another slot, clear that slot
          newMods[existingIndex] = EMPTY_PLUG;
        }
        // Set the new mod in the current slot
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

      useEffect(() => {
        if (currentMod) {
          fetchModIcon(currentMod.plugItemHash).then(setCurrentModIcon);
        } else {
          setCurrentModIcon(null);
        }
      }, [currentMod]);

      const isEmptyMod = !currentMod || currentMod.plugItemHash === '';
      return (
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <ModSlot
              elevation={3}
              style={{
                backgroundImage: currentModIcon ? `url(${currentModIcon})` : 'none',
              }}
            >
              {isEmptyMod && <Typography variant="caption">Empty</Typography>}
            </ModSlot>
          </Grid>
          <Grid item xs>
            <Grid container spacing={1}>
              {mods[category]?.map((mod) => (
                <Grid item key={mod.itemHash}>
                  <OptionButton
                    onClick={() => handleModSelect(category, mod, index)}
                    style={{ backgroundImage: `url(${mod.icon})` }}
                    title={mod.name}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      );
    },
    [mods, handleModSelect, fetchModIcon]
  );

  return (
    <div className="abilities-modification">
      <Container maxWidth="md">
        <Box marginBottom={4}>
          <Typography variant="h4">{subclass.name}</Typography>
          <Button onClick={onBackClick}>Back</Button>
        </Box>

        <Box marginBottom={2}>
          <Typography variant="h6">Super</Typography>
          {renderModCategory('SUPERS', loadout.super)}
        </Box>

        <Box marginBottom={2}>
          <Typography variant="h6">Abilities</Typography>
          {renderModCategory('CLASS_ABILITIES', loadout.classAbility)}
          {renderModCategory('MOVEMENT_ABILITIES', loadout.movementAbility)}
          {renderModCategory('MELEE_ABILITIES', loadout.meleeAbility)}
          {renderModCategory('GRENADES', loadout.grenade)}
        </Box>

        <Box marginBottom={2}>
          <Typography variant="h6">Aspects</Typography>
          <Grid container spacing={1}>
            {[0, 1].map((index) => (
              <Grid item key={index} xs={12} sm={6}>
                {renderModCategory('ASPECTS', loadout.aspects[index] || EMPTY_PLUG, index)}
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box marginBottom={2}>
          <Typography variant="h6">Fragments</Typography>
          <Grid container spacing={1}>
            {[0, 1, 2, 3, 4].map((index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                {renderModCategory('FRAGMENTS', loadout.fragments[index] || EMPTY_PLUG, index)}
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default AbilitiesModification;
