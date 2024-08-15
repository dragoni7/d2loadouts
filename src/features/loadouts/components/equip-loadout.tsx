import { Button } from '@mui/material';
import { equipLoadout } from '../loadoutService';
import { store } from '../../../store';

const EquipLoadout: React.FC = () => {
  const onEquipLoadout = () => {
    const loadout = store.getState().loadoutConfig.loadout;

    // validate loadout
    if (
      loadout.characterId !== 0 &&
      loadout.helmet.instanceHash !== '' &&
      loadout.gauntlets.instanceHash !== '' &&
      loadout.chestArmor.instanceHash !== '' &&
      loadout.legArmor.instanceHash !== '' &&
      loadout.classArmor.instanceHash !== '' &&
      loadout.subclass.itemId
    ) {
      equipLoadout(loadout);
      alert('Loadout Equipping');
    } else {
      alert('Loadout Incomplete');
    }
  };

  return (
    <Button variant="contained" onClick={onEquipLoadout}>
      Equip Loadout
    </Button>
  );
};

export default EquipLoadout;
