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
import SaveLoadout from './SaveLoadout';
import { refreshProfileCharacters } from '../../../util/profile-characters';
import { useDispatch } from 'react-redux';
import { D2LButton } from '../../../components/D2LButton';

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

  const dispatch = useDispatch();

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

      setEquipStep('Refreshing');

      refreshProfileCharacters(dispatch);

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
      <D2LButton onClick={onButtonClick}>Equip Loadout</D2LButton>
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
          <D2LButton onClick={onDialogContinue}>CONTINUE</D2LButton>
          <D2LButton onClick={() => setAlertOpen(false)}>GO BACK</D2LButton>
        </DialogActions>
      </LoadoutDialog>
      <Backdrop
        open={open}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(5px)',
        }}
      >
        <Paper
          elevation={5}
          sx={{
            width: '100%',
            height: '90%',
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
                  <Typography
                    sx={{
                      paddingBottom: 1,
                      marginBottom: 2,
                      fontSize: '28px',
                      fontWeight: 'bold',
                    }}
                  >
                    {equipStep.toUpperCase()}
                  </Typography>
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
              height="7%"
              alignItems="center"
              sx={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
            >
              {equipping ? (
                ''
              ) : (
                <>
                  <Grid item md={6}>
                    <FadeIn delay={200}>
                      <D2LButton
                        onClick={() => {
                          setOpen(false);
                          setResults([]);
                          setProcessing([]);
                          setEquipStep('');
                        }}
                      >
                        Back
                      </D2LButton>
                    </FadeIn>
                  </Grid>
                  <Grid item md={6}>
                    <FadeIn delay={600}>
                      <SaveLoadout />
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
