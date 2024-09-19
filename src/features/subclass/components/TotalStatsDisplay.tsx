import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { Box, Typography, Grid } from '@mui/material';
import { ARMOR_ARRAY, STATS } from '../../../lib/bungie_api/constants';
import { RootState } from '../../../store';
import { StatName, DestinyArmor, armorMods } from '../../../types/d2l-types';
import {
  ManifestArmorMod,
  ManifestArmorStatMod,
  ManifestStatPlug,
} from '../../../types/manifest-types';
import { statIcons } from '../../../util/constants';

const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '0px',
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: theme.spacing(0, 1),
}));

const StatIcon = styled('img')({
  width: 24,
  height: 24,
});

const StatValue = styled(Typography)({
  color: 'white',
  fontWeight: 'bold',
});

function isStatsMod(mod: unknown): mod is ManifestArmorStatMod {
  return (
    typeof mod === 'object' &&
    mod !== null &&
    ('mobilityMod' in mod ||
      'resilienceMod' in mod ||
      'recoveryMod' in mod ||
      'disciplineMod' in mod ||
      'intellectMod' in mod ||
      'strengthMod' in mod)
  );
}

const TotalStatsDisplay: React.FC = () => {
  const loadout = useSelector((state: RootState) => state.loadoutConfig.loadout);

  const totalStats = useMemo(() => {
    const stats: Record<StatName, number> = {
      mobility: 0,
      resilience: 0,
      recovery: 0,
      discipline: 0,
      intellect: 0,
      strength: 0,
    };

    // add stats from armor + mods
    ARMOR_ARRAY.forEach((armor) => {
      (STATS as StatName[]).forEach((stat) => {
        stats[stat] +=
          loadout[armor][stat] +
          (Number(
            loadout[(armor + 'Mods') as armorMods][0][`${stat}Mod` as keyof ManifestStatPlug]
          ) |
            0) +
          (loadout[armor].artifice
            ? Number(
                loadout[(armor + 'Mods') as armorMods][4][`${stat}Mod` as keyof ManifestStatPlug]
              ) | 0
            : 0);
      });
    });

    // Add stats from fragments
    loadout.subclassConfig.fragments.forEach((fragment) => {
      (STATS as StatName[]).forEach((stat) => {
        const fragmentStat = `${stat}Mod` as keyof typeof fragment;
        stats[stat] += Number(fragment[fragmentStat]) || 0;
      });
    });

    return stats;
  }, [loadout]);

  return (
    <StatsContainer>
      <Grid container spacing={1} justifyContent="center">
        {(STATS as StatName[]).map((stat) => (
          <Grid item key={stat}>
            <StatItem>
              <StatIcon src={statIcons[stat]} alt={stat} />
              <StatValue variant="body2">{totalStats[stat]}</StatValue>
            </StatItem>
          </Grid>
        ))}
      </Grid>
    </StatsContainer>
  );
};

export default TotalStatsDisplay;
