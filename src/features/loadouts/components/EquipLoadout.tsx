import {
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Slide,
  styled,
  Tooltip,
  Typography,
} from '@mui/material';
import { store } from '../../../store';
import { useState } from 'react';
import { EquipResult } from '../types';
import { STATUS } from '../constants';
import React from 'react';
import LoadingBorder from './LoadingBorder';
import FadeIn from './FadeIn';
import { equipLoadout } from '../util/loadout-utils';
import { TransitionProps } from '@mui/material/transitions';

const StyledTitle = styled(Typography)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(2),
  fontSize: '28px',
  fontWeight: 'bold',
}));

const LoadoutDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(1),
    height: '10vh',
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
    backgroundColor: 'black',
  },
  '& .MuiDialogTitle-root': {
    padding: theme.spacing(1),
    backgroundColor: 'rgba(130,130,130,1.0)',
    color: 'white',
  },
}));

const TransparentButton = styled(Button)(({ theme }) => ({
  background: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(10px)',
  color: 'white',
  padding: theme.spacing(1, 2),
  fontFamily: 'Helvetica, Arial, sans-serif',
  '&:hover': {
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 1)',
  },
  borderRadius: 0,
  border: '1px solid rgba(255, 255, 255, 0.5)',
  transition: 'all 0.3s ease',
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EquipLoadout: React.FC = () => {
  const [processing, setProcessing] = useState<any[]>([]);
  const [equipStep, setEquipStep] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [results, setResults] = useState<EquipResult[][]>([]);
  const [equipping, setEquipping] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  async function handleEquipLoadout() {
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
      alert('Loadout Errors');
    }
  }

  async function onButtonClick() {
    const loadout = store.getState().loadoutConfig.loadout;

    if (loadout.requiredStatMods.some((required) => required.equipped === false)) {
      setAlertOpen(true);
      return;
    }

    await handleEquipLoadout();
  }

  async function onDialogContinue() {
    setAlertOpen(false);
    await handleEquipLoadout();
  }

  return (
    <>
      <TransparentButton onClick={onButtonClick}>Equip Loadout</TransparentButton>
      <LoadoutDialog
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        TransitionComponent={Transition}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">{'MISSING REQUIRED MODS!'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            Loadout missing optimized stat mods, are you sure you still want to equip?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDialogContinue}>CONTINUE</Button>
          <Button onClick={() => setAlertOpen(false)}>GO BACK</Button>
        </DialogActions>
      </LoadoutDialog>
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
