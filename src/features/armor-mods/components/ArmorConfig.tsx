import { useState, useEffect, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ArmorIcon from '../../../components/ArmorIcon';
import { updateLoadoutArmorMods, updateRequiredStatMods } from '../../../store/LoadoutReducer';
import { armorMods, DestinyArmor } from '../../../types/d2l-types';
import ArmorModSelector from './ArmorModSelector';
import { getModsBySlot } from '../mod-utils';
import { ManifestArmorMod, ManifestArmorStatMod } from '../../../types/manifest-types';
import { Alert, Grid, Fade, Snackbar, SnackbarCloseReason, CircularProgress } from '@mui/material';
import { RootState, store } from '../../../store';
import { PLUG_CATEGORY_HASH } from '../../../lib/bungie_api/constants';

interface ArmorConfigProps {
  armor: DestinyArmor;
  statMods: (ManifestArmorMod | ManifestArmorStatMod)[];
  artificeMods: (ManifestArmorMod | ManifestArmorStatMod)[];
}

interface SnackbarMessage {
  message: string;
  key: number;
}

const ArmorConfig: React.FC<ArmorConfigProps> = ({ armor, statMods, artificeMods }) => {
  const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(undefined);
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

  const calculateAvailableEnergy = (currentSlot: number) => {
    const totalEnergyCost = selectedMods.reduce((total, mod, index) => {
      return index !== currentSlot ? total + mod.energyCost : total;
    }, 0);
    return 10 - totalEnergyCost; // Assuming max energy is 10
  };

  const onSelectMod = async (mod: ManifestArmorMod | ManifestArmorStatMod, slot: number) => {
    if (selectedMods[slot].itemHash === mod.itemHash) return;

    if (!mod.isOwned) {
      setSnackPack((prev) => [
        ...prev,
        { message: 'You do not own ' + mod.name, key: new Date().getTime() },
      ]);
      return;
    }

    if ('unique' in mod && mod.unique && selectedMods.includes(mod)) {
      setSnackPack((prev) => [
        ...prev,
        { message: mod.name + ' is unique. Only equip one copy', key: new Date().getTime() },
      ]);
      return;
    }

    const availableEnergy = calculateAvailableEnergy(slot);
    if (mod.energyCost > availableEnergy) {
      setSnackPack((prev) => [
        ...prev,
        { message: 'Not enough energy to equip ' + mod.name, key: new Date().getTime() },
      ]);
      return;
    }

    dispatch(
      updateLoadoutArmorMods({
        armorType: armor.type,
        slot: slot,
        plug: mod,
      })
    );

    const requiredMods = store.getState().loadoutConfig.loadout.requiredStatMods;

    if (
      (requiredMods.length > 0 && mod.category === PLUG_CATEGORY_HASH.ARMOR_MODS.STAT_ARMOR_MODS) ||
      mod.category === PLUG_CATEGORY_HASH.ARMOR_MODS.ARTIFICE_ARMOR_MODS
    ) {
      const newRequired = [...requiredMods];
      const idx = newRequired.findIndex((required) => required.mod === selectedMods[slot]);
      newRequired[idx] = { mod: newRequired[idx].mod, equipped: false };

      dispatch(updateRequiredStatMods(newRequired));
    }
  };

  function handleSnackbarClose(event: SyntheticEvent | Event, reason?: SnackbarCloseReason) {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  }

  function handleExited() {
    setMessageInfo(undefined);
  }

  useEffect(() => {
    updateMods().catch(console.error);
  }, []);

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setSnackbarOpen(true);
    } else if (snackPack.length && messageInfo && snackbarOpen) {
      setSnackbarOpen(false);
    }
  }, [snackPack, messageInfo, snackbarOpen]);

  return (
    <>
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
        {selectedMods ? (
          <>
            <Grid item md={1}>
              <ArmorModSelector
                selected={selectedMods[0]}
                mods={statMods}
                onSelectMod={(mod: ManifestArmorMod | ManifestArmorStatMod) => onSelectMod(mod, 0)}
                availableEnergy={calculateAvailableEnergy(0)}
              />
            </Grid>
            <Grid item md={1}>
              <ArmorModSelector
                selected={selectedMods[1]}
                mods={armorMods}
                onSelectMod={(mod: ManifestArmorMod | ManifestArmorStatMod) => onSelectMod(mod, 1)}
                availableEnergy={calculateAvailableEnergy(1)}
              />
            </Grid>
            <Grid item md={1}>
              <ArmorModSelector
                selected={selectedMods[2]}
                mods={armorMods}
                onSelectMod={(mod: ManifestArmorMod | ManifestArmorStatMod) => onSelectMod(mod, 2)}
                availableEnergy={calculateAvailableEnergy(2)}
              />
            </Grid>
            <Grid item md={1}>
              <ArmorModSelector
                selected={selectedMods[3]}
                mods={armorMods}
                onSelectMod={(mod: ManifestArmorMod | ManifestArmorStatMod) => onSelectMod(mod, 3)}
                availableEnergy={calculateAvailableEnergy(3)}
              />
            </Grid>
            {armor.artifice === true ? (
              <Grid item md={1}>
                <ArmorModSelector
                  selected={selectedMods[4]}
                  mods={artificeMods}
                  onSelectMod={(mod: ManifestArmorMod | ManifestArmorStatMod) =>
                    onSelectMod(mod, 4)
                  }
                  availableEnergy={calculateAvailableEnergy(4)}
                />
              </Grid>
            ) : (
              <Grid item md={1} />
            )}
          </>
        ) : (
          [...Array(5).keys()].map((i) => (
            <Grid item md={1} key={i}>
              <CircularProgress />
            </Grid>
          ))
        )}
      </Grid>
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={3000}
        TransitionComponent={Fade}
        TransitionProps={{ onExited: handleExited }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" variant="filled">
          {messageInfo ? messageInfo.message : undefined}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ArmorConfig;
