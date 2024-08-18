import { Backdrop, Badge, Box, Button, LinearProgress, Paper, Stack, Tooltip } from '@mui/material';
import { store } from '../../../store';
import { useState } from 'react';
import { EquipResult } from '../types';
import ArmorIcon from '../../../components/ArmorIcon';
import { CheckRounded, Close } from '@mui/icons-material';
import { STATUS } from '../constants';
import { LoadoutEquipper } from '../loadoutEquipper';
import { DestinyArmor, Plug } from '../../../types';
import React from 'react';

const EquipLoadout: React.FC = () => {
  const [processing, setProcessing] = useState<DestinyArmor[]>([]);
  const [equipStep, setEquipStep] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [results, setResults] = useState<EquipResult[]>([]);

  const onEquipLoadout = async () => {
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
      setOpen(true);
      const equipper = new LoadoutEquipper();
      const tempEquipped: DestinyArmor[] = [];
      const tempResults: EquipResult[] = [];

      await equipper.setCharacter(loadout.characterId);

      await processArmor(tempEquipped, equipper, tempResults, loadout.helmet, loadout.helmetMods);
      await processArmor(
        tempEquipped,
        equipper,
        tempResults,
        loadout.gauntlets,
        loadout.gauntletMods
      );
      await processArmor(
        tempEquipped,
        equipper,
        tempResults,
        loadout.chestArmor,
        loadout.chestArmorMods
      );
      await processArmor(
        tempEquipped,
        equipper,
        tempResults,
        loadout.legArmor,
        loadout.legArmorMods
      );

      setEquipStep('Finished');
    } else {
      alert('Loadout Incomplete');
    }
  };

  const processArmor = async (
    tempEquipped: DestinyArmor[],
    equipper: LoadoutEquipper,
    tempResults: EquipResult[],
    armor: DestinyArmor,
    armorMods: { [key: number]: Plug }
  ) => {
    tempEquipped.push(armor);
    setProcessing(tempEquipped);
    setEquipStep('Inserting Mods in ' + armor.name + '...');
    await equipper.equipArmorMods(armor, armorMods);
    setEquipStep('Equipping ' + armor.name + ' ...');
    await equipper.equipArmor(armor);
    tempResults.push(equipper.getResult());
    setResults(tempResults);
  };

  return (
    <Box>
      <Button variant="contained" onClick={onEquipLoadout}>
        Equip Loadout
      </Button>
      <Backdrop
        open={open}
        onClick={() => {
          setOpen(false);
          setResults([]);
          setProcessing([]);
          setEquipStep('');
        }}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Paper
          elevation={1}
          sx={{
            display: 'flex',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            width: '25vw',
            height: '95vh',
            backgroundColor: '#1c1c21',
            color: 'white',
          }}
        >
          <Stack spacing={1} width={'90%'} alignItems={'center'}>
            {processing.map((item, index) => (
              <Box>
                {results[index] !== undefined ? (
                  <Badge
                    badgeContent={
                      results[index].operationsStatus[0] === 'Success' ? (
                        <CheckRounded sx={{ fontSize: 50, color: 'green' }} />
                      ) : (
                        <Close sx={{ fontSize: 50, color: 'red' }} />
                      )
                    }
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  >
                    <ArmorIcon armor={item} size={64}></ArmorIcon>
                  </Badge>
                ) : (
                  <ArmorIcon armor={item} size={64} />
                )}
                <p>
                  {results[index] !== undefined ? (
                    results[index].status === STATUS.SUCCESS ? (
                      'Success'
                    ) : (
                      <Stack direction={'row'} width={'100%'}>
                        {results[index]?.operationsStatus.slice(1).map((error) => (
                          <Tooltip title={error}>
                            {error === 'Success' ? (
                              <CheckRounded sx={{ fontSize: 50, color: 'green' }} />
                            ) : (
                              <Close sx={{ fontSize: 50, color: 'red' }} />
                            )}
                          </Tooltip>
                        ))}
                      </Stack>
                    )
                  ) : (
                    <LinearProgress color="inherit" sx={{ width: '100%' }} />
                  )}
                </p>
              </Box>
            ))}
            <p> {equipStep} </p>
          </Stack>
        </Paper>
      </Backdrop>
    </Box>
  );
};

export default EquipLoadout;
