import { Backdrop, Badge, Box, Button, Grid, LinearProgress, Paper, Tooltip } from '@mui/material';
import { store } from '../../../store';
import { Fragment, useState } from 'react';
import { EquipResult } from '../types';
import ArmorIcon from '../../../components/ArmorIcon';
import { CheckRounded, Close } from '@mui/icons-material';
import { STATUS } from '../constants';
import { ArmorEquipper } from '../util/armorEquipper';
import { DestinyArmor, SubclassConfig } from '../../../types/d2l-types';
import React from 'react';
import { SubclassEquipper } from '../util/subclassEquipper';
import { ManifestArmorStatMod, ManifestPlug } from '../../../types/manifest-types';
import { DAMAGE_TYPE } from '../../../lib/bungie_api/constants';

const EquipLoadout: React.FC = () => {
  const [processing, setProcessing] = useState<any[]>([]);
  const [equipStep, setEquipStep] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [results, setResults] = useState<EquipResult[][]>([]);
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
      const tempResults: EquipResult[][] = [];

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
    tempResults: EquipResult[][],
    armor: DestinyArmor,
    armorMods: { [key: number]: ManifestPlug | ManifestArmorStatMod }
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
    tempResults: EquipResult[][],
    subclassConfig: SubclassConfig
  ) => {
    tempEquipped.push(subclassConfig.subclass);
    setProcessing(tempEquipped);

    setEquipStep('Equipping ' + subclassConfig.subclass.name + ' ...');
    await equipper.equipSubclass(subclassConfig.subclass);

    setEquipStep('Equipping Super ...');
    await equipper.equipSubclassAbility(subclassConfig.super, 0);

    if (subclassConfig.classAbility) {
      setEquipStep('Equipping Class Ability...');
      await equipper.equipSubclassAbility(subclassConfig.classAbility, 1);
    }

    if (subclassConfig.movementAbility) {
      setEquipStep('Equipping Movement Ability...');
      await equipper.equipSubclassAbility(subclassConfig.movementAbility, 2);
    }

    if (subclassConfig.meleeAbility) {
      setEquipStep('Equipping Melee Ability...');
      await equipper.equipSubclassAbility(subclassConfig.meleeAbility, 3);
    }

    if (subclassConfig.grenade) {
      setEquipStep('Equipping Grenade Ability...');
      await equipper.equipSubclassAbility(subclassConfig.grenade, 4);
    }

    setEquipStep('Equipping Aspects ...');

    let aspectIndex = subclassConfig.damageType === DAMAGE_TYPE.KINETIC ? 7 : 5;

    await equipper.equipSubclassAspect(subclassConfig.aspects[0], aspectIndex);
    await equipper.equipSubclassAspect(subclassConfig.aspects[1], aspectIndex + 1);

    setEquipStep('Equipping Fragments ...');

    let fragmentIndex = subclassConfig.damageType === DAMAGE_TYPE.KINETIC ? 9 : 7;

    for (let i = 0; i < subclassConfig.fragments.length; i++) {
      await equipper.equipSubclassFragments(subclassConfig.fragments[i], fragmentIndex + i);
    }

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
                              results[index][0].operationsStatus === 'Success' ? (
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
                        {results[index][0].status === STATUS.SUCCESS ? (
                          <h3 style={{ color: 'green' }}>Mods Successfully Inserted</h3>
                        ) : (
                          results[index].slice(1).map((result) => (
                            <Tooltip title={result.operationsStatus}>
                              {result.status === STATUS.SUCCESS ? (
                                <>
                                  <CheckRounded sx={{ fontSize: 56, color: 'green' }} />
                                  {result.subject.name}
                                </>
                              ) : (
                                <>
                                  <Close sx={{ fontSize: 56, color: 'red' }} />
                                  {result.subject.name}
                                </>
                              )}
                            </Tooltip>
                          ))
                        )}
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
                    <h3>{equipStep}</h3>
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
