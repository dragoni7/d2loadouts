import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid, Stack } from '@mui/material';
import { ARMOR_ARRAY, STATS } from '../lib/bungie_api/constants';
import { RootState } from '../store';
import { StatName, ArmorModKeys } from '../types/d2l-types';
import { ManifestStatPlug } from '../types/manifest-types';
import { statIcons } from '../util/constants';

const BuildStats: React.FC = () => {
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
            loadout[(armor + 'Mods') as ArmorModKeys][0][`${stat}Mod` as keyof ManifestStatPlug]
          ) |
            0) +
          (loadout[armor].artifice
            ? Number(
                loadout[(armor + 'Mods') as ArmorModKeys][4][`${stat}Mod` as keyof ManifestStatPlug]
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
    <Stack
      padding={1}
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {(STATS as StatName[]).map((stat) => (
        <Stack alignItems="center" spacing={1}>
          <img width="60%" height="60%" src={statIcons[stat]} alt={stat} />
          <Typography color="white" fontWeight="bold" variant="body2">
            {totalStats[stat]}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

export default BuildStats;
