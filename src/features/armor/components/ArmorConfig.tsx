import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ArmorIcon from '../../../components/ArmorIcon';
import { updateLoadoutArmorMods, updateRequiredStatMods } from '../../../store/LoadoutReducer';
import { armorMods, DestinyArmor } from '../../../types/d2l-types';
import ArmorModSelector from './ArmorModSelector';
import { getModsBySlot } from '../mod-utils';
import { ManifestArmorMod, ManifestArmorStatMod } from '../../../types/manifest-types';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState, store } from '../../../store';
import { PLUG_CATEGORY_HASH } from '../../../lib/bungie_api/constants';

interface ArmorConfigProps {
  armor: DestinyArmor;
  statMods: ManifestArmorMod[];
  artificeMods: ManifestArmorMod[];
}

const ArmorConfig: React.FC<ArmorConfigProps> = ({ armor, statMods, artificeMods }) => {
  const [armorMods, setArmorMods] = useState<(ManifestArmorMod | ManifestArmorStatMod)[]>([]);
  const selectedMods: (ManifestArmorMod | ManifestArmorStatMod)[] = useSelector(
    (state: RootState) => state.loadoutConfig.loadout[(armor.type + 'Mods') as armorMods]
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

    if (
      mod.category === PLUG_CATEGORY_HASH.ARMOR_MODS.STAT_ARMOR_MODS ||
      mod.category === PLUG_CATEGORY_HASH.ARMOR_MODS.ARTIFICE_ARMOR_MODS
    ) {
      const newRequired = [...store.getState().loadoutConfig.loadout.requiredStatMods];
      const idx = newRequired.findIndex((required) => required.mod === selectedMods[slot]);
      newRequired[idx] = { mod: newRequired[idx].mod, equipped: false };

      dispatch(updateRequiredStatMods(newRequired));
    }
  };

  useEffect(() => {
    updateMods().catch(console.error);
  }, []);

  return (
    <Grid
      item
      container
      columns={{ md: 7 }}
      alignItems="center"
      justifyContent="center"
      alignContent="flex-start"
    >
      <Grid item md={1} textAlign="end">
        <ArmorIcon armor={armor} />
      </Grid>
      <Grid item md={1}>
        <hr
          style={{
            opacity: 0.7,
            border: 'none',
            width: '90%',
            height: '2px',
            color: 'rgba(255, 255, 255, 0.5)',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
        />
      </Grid>
      <Grid item md={1}>
        <ArmorModSelector
          selected={selectedMods[0]}
          mods={statMods}
          onSelectMod={(mod: ManifestArmorMod) => {
            onSelectMod(mod, 0);
          }}
        />
      </Grid>
      <Grid item md={1}>
        <ArmorModSelector
          selected={selectedMods[1]}
          mods={armorMods}
          onSelectMod={(mod: ManifestArmorMod) => {
            onSelectMod(mod, 1);
          }}
        />
      </Grid>
      <Grid item md={1}>
        <ArmorModSelector
          selected={selectedMods[2]}
          mods={armorMods}
          onSelectMod={(mod: ManifestArmorMod) => {
            onSelectMod(mod, 2);
          }}
        />
      </Grid>
      <Grid item md={1}>
        <ArmorModSelector
          selected={selectedMods[3]}
          mods={armorMods}
          onSelectMod={(mod: ManifestArmorMod) => {
            onSelectMod(mod, 3);
          }}
        />
      </Grid>
      {armor.artifice === true ? (
        <Grid item md={1}>
          <ArmorModSelector
            selected={selectedMods[4]}
            mods={artificeMods}
            onSelectMod={(mod: ManifestArmorMod) => {
              onSelectMod(mod, 4);
            }}
          />
        </Grid>
      ) : (
        <Grid item md={1} />
      )}
    </Grid>
  );
};

export default ArmorConfig;
