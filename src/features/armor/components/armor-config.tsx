import { Stack } from '@mui/system';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ArmorIcon from '../../../components/ArmorIcon';
import { updateLoadoutArmorMods } from '../../../store/LoadoutReducer';
import { DestinyArmor, ManifestArmorMod, Plug } from '../../../types';
import ArmorModSelector from './armor-mod-selector';
import { getSelectedModsBySlot, getModsBySlot } from '../../loadouts/util';

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
        <ArmorModSelector
          selected={selectedMods[0]}
          mods={statMods}
          onSelectMod={(mod: ManifestArmorMod) => {
            onSelectMod(mod, 0, 0);
          }}
        />
        <ArmorModSelector
          selected={selectedMods[1]}
          mods={armorMods}
          onSelectMod={(mod: ManifestArmorMod) => {
            onSelectMod(mod, 1, 1);
          }}
        />
        <ArmorModSelector
          selected={selectedMods[2]}
          mods={armorMods}
          onSelectMod={(mod: ManifestArmorMod) => {
            onSelectMod(mod, 2, 2);
          }}
        />
        <ArmorModSelector
          selected={selectedMods[3]}
          mods={armorMods}
          onSelectMod={(mod: ManifestArmorMod) => {
            onSelectMod(mod, 3, 3);
          }}
        />
        {armor.artifice === true ? (
          <ArmorModSelector
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

export default ArmorConfig;
