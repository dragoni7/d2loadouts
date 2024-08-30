import React, { useEffect, useState } from 'react';
import { store } from '../../../store';
import { db } from '../../../store/db';
import { PLUG_CATEGORY_HASH } from '../../../lib/bungie_api/constants';
import ArmorConfig from './ArmorConfig';
import { ManifestArmorMod } from '../../../types/manifest-types';
import { Grid, Stack, styled, Tooltip, Typography } from '@mui/material';

const StyledTitle = styled(Typography)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(2),
  fontSize: '28px',
  fontWeight: 'bold',
}));

const StyledSubTitle = styled(Typography)(({ theme }) => ({
  opacity: 0.7,
  borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(2),
  width: '90%',
}));

const ModCustomization: React.FC = () => {
  const currentConfig = store.getState().loadoutConfig.loadout;
  const [statMods, setStatMods] = useState<ManifestArmorMod[]>([]);
  const [artificeMods, setArtificeMods] = useState<ManifestArmorMod[]>([]);
  const requiredMods = store.getState().loadoutConfig.loadout.requiredStatMods;

  useEffect(() => {
    const gatherMods = async () => {
      const dbStatMods = await db.manifestArmorStatModDef
        .where('category')
        .equals(PLUG_CATEGORY_HASH.ARMOR_MODS.STAT_ARMOR_MODS)
        .toArray();

      const dbArtificeMods = await db.manifestArmorStatModDef
        .where('category')
        .equals(PLUG_CATEGORY_HASH.ARMOR_MODS.ARTIFICE_ARMOR_MODS)
        .toArray();

      setStatMods(
        dbStatMods.sort((a, b) =>
          a.name.localeCompare('Empty Mod Socket') === 0
            ? -1
            : b.name.localeCompare('Empty Mod Socket') === 0
            ? 1
            : a.name.localeCompare(b.name)
        )
      );
      setArtificeMods(
        dbArtificeMods.sort((a, b) =>
          a.name.localeCompare('Empty Mod Socket') === 0
            ? -1
            : b.name.localeCompare('Empty Mod Socket') === 0
            ? 1
            : a.name.localeCompare(b.name)
        )
      );
    };

    gatherMods().catch(console.error);
  }, []);

  return (
    <Grid container>
      <Grid item md={12} marginBottom={5} marginX={{ md: 5, lg: 8 }}>
        <StyledTitle>MOD CUSTOMIZATION</StyledTitle>
      </Grid>
      {requiredMods.length !== 0 ? (
        <>
          <Grid item md={12} marginLeft={{ md: 4, lg: 8 }}>
            <StyledSubTitle>REQUIRED MODS</StyledSubTitle>
          </Grid>
          <Grid item md={10} marginBottom={6} marginLeft={{ md: 4, lg: 8 }}>
            <Stack direction="row" spacing={2}>
              {requiredMods.map((mod) => (
                <Tooltip title={mod.name}>
                  <img
                    src={mod.icon}
                    style={{
                      maxWidth: '71px',
                      width: '58%',
                      height: 'auto',
                      backgroundColor: 'black',
                    }}
                  />
                </Tooltip>
              ))}
            </Stack>
          </Grid>
        </>
      ) : (
        <Grid item md={12} marginBottom={6} marginLeft={{ md: 4, lg: 8 }} />
      )}
      {/* Helmet */}
      <ArmorConfig armor={currentConfig.helmet} statMods={statMods} artificeMods={artificeMods} />
      {/* Gauntlets */}
      <ArmorConfig
        armor={currentConfig.gauntlets}
        statMods={statMods}
        artificeMods={artificeMods}
      />
      {/* Chest Armor */}
      <ArmorConfig
        armor={currentConfig.chestArmor}
        statMods={statMods}
        artificeMods={artificeMods}
      />
      {/* Leg Armor */}
      <ArmorConfig armor={currentConfig.legArmor} statMods={statMods} artificeMods={artificeMods} />
      {/* Class Armor */}
      <ArmorConfig
        armor={currentConfig.classArmor}
        statMods={statMods}
        artificeMods={artificeMods}
      />
    </Grid>
  );
};

export default ModCustomization;
