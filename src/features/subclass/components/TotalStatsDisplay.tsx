import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import { Box, Typography, Grid } from '@mui/material';
import { STATS } from '../../../lib/bungie_api/constants';
import { RootState } from '../../../store';
import { StatName, DestinyArmor } from '../../../types/d2l-types';
import { ManifestArmorStatMod, ManifestStatPlug } from '../../../types/manifest-types';

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

const statIcons: Record<StatName, string> = {
  mobility: 'assets/mob.png',
  resilience: 'assets/res.png',
  recovery: 'assets/rec.png',
  discipline: 'assets/disc.png',
  intellect: 'assets/int.png',
  strength: 'assets/str.png',
};

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

    // Sum up armor stats
    const armorPieces: DestinyArmor[] = [
      loadout.helmet,
      loadout.gauntlets,
      loadout.chestArmor,
      loadout.legArmor,
      loadout.classArmor,
    ];
    armorPieces.forEach((armor) => {
      (STATS as StatName[]).forEach((stat) => {
        stats[stat] += Number(armor[stat]) || 0;
      });
    });

    // Add stats from armor mods in slot 0
    const armorMods = [
      loadout.helmetMods[0],
      loadout.gauntletsMods[0],
      loadout.chestArmorMods[0],
      loadout.legArmorMods[0],
      loadout.classArmorMods[0],
    ];

    armorMods.forEach((mod) => {
      if (isStatsMod(mod)) {
        (STATS as StatName[]).forEach((stat) => {
          const modStat = `${stat}Mod` as keyof ManifestStatPlug;
          stats[stat] += Number(mod[modStat]) || 0;
        });
      }
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
