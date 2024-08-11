import React, { useEffect, useState } from 'react';
import './ArmorMods.css';
import { store } from '../store';
import ArmorIcon from './ArmorIcon';
import { DestinyArmor, ManifestArmorMod } from '../types';
import { getModsBySlot, getSelectedModsBySlot } from '../features/loadouts/util';
import { db } from '../store/db';
import { PLUG_CATEGORY_HASH } from '../lib/bungie_api/Constants';

const ArmorMods: React.FC = () => {
  const currentConfig = store.getState().loadoutConfig.loadout;

  return (
    <div className="customization-panel">
      <div className="armor-slots">
        {/* Helmet */}
        <ArmorConfig armor={currentConfig.helmet} />
        {/* Gauntlets */}
        <ArmorConfig armor={currentConfig.gauntlets} />
        {/* Chest Armor */}
        <ArmorConfig armor={currentConfig.chestArmor} />
        {/* Leg Armor */}
        <ArmorConfig armor={currentConfig.legArmor} />
        {/* Class Armor */}
        <ArmorConfig armor={currentConfig.classArmor} />
      </div>
    </div>
  );
};

interface ArmorConfigProps {
  armor: DestinyArmor;
}

const ArmorConfig: React.FC<ArmorConfigProps> = ({ armor }) => {
  const [armorMods, setArmorMods] = useState<ManifestArmorMod[]>([]);
  const [statMods, setStatMods] = useState<ManifestArmorMod[]>([]);
  const [artificeMods, setArtificeMods] = useState<ManifestArmorMod[]>([]);
  const selectedMods = getSelectedModsBySlot(armor.type);

  useEffect(() => {
    const gatherMods = async () => {
      setArmorMods(
        (await getModsBySlot(armor.type)).sort((a, b) =>
          a.name.localeCompare('Empty Mod Socket') === 0
            ? -1
            : b.name.localeCompare('Empty Mod Socket') === 0
            ? 1
            : a.name.localeCompare(b.name)
        )
      );
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
  });

  return (
    <div key={armor.name} className="armor-slot">
      <ArmorIcon armor={armor} size={81} />
      <div className="mod-grid">
        <ModSelector mods={statMods} />
        <ModSelector mods={armorMods} />
        <ModSelector mods={armorMods} />
        <ModSelector mods={armorMods} />
        <ModSelector mods={artificeMods} />
      </div>
    </div>
  );
};

interface ModSelectorProps {
  mods: ManifestArmorMod[];
}

const ModSelector: React.FC<ModSelectorProps> = ({ mods }) => {
  return (
    <div className="mod">
      {'mod'}
      <div className="submenu-grid">
        {mods.map((mod) => (
          <div
            key={mod.itemHash}
            className="submenu-item"
            style={{ backgroundImage: `url(${mod.icon})` }}
          >
            <div className="submenu-item-name">{mod.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArmorMods;
