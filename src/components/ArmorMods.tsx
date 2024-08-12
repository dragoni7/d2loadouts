import React, { useEffect, useState } from 'react';
import './ArmorMods.css';
import { store } from '../store';
import ArmorIcon from './ArmorIcon';
import { DestinyArmor, ManifestArmorMod, Plug } from '../types';
import { getModsBySlot, getSelectedModsBySlot } from '../features/loadouts/util';
import { db } from '../store/db';
import { PLUG_CATEGORY_HASH } from '../lib/bungie_api/Constants';
import { useDispatch } from 'react-redux';
import { updateLoadoutArmorMods } from '../store/LoadoutReducer';
import Stack from '@mui/material/Stack';
import { Box, Container } from '@mui/system';
import { Grid } from '@mui/material';

const ArmorMods: React.FC = () => {
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
                className="mod-slot"
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

interface ArmorConfigProps {
  armor: DestinyArmor;
  statMods: ManifestArmorMod[];
  artificeMods: ManifestArmorMod[];
}

const ArmorConfig: React.FC<ArmorConfigProps> = ({ armor, statMods, artificeMods }) => {
  const [armorMods, setArmorMods] = useState<ManifestArmorMod[]>([]);
  const [selectedMods, setSelectedMods] = useState<{ [key: number]: Plug }>(
    getSelectedModsBySlot(armor.type)
  );
  const dispatch = useDispatch();

  const updateMods = async () => {
    setArmorMods(
      (await getModsBySlot(armor.type)).sort((a, b) =>
        a.name.localeCompare('Empty Mod Socket') === 0
          ? -1
          : b.name.localeCompare('Empty Mod Socket') === 0
          ? 1
          : a.name.localeCompare(b.name)
      )
    );
  };

  const onSelectMod = async (mod: ManifestArmorMod, slot: number, socketIndex: number) => {
    let totalCost = mod.energyCost;

    for (const key in selectedMods) {
      if (Number(key) !== slot) {
        let statEnergyCost = armorMods.find(
          (mod) => String(mod.itemHash) === selectedMods[key].plugItemHash
        )?.energyCost;
        let armorEnergyCost = statMods.find(
          (mod) => String(mod.itemHash) === selectedMods[key].plugItemHash
        )?.energyCost;

        totalCost += statEnergyCost ? statEnergyCost : armorEnergyCost ? armorEnergyCost : 0;
      }

      if (totalCost > 10) {
        return;
      }
    }

    dispatch(
      updateLoadoutArmorMods({
        armorType: armor.type,
        slot: slot,
        plug: {
          plugItemHash: String(mod.itemHash),
          socketArrayType: 0,
          socketIndex: socketIndex,
        },
      })
    );
    setSelectedMods(getSelectedModsBySlot(armor.type));
  };

  useEffect(() => {
    updateMods().catch(console.error);
  }, []);

  return (
    <div key={armor.name} className="armor-slot">
      <Stack direction="row" spacing={3}>
        <ArmorIcon armor={armor} size={81} />
        <ModSelector
          selected={selectedMods[0]}
          mods={statMods}
          onSelectMod={(mod: ManifestArmorMod) => {
            onSelectMod(mod, 0, 0);
          }}
        />
        <ModSelector
          selected={selectedMods[1]}
          mods={armorMods}
          onSelectMod={(mod: ManifestArmorMod) => {
            onSelectMod(mod, 1, 1);
          }}
        />
        <ModSelector
          selected={selectedMods[2]}
          mods={armorMods}
          onSelectMod={(mod: ManifestArmorMod) => {
            onSelectMod(mod, 2, 2);
          }}
        />
        <ModSelector
          selected={selectedMods[3]}
          mods={armorMods}
          onSelectMod={(mod: ManifestArmorMod) => {
            onSelectMod(mod, 3, 3);
          }}
        />
        {armor.artifice === true ? (
          <ModSelector
            selected={selectedMods[4]}
            mods={artificeMods}
            onSelectMod={(mod: ManifestArmorMod) => {
              onSelectMod(mod, 4, 11);
            }}
          />
        ) : (
          false
        )}
      </Stack>
    </div>
  );
};

interface ModSelectorProps {
  selected: Plug;
  mods: ManifestArmorMod[];
  onSelectMod: (mod: ManifestArmorMod) => void;
}

const ModSelector: React.FC<ModSelectorProps> = ({ selected, mods, onSelectMod }) => {
  return (
    <Box
      className="mod-slot"
      style={{
        backgroundImage: `url(${
          mods.find((mod) => {
            return mod.itemHash === Number(selected.plugItemHash);
          })?.icon
        })`,
      }}
    >
      <div className="submenu-grid">
        {mods.map((mod) => (
          <div
            key={mod.itemHash}
            className="submenu-item"
            style={{ backgroundImage: `url(${mod.icon})` }}
            onClick={() => {
              if (selected.plugItemHash !== String(mod.itemHash)) {
                onSelectMod(mod);
              }
            }}
          >
            <div className="submenu-item-name">{mod.name}</div>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default ArmorMods;
