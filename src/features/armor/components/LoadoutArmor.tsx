import React, { useEffect, useState } from 'react';
import './ArmorMods.css';
import { store } from '../../../store';
import { db } from '../../../store/db';
import { PLUG_CATEGORY_HASH } from '../../../lib/bungie_api/constants';
import Stack from '@mui/material/Stack';
import { Box, Container } from '@mui/system';
import ArmorConfig from './ArmorConfig';
import { ManifestArmorMod } from '../../../types/manifest-types';

const LoadoutArmor: React.FC = () => {
  const currentConfig = store.getState().loadoutConfig.loadout;
  const [statMods, setStatMods] = useState<ManifestArmorMod[]>([]);
  const [artificeMods, setArtificeMods] = useState<ManifestArmorMod[]>([]);
  const [requiredMods, setRequiredMods] = useState<ManifestArmorMod[]>([]);

  useEffect(() => {
    const gatherMods = async () => {
      const dbStatMods = await db.manifestArmorModDef
        .where('category')
        .equals(PLUG_CATEGORY_HASH.ARMOR_MODS.STAT_ARMOR_MODS)
        .toArray();

      const dbArtificeMods = await db.manifestArmorModDef
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
        const found = allStatMods.find((statMod) => String(statMod.itemHash) === mod.plugItemHash);
        if (found) matches.push(found);
      }

      setRequiredMods(matches);
    };

    gatherMods().catch(console.error);
  }, []);

  return (
    <div className="customization-panel">
      <Container maxWidth="md">
        <Box marginBottom={4} marginLeft={1.5}>
          <Stack direction="row" spacing={3}>
            <Box width={81} height={81}>
              Required Mods:
            </Box>
            {requiredMods.map((mod) => (
              <Box
                className="armor-mod-slot"
                style={{
                  backgroundImage: `url(${mod.icon})`,
                }}
              />
            ))}
          </Stack>
        </Box>
        <Stack spacing={2} className="armor-slots">
          {/* Helmet */}
          <ArmorConfig
            armor={currentConfig.helmet}
            statMods={statMods}
            artificeMods={artificeMods}
          />
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
          <ArmorConfig
            armor={currentConfig.legArmor}
            statMods={statMods}
            artificeMods={artificeMods}
          />
          {/* Class Armor */}
          <ArmorConfig
            armor={currentConfig.classArmor}
            statMods={statMods}
            artificeMods={artificeMods}
          />
        </Stack>
      </Container>
    </div>
  );
};

export default LoadoutArmor;
