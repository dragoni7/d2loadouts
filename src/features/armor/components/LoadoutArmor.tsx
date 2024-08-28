import React, { useEffect, useState } from 'react';
import './ArmorMods.css';
import { store } from '../../../store';
import { db } from '../../../store/db';
import { PLUG_CATEGORY_HASH } from '../../../lib/bungie_api/constants';
import Stack from '@mui/material/Stack';
import { Box, Container } from '@mui/system';
import ArmorConfig from './ArmorConfig';
import { ManifestArmorMod } from '../../../types/manifest-types';
import { Grid } from '@mui/material';

const LoadoutArmor: React.FC = () => {
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
    <Grid container rowGap={3} columnGap={1.5} marginLeft={5}>
      <Grid item md={12}>
        Required Mods:
      </Grid>
      {requiredMods.map((mod, index) => (
        <Grid item key={index}>
          <img src={mod.icon} style={{ backgroundColor: 'black', height: 81, width: 81 }} />
        </Grid>
      ))}
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

export default LoadoutArmor;
