import { Backdrop, Box, Button, Container, Grid, Paper, Tooltip } from '@mui/material';
import { store } from '../../../store';
import { useState } from 'react';
import { EquipResult } from '../types';
import { STATUS } from '../constants';
import { ArmorEquipper } from '../util/armorEquipper';
import { DestinyArmor, SubclassConfig } from '../../../types/d2l-types';
import React from 'react';
import { SubclassEquipper } from '../util/subclassEquipper';
import { ManifestArmorMod, ManifestArmorStatMod } from '../../../types/manifest-types';
import { DAMAGE_TYPE } from '../../../lib/bungie_api/constants';
import LoadingBorder from './LoadingBorder';
import FadeIn from './FadeIn';

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
    armorMods: { [key: number]: ManifestArmorMod | ManifestArmorStatMod }
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
          elevation={5}
          sx={{
            width: '100%',
            height: '87%',
            backgroundColor: 'rgba(40,40,40,0.8)',
            borderTop: '8px solid rgba(100,100,100,1.0)',
            borderRadius: '0',
            color: 'white',
          }}
        >
          <Grid container height="100%">
            {equipping ? (
              false
            ) : (
              <Grid
                item
                md={12}
                lg={12}
                textAlign="center"
                sx={{ backgroundColor: 'rgba(48,48,48,0.8)' }}
              >
                <FadeIn>
                  <h2>{equipStep}</h2>
                </FadeIn>
              </Grid>
            )}
            <Grid container item md={12} lg={12} spacing={2} py={4}>
              {processing.map((item, index) => (
                <>
                  {results[index] !== undefined ? (
                    <>
                      <Grid item md={2} lg={2} />
                      <Grid item md={2}>
                        <FadeIn duration={1000}>
                          <Tooltip
                            title={
                              results[index][0].status === STATUS.SUCCESS
                                ? 'Equipped'
                                : results[index][0].message
                            }
                          >
                            <img
                              src={results[index][0].subject.icon}
                              width={72}
                              height={72}
                              style={{
                                border: `4px solid ${
                                  results[index][0].status === STATUS.SUCCESS ? 'green' : 'red'
                                }`,
                                borderRadius: '5px',
                              }}
                            />
                          </Tooltip>
                        </FadeIn>
                      </Grid>
                      <Grid item container md={8} gap={2}>
                        {results[index].slice(1).map((result, index) => (
                          <Grid item md="auto">
                            <FadeIn delay={100 * index} duration={1000}>
                              <Tooltip title={result.message}>
                                <img
                                  src={result.subject.icon}
                                  width={72}
                                  height={72}
                                  style={{
                                    border: `4px solid ${
                                      result.status === STATUS.SUCCESS ? 'green' : 'red'
                                    }`,
                                    borderRadius: '5px',
                                  }}
                                />
                              </Tooltip>
                            </FadeIn>
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  ) : (
                    <Grid container item alignItems="flex-start" spacing={1} height="100%">
                      <Grid item md={12} textAlign="center">
                        <LoadingBorder armor={item} size={64} />
                      </Grid>
                      <Grid item md={12} textAlign="center" height="100%">
                        {equipStep}
                      </Grid>
                    </Grid>
                  )}
                </>
              ))}
            </Grid>
            {equipping ? (
              false
            ) : (
              <>
                <Grid
                  item
                  container
                  md={12}
                  textAlign="center"
                  alignItems="flex-end"
                  justifyContent="space-betwen"
                  sx={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
                >
                  <Grid item md={4}>
                    <FadeIn delay={200}>
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
                    </FadeIn>
                  </Grid>
                  <Grid item md={4}>
                    <FadeIn delay={400}>
                      <Button>Share</Button>
                    </FadeIn>
                  </Grid>
                  <Grid item md={4}>
                    <FadeIn delay={600}>
                      <Button>Save in-game</Button>
                    </FadeIn>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      </Backdrop>
    </Box>
  );
};

export default EquipLoadout;
