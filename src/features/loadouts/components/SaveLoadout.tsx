import {
  Button,
  Drawer,
  Grid,
  Box,
  Autocomplete,
  TextField,
  Select,
  FormControl,
  InputLabel,
  ImageList,
  styled,
} from '@mui/material';
import { useState } from 'react';
import useLoadoutIdentifiers from '../hooks/use-loadout-identifiers';
import {
  ManifestLoadoutColor,
  ManifestLoadoutIcon,
  ManifestLoadoutName,
} from '../../../types/manifest-types';
import { snapShotLoadoutRequest } from '../../../lib/bungie_api/requests';
import { RootState, store } from '../../../store';
import { useSelector } from 'react-redux';

const LoadoutSlot = styled('img')(({ theme }) => ({
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  width: '51%',
  height: 'auto',
  border: '2px outset transparent',
  '&:hover': { border: '2px solid blue' },
}));

export default function SaveLoadout() {
  const [loadoutDrawerOpen, setLoadoutDrawerOpen] = useState<boolean>(false);
  const [loadoutName, setLoadoutName] = useState<ManifestLoadoutName | null>(null);
  const [loadoutColor, setLoadoutColor] = useState<ManifestLoadoutColor | null>(null);
  const [loadoutIcon, setLoadoutIcon] = useState<ManifestLoadoutIcon | null>(null);
  const [identifiersSet, setIdentifiersSet] = useState<boolean>(false);

  const loadoutIdentifiers = useLoadoutIdentifiers();
  const selectedCharacter = useSelector((state: RootState) => state.dashboard.selectedCharacter);

  function handleBackClick() {
    setLoadoutDrawerOpen(false);
    setLoadoutName(null);
    setLoadoutColor(null);
    setLoadoutIcon(null);
  }

  const SetIdentifiersDrawer = (
    <Grid container alignItems="center" textAlign="center" rowGap={3} paddingX={4} paddingY={3}>
      <Grid item md={12}>
        SET IDENTIFIERS
      </Grid>
      <Grid item md={12}>
        <Autocomplete
          disablePortal
          id="loadout-names"
          value={loadoutName}
          onChange={(event, newValue) => setLoadoutName(newValue)}
          options={loadoutIdentifiers.loadoutNames}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="NAME" />}
        />
      </Grid>
      <Grid item md={12}>
        <FormControl fullWidth>
          <InputLabel id="loadout-colors-label">COLOR</InputLabel>
          <Select
            labelId="loadout-colors-label"
            id="loadout-colors"
            label="COLOR"
            value={loadoutColor}
            renderValue={(selected) => <img src={selected?.imagePath} width="20%" height="auto" />}
          >
            <ImageList cols={4}>
              {loadoutIdentifiers.loadoutColors.map((color) => (
                <img
                  src={color.imagePath}
                  width="60%"
                  height="auto"
                  onClick={() => setLoadoutColor(color)}
                />
              ))}
            </ImageList>
          </Select>
        </FormControl>
      </Grid>
      <Grid item md={12}>
        <FormControl fullWidth>
          <InputLabel id="loadout-icons-label">ICON</InputLabel>
          <Select
            labelId="loadout-icons-label"
            id="loadout-icons"
            label="ICON"
            value={loadoutIcon}
            renderValue={(selected) => <img src={selected?.imagePath} width="20%" height="auto" />}
          >
            <ImageList cols={4}>
              {loadoutIdentifiers.loadoutIcons.map((icon) => (
                <img
                  src={icon.imagePath}
                  width="60%"
                  height="auto"
                  onClick={() => setLoadoutIcon(icon)}
                />
              ))}
            </ImageList>
          </Select>
        </FormControl>
      </Grid>
      <Grid item md={6}>
        <Button onClick={handleBackClick}>BACK</Button>
      </Grid>
      <Grid item md={6}>
        <Button
          disabled={loadoutName === null && loadoutColor === null && loadoutIcon === null}
          onClick={() => setIdentifiersSet(true)}
        >
          NEXT
        </Button>
      </Grid>
    </Grid>
  );

  const SelectLoadoutSlotDrawer = (
    <Grid container alignItems="center" textAlign="center" rowGap={2} paddingX={4} paddingY={3}>
      <Grid item md={12}>
        SELECT SLOT TO OVERWRITE
      </Grid>
      {store.getState().profile.characters[selectedCharacter].loadouts?.map((loadout, index) => (
        <Grid item md={6}>
          <LoadoutSlot
            onClick={async () => {
              const characterId = store.getState().profile.characters[selectedCharacter]?.id;

              if (characterId && loadoutColor && loadoutIcon && loadoutName)
                await snapShotLoadoutRequest(
                  String(characterId),
                  loadoutColor?.hash,
                  loadoutIcon?.hash,
                  index,
                  loadoutName?.hash
                );

              setIdentifiersSet(false);
              setLoadoutDrawerOpen(false);
            }}
            src={
              loadoutIdentifiers.loadoutIcons.find((icon) => icon.hash === loadout.iconHash)
                ?.imagePath
            }
            style={{
              backgroundImage: `url(${
                loadoutIdentifiers.loadoutColors.find((color) => color.hash === loadout.colorHash)
                  ?.imagePath
              })`,
            }}
          />
        </Grid>
      ))}
      <Grid item md={6}>
        <Button onClick={() => setIdentifiersSet(false)}>BACK</Button>
      </Grid>
    </Grid>
  );

  return (
    <>
      <Button onClick={() => setLoadoutDrawerOpen(true)}>SAVE IN-GAME</Button>
      <Drawer open={loadoutDrawerOpen} anchor="right">
        <Box sx={{ width: '24vw' }}>
          {identifiersSet ? SelectLoadoutSlotDrawer : SetIdentifiersDrawer}
        </Box>
      </Drawer>
    </>
  );
}
