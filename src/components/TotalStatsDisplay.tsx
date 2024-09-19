import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid } from '@mui/material';
import { ARMOR_ARRAY, STATS } from '../lib/bungie_api/constants';
import { RootState } from '../store';
import { StatName, armorMods } from '../types/d2l-types';
import { ManifestStatPlug } from '../types/manifest-types';
import { statIcons } from '../util/constants';

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
    <Box
      alignItems="center"
      justifyContent="center"
      padding={1}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '0px',
      }}
    >
      <Grid container spacing={1} justifyContent="center">
        {(STATS as StatName[]).map((stat) => (
          <Grid item key={stat}>
            <Box alignItems="center" margin={1}>
              <img width={24} height={24} src={statIcons[stat]} alt={stat} />
              <Typography color="white" fontWeight="bold" variant="body2">
                {totalStats[stat]}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TotalStatsDisplay;
