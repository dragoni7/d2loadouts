import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography, styled, CircularProgress, Stack } from '@mui/material';
import { Box, Container } from '@mui/system';
import { PLUG_CATEGORY_HASH } from '../../../lib/bungie_api/subclass-constants';
import { RootState } from '../../../store';
import { db } from '../../../store/db';
import { ManifestPlug, ManifestAspect, ManifestStatPlug } from '../../../types/manifest-types';
import { DamageType, SubclassConfig } from '../../../types/d2l-types';
import { EMPTY_FRAGMENT } from '../../../lib/bungie_api/constants';
import { BoldTitle } from '@/components/BoldTitle';
import AbilitySelector from './AbilitySelector';

interface AbilitiesModificationProps {
  subclass: SubclassConfig;
}

const subclassTypeMap: { [key in DamageType]: string } = {
  1: 'PRISMATIC',
  2: 'ARC',
  3: 'SOLAR',
  4: 'VOID',
  6: 'STASIS',
  7: 'STRAND',
  5: '',
};
const SectionSubtitle = styled(Typography)(({ theme }) => ({
  opacity: 0.7,
  borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const fetchMods = async (subclass: SubclassConfig) => {
  const modsData: { [key: string]: (ManifestPlug | ManifestAspect | ManifestStatPlug)[] } = {
    SUPERS: [],
    CLASS_ABILITIES: [],
    MOVEMENT_ABILITIES: [],
    MELEE_ABILITIES: [],
    GRENADES: [],
    ASPECTS: [],
    FRAGMENTS: [],
  };

  const classType = subclass.subclass.class.toUpperCase() as keyof typeof PLUG_CATEGORY_HASH;
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
    <Container maxWidth="md">
      <Stack
        direction="row"
        textAlign="start"
        alignItems="center"
        justifyContent="flex-start"
        columnGap={1}
      >
        <img src={subclass.subclass.icon} width="8%" height="auto" />
        <BoldTitle variant="h4">{subclass.subclass.name.toLocaleUpperCase()}</BoldTitle>
      </Stack>
      <Box display="flex" flexDirection="row" gap={5}>
        <Box flex={1} display="flex" justifyContent="center" alignItems="flex-start" marginTop={15}>
          <AbilitySelector category="SUPERS" currentMod={loadout.super} mods={mods['SUPERS']} />
        </Box>
        <Box flex={3}>
          <Box marginBottom={2}>
            <SectionSubtitle variant="h6" width="71%">
              ABILITIES
            </SectionSubtitle>
            <Box display="flex" flexWrap="wrap" gap={2}>
              <AbilitySelector
                category="CLASS_ABILITIES"
                currentMod={loadout.classAbility}
                index={0}
                mods={mods['CLASS_ABILITIES']}
              />

              <AbilitySelector
                category="MOVEMENT_ABILITIES"
                currentMod={loadout.movementAbility}
                index={1}
                mods={mods['MOVEMENT_ABILITIES']}
              />

              <AbilitySelector
                category="MELEE_ABILITIES"
                currentMod={loadout.meleeAbility}
                index={0}
                mods={mods['MELEE_ABILITIES']}
              />
              <AbilitySelector
                category="GRENADES"
                currentMod={loadout.grenade}
                index={1}
                mods={mods['GRENADES']}
              />
            </Box>
          </Box>
          <Box marginBottom={2}>
            <SectionSubtitle variant="h6" width="34%">
              ASPECTS
            </SectionSubtitle>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {loadout.aspects.map((aspect, index) => (
                <AbilitySelector
                  category="ASPECTS"
                  currentMod={aspect}
                  index={index}
                  mods={mods['ASPECTS']}
                />
              ))}
            </Box>
          </Box>
          <Box>
            <SectionSubtitle variant="h6" width="89%">
              FRAGMENTS
            </SectionSubtitle>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {Array.from({ length: 5 }).map((_, index) => (
                <React.Fragment key={index}>
                  <AbilitySelector
                    category="FRAGMENTS"
                    currentMod={loadout.fragments[index] || EMPTY_FRAGMENT}
                    index={index}
                    mods={mods['FRAGMENTS']}
                  />
                </React.Fragment>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default AbilitiesModification;
