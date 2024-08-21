import { Backdrop, Badge, Box, Button, Grid, LinearProgress, Paper, Tooltip } from '@mui/material';
import { store } from '../../../store';
import { Fragment, useState } from 'react';
import { EquipResult } from '../types';
import ArmorIcon from '../../../components/ArmorIcon';
import { CheckRounded, Close } from '@mui/icons-material';
import { STATUS } from '../constants';
import { ArmorEquipper } from '../util/armorEquipper';
import { DestinyArmor, Plug, SubclassConfig } from '../../../types/d2l-types';
import React from 'react';
import { SubclassEquipper } from '../util/subclassEquipper';

const EquipLoadout: React.FC = () => {
  const [processing, setProcessing] = useState<any[]>([]);
  const [equipStep, setEquipStep] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [results, setResults] = useState<EquipResult[]>([]);
  const [equipping, setEquipping] = useState<boolean>(false);

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
      loadout.subclassConfig.subclass
    ) {
      setOpen(true);
      setEquipping(true);
      const armorEquipper = new ArmorEquipper();
      const tempEquipped: any[] = [];
      const tempResults: EquipResult[] = [];

      await armorEquipper.setCharacter(loadout.characterId);

      await processArmor(
        tempEquipped,
        armorEquipper,
        tempResults,
        loadout.helmet,
        loadout.helmetMods
      );
      await processArmor(
        tempEquipped,
        armorEquipper,
        tempResults,
        loadout.gauntlets,
        loadout.gauntletMods
      );
      await processArmor(
        tempEquipped,
        armorEquipper,
        tempResults,
        loadout.chestArmor,
        loadout.chestArmorMods
      );
      await processArmor(
        tempEquipped,
        armorEquipper,
        tempResults,
        loadout.legArmor,
        loadout.legArmorMods
      );

      const subclassEquipper = new SubclassEquipper();
      subclassEquipper.setCharacter(loadout.characterId);

      await processSubclass(tempEquipped, subclassEquipper, tempResults, loadout.subclassConfig);

      setEquipStep('Finished');
      setEquipping(false);
    } else {
      alert('Loadout Incomplete');
    }
  };

  const processArmor = async (
    tempEquipped: DestinyArmor[],
    equipper: ArmorEquipper,
    tempResults: EquipResult[],
    armor: DestinyArmor,
    armorMods: { [key: number]: Plug }
  ) => {
    tempEquipped.push(armor);
    setProcessing(tempEquipped);
    setEquipStep('Equipping ' + armor.name + ' ...');
    await equipper.equipArmor(armor);
    setEquipStep('Inserting Mods in ' + armor.name + '...');
    await equipper.equipArmorMods(armorMods);
    tempResults.push(equipper.getResult());
    setResults(tempResults);
  };

  const processSubclass = async (
    tempEquipped: any[],
    equipper: SubclassEquipper,
    tempResults: EquipResult[],
    subclassConfig: SubclassConfig
  ) => {
    tempEquipped.push(subclassConfig.subclass);
    setProcessing(tempEquipped);

    setEquipStep('Equipping ' + subclassConfig.subclass.name + ' ...');
    await equipper.equipSubclass(subclassConfig.subclass);

    setEquipStep('Equipping Super ...');
    await equipper.equipSubclassAbility(subclassConfig.super);

    if (subclassConfig.classAbility) {
      setEquipStep('Equipping Class Ability...');
      await equipper.equipSubclassAbility(subclassConfig.classAbility);
    }

    if (subclassConfig.movementAbility) {
      setEquipStep('Equipping Movement Ability...');
      await equipper.equipSubclassAbility(subclassConfig.movementAbility);
    }

    if (subclassConfig.meleeAbility) {
      setEquipStep('Equipping Melee Ability...');
      await equipper.equipSubclassAbility(subclassConfig.meleeAbility);
    }

    if (subclassConfig.grenade) {
      setEquipStep('Equipping Grenade Ability...');
      await equipper.equipSubclassAbility(subclassConfig.grenade);
    }

    setEquipStep('Equipping Aspects ...');
    await equipper.equipSubclassAspect(subclassConfig.aspects[0]);
    await equipper.equipSubclassAspect(subclassConfig.aspects[1]);

    setEquipStep('Equipping Fragments ...');
    await equipper.equipSubclassFragments(subclassConfig.fragments);

    const result = equipper.getResult();
    tempResults.push(result);
    setResults(tempResults);
  };

  return (
    <Box>
      <Button variant="contained" onClick={onEquipLoadout}>
        Equip Loadout
      </Button>
      <Backdrop open={open} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Paper
          elevation={1}
          sx={{
            display: 'flex',
            position: 'absolute',
            width: '25vw',
            height: '95vh',
            backgroundColor: '#1c1c21',
            color: 'white',
          }}
        >
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            alignItems="flex-end"
            paddingTop={1}
            paddingLeft={1}
            paddingBottom={4}
          >
            <Fragment>
              {processing.map((item, index) => (
                <Fragment>
                  {results[index] !== undefined ? (
                    <Fragment>
                      <Grid item md={2}>
                        <Tooltip title={'Equipped'}>
                          <Badge
                            badgeContent={
                              results[index].operationsStatus[0] === 'Success' ? (
                                <CheckRounded sx={{ fontSize: 50, color: 'green' }} />
                              ) : (
                                <Close sx={{ fontSize: 50, color: 'red' }} />
                              )
                            }
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          >
                            <ArmorIcon armor={item} size={64}></ArmorIcon>
                          </Badge>
                        </Tooltip>
                      </Grid>
                      <Grid item md={9}>
                        {results[index].status === STATUS.SUCCESS
                          ? 'Success'
                          : results[index]?.operationsStatus
                              .slice(1)
                              .map((error) => (
                                <Tooltip title={error}>
                                  {error === 'Success' ? (
                                    <CheckRounded sx={{ fontSize: 56, color: 'green' }} />
                                  ) : (
                                    <Close sx={{ fontSize: 56, color: 'red' }} />
                                  )}
                                </Tooltip>
                              ))}
                      </Grid>
                    </Fragment>
                  ) : (
                    <Grid container item justifyContent="center" spacing={3}>
                      <Grid item md={12} textAlign="center">
                        <ArmorIcon armor={item} size={64} />
                      </Grid>
                      <Grid item md={4}>
                        <LinearProgress color="inherit" />
                      </Grid>
                      <Grid item md={12} textAlign="center">
                        {equipStep}
                      </Grid>
                    </Grid>
                  )}
                </Fragment>
              ))}
              {equipping ? (
                false
              ) : (
                <Fragment>
                  <Grid item md={12} textAlign="center">
                    {equipStep}
                  </Grid>
                  <Grid item md={3} textAlign="center">
                    <Button
                      onClick={() => {
                        setOpen(false);
                        setResults([]);
                        setProcessing([]);
                        setEquipStep('');
                      }}
                    >
                      Back
                    </Button>
                  </Grid>
                  <Grid item md={3} textAlign="center">
                    <Button>Share</Button>
                  </Grid>
                  <Grid item md={3} textAlign="center">
                    <Button>Save in-game</Button>
                  </Grid>
                </Fragment>
              )}
            </Fragment>
          </Grid>
        </Paper>
      </Backdrop>
    </Box>
  );
};

export default EquipLoadout;
