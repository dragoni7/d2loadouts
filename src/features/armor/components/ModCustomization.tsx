import React, { useEffect, useState } from 'react';
import { store } from '../../../store';
import { db } from '../../../store/db';
import { PLUG_CATEGORY_HASH } from '../../../lib/bungie_api/constants';
import ArmorConfig from './ArmorConfig';
import { ManifestArmorMod, ManifestArmorStatMod } from '../../../types/manifest-types';
import { Grid, styled, Tooltip, Typography } from '@mui/material';

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
  const [requiredMods, setRequiredMods] = useState<ManifestArmorMod[]>([]);

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

      const requiredStatMods = store.getState().loadoutConfig.loadout.requiredStatMods;
      const allStatMods = dbStatMods.concat(dbArtificeMods);
      let matches: ManifestArmorMod[] = [];

      for (const mod of requiredStatMods) {
        const found = allStatMods.find((statMod) => statMod.itemHash === mod.itemHash);
        if (found) matches.push(found);
      }

      setRequiredMods(matches);
    };

    gatherMods().catch(console.error);
  }, []);

  return (
    <Grid container columns={{ md: 6 }}>
      <Grid item md={6} marginBottom={5} marginX={{ md: 5, lg: 8 }}>
        <StyledTitle>MOD CUSTOMIZATION</StyledTitle>
      </Grid>
      <Grid item container columns={{ md: 10 }} md={10} marginBottom={5} marginX={{ md: 5, lg: 8 }}>
        <Grid item md={10}>
          <StyledSubTitle>SELECTED MODS</StyledSubTitle>
        </Grid>
        {requiredMods.map((mod, index) => (
          <Grid item key={index} md={1}>
            <Tooltip title={mod.name}>
              <img
                src={mod.icon}
                style={{
                  maxWidth: '91px',
                  width: '58%',
                  height: 'auto',
                  backgroundColor: 'black',
                }}
              />
            </Tooltip>
          </Grid>
        ))}
      </Grid>
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
