import {
  Autocomplete,
  Box,
  Drawer,
  FormControl,
  Grid,
  ImageList,
  InputLabel,
  Select,
  styled,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { D2LButton } from '../../../components/D2LButton';
import { API_COMPONENTS } from '../../../lib/bungie_api/constants';
import { getProfileDataRequest, snapShotLoadoutRequest } from '../../../lib/bungie_api/requests';
import { RootState, store } from '../../../store';
import { updateCharacterLoadouts } from '../../../store/ProfileReducer';
import {
  ManifestLoadoutColor,
  ManifestLoadoutIcon,
  ManifestLoadoutName,
} from '../../../types/manifest-types';
import { getCharacterLoadoutsFromResponse } from '../../profile/profile-data';
import useLoadoutIdentifiers from '../hooks/use-loadout-identifiers';

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

  const dispatch = useDispatch();

  function handleBackClick() {
    setLoadoutDrawerOpen(false);
    setLoadoutName(null);
    setLoadoutColor(null);
    setLoadoutIcon(null);
  }

  const SetIdentifiersDrawer = (
    <Grid
      container
      alignItems="center"
      textAlign="center"
      rowGap={3}
      paddingX={4}
      paddingY={3}
      spacing={3}
    >
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
        <D2LButton onClick={handleBackClick}>BACK</D2LButton>
      </Grid>
      <Grid item md={6}>
        <D2LButton
          disabled={loadoutName === null || loadoutColor === null || loadoutIcon === null}
          onClick={() => setIdentifiersSet(true)}
        >
          NEXT
        </D2LButton>
      </Grid>
    </Grid>
  );

  const SelectLoadoutSlotDrawer = (
    <Grid
      container
      alignItems="center"
      textAlign="center"
      rowGap={2}
      paddingX={4}
      paddingY={3}
      spacing={3}
    >
      <Grid item md={12}>
        SELECT SLOT TO OVERWRITE
      </Grid>
      {store.getState().profile.characters[selectedCharacter].loadouts?.map((loadout, index) => (
        <Grid item md={6}>
          <LoadoutSlot
            onClick={async () => {
              const characterId = store.getState().profile.characters[selectedCharacter]?.id;

              if (characterId && loadoutColor && loadoutIcon && loadoutName) {
                await snapShotLoadoutRequest(
                  String(characterId),
                  loadoutColor?.hash,
                  loadoutIcon?.hash,
                  index,
                  loadoutName?.hash
                );

                setIdentifiersSet(false);
                setLoadoutDrawerOpen(false);

                const loadoutsResponse = await getProfileDataRequest([
                  API_COMPONENTS.CHARACTERS,
                  API_COMPONENTS.CHARACTER_LOADOUTS,
                ]);

                if (loadoutsResponse) {
                  dispatch(
                    updateCharacterLoadouts({
                      loadouts: getCharacterLoadoutsFromResponse(loadoutsResponse, characterId),
                      characterIndex: selectedCharacter,
                    })
                  );
                }
              }
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
        <D2LButton onClick={() => setIdentifiersSet(false)}>BACK</D2LButton>
      </Grid>
    </Grid>
  );

  return (
    <>
      <D2LButton onClick={() => setLoadoutDrawerOpen(true)}>SAVE IN-GAME</D2LButton>
      <Drawer open={loadoutDrawerOpen} anchor="right" sx={{ backdropFilter: 'blur(6px)' }}>
        <Box sx={{ width: '18vw', height: '100%' }}>
          {identifiersSet ? SelectLoadoutSlotDrawer : SetIdentifiersDrawer}
        </Box>
      </Drawer>
    </>
  );
}
