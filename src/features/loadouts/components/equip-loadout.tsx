import {
  Accordion,
  AccordionSummary,
  Backdrop,
  Badge,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tooltip,
} from '@mui/material';
import { equipLoadout } from '../loadoutService';
import { store } from '../../../store';
import { useState } from 'react';
import { EquipResult } from '../types';
import ArmorIcon from '../../../components/ArmorIcon';
import { CheckRounded, Close, ExpandMore } from '@mui/icons-material';
import { STATUS } from '../constants';

const EquipLoadout: React.FC = () => {
  const [equipping, setEquipping] = useState(false);
  const [open, setOpen] = useState(false);
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
      setEquipping(true);
      setOpen(true);
      setResults(await equipLoadout(loadout));
      setEquipping(false);
    } else {
      alert('Loadout Incomplete');
    }
  };

  return (
    <Box>
      <Button variant="contained" onClick={onEquipLoadout}>
        Equip Loadout
      </Button>
      <Backdrop
        open={open}
        onClick={() => {
          if (!equipping) {
            setOpen(false);
            setResults([]);
          }
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
            width: '40vw',
            height: '90vh',
            backgroundColor: '#1c1c21',
            color: 'white',
          }}
        >
          {equipping ? (
            <div>
              <CircularProgress color="inherit" size={'100%'} /> <p> Equipping... </p>
            </div>
          ) : (
            <List sx={{ width: '50%' }}>
              {results.map((result) => (
                <ListItem>
                  <Badge
                    badgeContent={
                      result.status === STATUS.SUCCESS ? (
                        <CheckRounded sx={{ fontSize: 40, color: 'green' }} />
                      ) : (
                        <Close sx={{ fontSize: 40, color: 'red' }} />
                      )
                    }
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  >
                    <ListItemAvatar>
                      <ArmorIcon armor={result.subject} size={64}></ArmorIcon>
                    </ListItemAvatar>
                  </Badge>
                  {result.errors.map((error) => (
                    <ListItemText sx={{ color: error === '' ? 'green' : 'red' }}>
                      {error === '' ? (
                        <CheckRounded sx={{ fontSize: 60 }} />
                      ) : error === 'NA' ? (
                        ''
                      ) : (
                        <Tooltip title={error}>
                          <Close sx={{ fontSize: 60 }} />
                        </Tooltip>
                      )}
                    </ListItemText>
                  ))}
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Backdrop>
    </Box>
  );
};

export default EquipLoadout;
