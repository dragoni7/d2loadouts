import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ArmorIcon from '../../../components/ArmorIcon';
import { updateLoadoutArmorMods } from '../../../store/LoadoutReducer';
import { DestinyArmor } from '../../../types/d2l-types';
import ArmorModSelector from './ArmorModSelector';
import { getSelectedModsBySlot, getModsBySlot } from '../util';
import { ManifestArmorMod, ManifestArmorStatMod } from '../../../types/manifest-types';
import { Grid } from '@mui/material';

interface ArmorConfigProps {
  armor: DestinyArmor;
  statMods: ManifestArmorMod[];
  artificeMods: ManifestArmorMod[];
}

const ArmorConfig: React.FC<ArmorConfigProps> = ({ armor, statMods, artificeMods }) => {
  const [armorMods, setArmorMods] = useState<(ManifestArmorMod | ManifestArmorStatMod)[]>([]);
  const [selectedMods, setSelectedMods] = useState<(ManifestArmorMod | ManifestArmorStatMod)[]>(
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

  const onSelectMod = async (mod: ManifestArmorMod | ManifestArmorStatMod, slot: number) => {
    let totalCost = mod.energyCost;
    for (const key in selectedMods) {
      if (Number(key) !== slot) {
        let statEnergyCost = armorMods.find(
          (mod) => mod.itemHash === selectedMods[key].itemHash
        )?.energyCost;
        let armorEnergyCost = statMods.find(
          (mod) => mod.itemHash === selectedMods[key].itemHash
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
        plug: mod,
      })
    );
    setSelectedMods(getSelectedModsBySlot(armor.type));
  };

  useEffect(() => {
    updateMods().catch(console.error);
  }, []);

  return (
    <Grid item container columns={{ md: 6, lg: 12 }} md={6} lg={9}>
      <Grid item md={1} lg={2}>
        <ArmorIcon armor={armor} />
      </Grid>
      <Grid item md={1} lg={2}>
        <ArmorModSelector
          selected={selectedMods[0]}
          mods={statMods}
          onSelectMod={(mod: ManifestArmorMod) => {
            onSelectMod(mod, 0);
          }}
        />
      </Grid>
      <Grid item md={1} lg={2}>
        <ArmorModSelector
          selected={selectedMods[1]}
          mods={armorMods}
          onSelectMod={(mod: ManifestArmorMod) => {
            onSelectMod(mod, 1);
          }}
        />
      </Grid>
      <Grid item md={1} lg={2}>
        <ArmorModSelector
          selected={selectedMods[2]}
          mods={armorMods}
          onSelectMod={(mod: ManifestArmorMod) => {
            onSelectMod(mod, 2);
          }}
        />
      </Grid>
      <Grid item md={1} lg={2}>
        <ArmorModSelector
          selected={selectedMods[3]}
          mods={armorMods}
          onSelectMod={(mod: ManifestArmorMod) => {
            onSelectMod(mod, 3);
          }}
        />
      </Grid>
      {armor.artifice === true ? (
        <Grid item md={1} lg={2}>
          <ArmorModSelector
            selected={selectedMods[4]}
            mods={artificeMods}
            onSelectMod={(mod: ManifestArmorMod) => {
              onSelectMod(mod, 4);
            }}
          />
        </Grid>
      ) : (
        false
      )}
    </Grid>
  );
};

export default ArmorConfig;
