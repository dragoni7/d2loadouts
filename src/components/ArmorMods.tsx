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

const ArmorMods: React.FC = () => {
  const currentConfig = store.getState().loadoutConfig.loadout;
  const [statMods, setStatMods] = useState<ManifestArmorMod[]>([]);
  const [artificeMods, setArtificeMods] = useState<ManifestArmorMod[]>([]);

  useEffect(() => {
    const gatherMods = async () => {
      setStatMods(
        (
          await db.manifestArmorModDef
            .where('category')
            .equals(PLUG_CATEGORY_HASH.ARMOR_MODS.STAT_ARMOR_MODS)
            .toArray()
        ).sort((a, b) =>
          a.name.localeCompare('Empty Mod Socket') === 0
            ? -1
            : b.name.localeCompare('Empty Mod Socket') === 0
            ? 1
            : a.name.localeCompare(b.name)
        )
      );
      setArtificeMods(
        (
          await db.manifestArmorModDef
            .where('category')
            .equals(PLUG_CATEGORY_HASH.ARMOR_MODS.ARTIFICE_ARMOR_MODS)
            .toArray()
        ).sort((a, b) =>
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
    <div className="customization-panel">
      <div className="armor-slots">
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
      </div>
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

      if (totalCost > 10) return;
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
      <ArmorIcon armor={armor} size={81} />
      <div className="mod-grid">
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
      </div>
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
    <div
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
    </div>
  );
};

export default ArmorMods;
