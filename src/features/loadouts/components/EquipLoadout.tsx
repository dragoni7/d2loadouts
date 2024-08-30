import { Backdrop, Button, Grid, Paper, styled, Tooltip, Typography } from '@mui/material';
import { store } from '../../../store';
import { useState } from 'react';
import { EquipResult } from '../types';
import { STATUS } from '../constants';
import React from 'react';
import LoadingBorder from './LoadingBorder';
import FadeIn from './FadeIn';
import { equipLoadout } from '../util/loadoutUtils';

const StyledTitle = styled(Typography)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(2),
  fontSize: '28px',
  fontWeight: 'bold',
}));

const StyledSubTitle = styled(Typography)(({ theme }) => ({
  opacity: 0.7,
  borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(2),
  width: '90%',
}));

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

      await equipLoadout(loadout, setProcessing, setEquipStep, setResults);

      setEquipStep('Finished');
      setEquipping(false);
    } else {
      alert('Loadout Incomplete');
    }
  };

  return (
    <>
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
            <Grid
              item
              md={12}
              lg={12}
              textAlign="center"
              alignContent="center"
              sx={{ backgroundColor: 'rgba(48,48,48,0.8)' }}
              height={'10%'}
            >
              {equipping ? (
                ''
              ) : (
                <FadeIn>
                  <StyledTitle>{equipStep.toUpperCase()}</StyledTitle>
                </FadeIn>
              )}
            </Grid>
            <Grid container item md={12} lg={12} spacing={1} py={2} height="84%">
              {processing.map((item, index) => (
                <>
                  {results[index] !== undefined ? (
                    <>
                      <Grid item md={2} lg={2} />
                      <Grid item md={1}>
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
                              }}
                            />
                          </Tooltip>
                        </FadeIn>
                      </Grid>
                      <Grid item container md={9} gap={2}>
                        {results[index].slice(1).map((result, index) => (
                          <Grid item md="auto">
                            <FadeIn delay={100 * index} duration={1000}>
                              <Tooltip title={result.message}>
                                <img
                                  src={result.subject.icon}
                                  width={74}
                                  height={74}
                                  style={{
                                    border: `4px solid ${
                                      result.status === STATUS.SUCCESS ? 'green' : 'red'
                                    }`,
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
            <Grid
              item
              container
              md={12}
              textAlign="center"
              alignItems="flex-end"
              justifyContent="space-betwen"
              height="7%"
              sx={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
            >
              {equipping ? (
                ''
              ) : (
                <>
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
                </>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Backdrop>
    </>
  );
};

export default EquipLoadout;
