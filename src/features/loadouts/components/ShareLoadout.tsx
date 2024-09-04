import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/index';
import { createSelector } from '@reduxjs/toolkit';
import { encodeLoadout, decodeLoadout, LoadoutData } from './loadoutEncoder';
import { findMatchingArmorSet, DecodedLoadoutInfo } from './findMatchingArmorSet';
import {
  Button,
  TextField,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { styled } from '@mui/material/styles';
import { CharacterClass, FilteredPermutation, StatName } from '../../../types/d2l-types';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    fontFamily: 'Helvetica, Arial, sans-serif',
    borderRadius: 0,
  },
}));

const TransparentButton = styled(Button)(({ theme }) => ({
  background: 'transparent',
  color: 'white',
  padding: theme.spacing(1, 2),
  fontFamily: 'Helvetica, Arial, sans-serif',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
  },
  borderRadius: 0,
  border: '1px solid white',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    fontFamily: 'Helvetica, Arial, sans-serif',
    '& fieldset': {
      borderColor: 'white',
      borderRadius: 0,
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'white',
    fontFamily: 'Helvetica, Arial, sans-serif',
  },
}));

const StatIcon = styled('img')({
  width: 24,
  height: 24,
  marginRight: 10,
});
const StatListContainer = styled(Box)({
  position: 'relative',
  height: '400px',
});

const StatListItem = styled(ListItem)<{ index: number }>(({ theme, index }) => ({
  backgroundColor: 'transparent',
  width: '100%',
  padding: theme.spacing(1, 2),
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  transition: 'transform 0.3s ease',
  transform: `translateY(${index * 60}px)`,
}));

const PriorityLabel = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  color: 'white',
  width: '120px',
}));

const ArrowButton = styled(IconButton)(({ theme }) => ({
  color: 'white',
  padding: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  width: '24px',
  height: '24px',
}));

const StatButton = styled(Box)(({ theme }) => ({
  width: '150px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: theme.spacing(0, 1),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid white',
}));

const ArrowContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: theme.spacing(2),
  width: '24px',
}));

const statIcons: Record<StatName, string> = {
  mobility:
    'https://www.bungie.net/common/destiny2_content/icons/e26e0e93a9daf4fdd21bf64eb9246340.png',
  resilience:
    'https://www.bungie.net/common/destiny2_content/icons/202ecc1c6febeb6b97dafc856e863140.png',
  recovery:
    'https://www.bungie.net/common/destiny2_content/icons/128eee4ee7fc127851ab32eac6ca91cf.png',
  discipline:
    'https://www.bungie.net/common/destiny2_content/icons/79be2d4adef6a19203f7385e5c63b45b.png',
  intellect:
    'https://www.bungie.net/common/destiny2_content/icons/d1c154469670e9a592c9d4cbdcae5764.png',
  strength:
    'https://www.bungie.net/common/destiny2_content/icons/ea5af04ccd6a3470a44fd7bb0f66e2f7.png',
};

const selectLoadoutState = createSelector(
  (state: RootState) => state.loadoutConfig.loadout,
  (state: RootState) => state.dashboard,
  (loadout, dashboard) => ({
    helmetMods: loadout.helmetMods,
    gauntletMods: loadout.gauntletsMods,
    chestArmorMods: loadout.chestArmorMods,
    legArmorMods: loadout.legArmorMods,
    subclassConfig: loadout.subclassConfig,
    selectedValues: dashboard.selectedValues,
    selectedExoticItemHash: String(dashboard.selectedExotic.itemHash),
  })
);

const selectSelectedCharacterClass = createSelector(
  (state: RootState) => state.profile.selectedCharacter?.class,
  (characterClass) => characterClass as CharacterClass | undefined
);

const StatPriorityList: React.FC<{
  statPriority: StatName[];
  onStatPriorityChange: (newPriority: StatName[]) => void;
}> = React.memo(({ statPriority, onStatPriorityChange }) => {
  const moveItem = (fromIndex: number, toIndex: number) => {
    const updatedPriority = [...statPriority];
    const [movedItem] = updatedPriority.splice(fromIndex, 1);
    updatedPriority.splice(toIndex, 0, movedItem);
    onStatPriorityChange(updatedPriority);
  };

  return (
    <StatListContainer>
      {statPriority.map((stat, index) => (
        <StatListItem key={stat} index={index}>
          <PriorityLabel>
            {index === 0
              ? 'Highest Priority'
              : index === statPriority.length - 1
              ? 'Lowest Priority'
              : '...'}
          </PriorityLabel>
          <StatButton>
            <ListItemIcon>
              <StatIcon src={statIcons[stat]} alt={stat} />
            </ListItemIcon>
            <ListItemText primary={stat.charAt(0).toUpperCase() + stat.slice(1)} />
          </StatButton>
          <ArrowContainer>
            <ArrowButton
              onClick={() => index > 0 && moveItem(index, index - 1)}
              disabled={index === 0}
              size="small"
            >
              <ArrowUpwardIcon fontSize="small" />
            </ArrowButton>
            <ArrowButton
              onClick={() => index < statPriority.length - 1 && moveItem(index, index + 1)}
              disabled={index === statPriority.length - 1}
              size="small"
            >
              <ArrowDownwardIcon fontSize="small" />
            </ArrowButton>
          </ArrowContainer>
        </StatListItem>
      ))}
    </StatListContainer>
  );
});
const ShareLoadout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => state);
  const loadoutState = useSelector(selectLoadoutState);
  const selectedCharacterClass = useSelector(selectSelectedCharacterClass);

  const [open, setOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string>('');
  const [parsedLink, setParsedLink] = useState<string>('');
  const [matchingArmorSet, setMatchingArmorSet] = useState<FilteredPermutation | null>(null);
  const [statPriority, setStatPriority] = useState<StatName[]>([
    'mobility',
    'resilience',
    'recovery',
    'discipline',
    'intellect',
    'strength',
  ]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleStatPriorityChange = (newPriority: StatName[]) => {
    setStatPriority(newPriority);
  };

  const generateShareLink = () => {
    const dataToShare: LoadoutData = {
      mods: {
        helmet: loadoutState.helmetMods.map((mod) => mod.itemHash),
        gauntlets: loadoutState.gauntletMods.map((mod) => mod.itemHash),
        chest: loadoutState.chestArmorMods.map((mod) => mod.itemHash),
        legs: loadoutState.legArmorMods.map((mod) => mod.itemHash),
      },
      subclass: {
        super: loadoutState.subclassConfig.super?.itemHash ?? 0,
        aspects: loadoutState.subclassConfig.aspects.map((aspect) => aspect.itemHash),
        fragments: loadoutState.subclassConfig.fragments.map((fragment) => fragment.itemHash),
        classAbility: loadoutState.subclassConfig.classAbility?.itemHash ?? 0,
        meleeAbility: loadoutState.subclassConfig.meleeAbility?.itemHash ?? 0,
        movementAbility: loadoutState.subclassConfig.movementAbility?.itemHash ?? 0,
        grenade: loadoutState.subclassConfig.grenade?.itemHash ?? 0,
      },
      selectedExoticItemHash: loadoutState.selectedExoticItemHash ?? '',
      selectedValues: loadoutState.selectedValues,
      statPriority,
      characterClass: selectedCharacterClass || null,
    };
    const encodedData = encodeLoadout(dataToShare);
    const shareableLink = `${window.location.origin}/loadout?d=${encodedData}`;
    setShareLink(shareableLink);
    console.log('Generated link:', shareableLink);
  };

  const parseLink = () => {
    try {
      const url = new URL(shareLink);
      const encodedData = url.searchParams.get('d');
      if (!encodedData) {
        throw new Error('Invalid loadout link');
      }
      const decodedData = decodeLoadout(encodedData);
      setParsedLink(JSON.stringify(decodedData, null, 2));
      console.log('Parsed loadout:', decodedData);
    } catch (error) {
      console.error('Error parsing loadout link:', error);
      setParsedLink('Error parsing link');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  const findMatchingSet = () => {
    try {
      const url = new URL(shareLink);
      const encodedData = url.searchParams.get('d');
      if (!encodedData) {
        throw new Error('Invalid loadout link');
      }
      const decodedLoadout = decodeLoadout(encodedData);

      const decodedLoadoutInfo: DecodedLoadoutInfo = {
        selectedExoticItemHash: decodedLoadout.selectedExoticItemHash,
        selectedValues: {
          mobility: decodedLoadout.selectedValues.mobility || 0,
          resilience: decodedLoadout.selectedValues.resilience || 0,
          recovery: decodedLoadout.selectedValues.recovery || 0,
          discipline: decodedLoadout.selectedValues.discipline || 0,
          intellect: decodedLoadout.selectedValues.intellect || 0,
          strength: decodedLoadout.selectedValues.strength || 0,
        },
        statPriority: decodedLoadout.statPriority as StatName[],
        characterClass: decodedLoadout.characterClass as CharacterClass,
      };

      const matchingSet = findMatchingArmorSet(decodedLoadoutInfo, state);
      setMatchingArmorSet(matchingSet);
      console.log('Matching armor set:', matchingSet);
    } catch (error) {
      console.error('Error finding matching armor set:', error);
      setMatchingArmorSet(null);
    }
  };

  return (
    <>
      <TransparentButton onClick={handleOpen}>Share Loadout</TransparentButton>
      <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Share Loadout
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <h3>Selected Character Class: {selectedCharacterClass || 'None'}</h3>
            <h3>Prioritize Stats: Use the arrows to reorder stats based on priority</h3>
            <StatPriorityList
              statPriority={statPriority}
              onStatPriorityChange={handleStatPriorityChange}
            />
          </Box>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <TransparentButton onClick={generateShareLink}>Generate Share Link</TransparentButton>
          </Box>
          {shareLink && (
            <Box sx={{ mb: 2 }}>
              <StyledTextField
                fullWidth
                variant="outlined"
                value={shareLink}
                InputProps={{
                  readOnly: true,
                }}
              />
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
                <TransparentButton onClick={copyToClipboard} sx={{ mr: 1 }}>
                  Copy Link
                </TransparentButton>
                <TransparentButton onClick={parseLink} sx={{ mr: 1 }}>
                  Parse Link
                </TransparentButton>
                <TransparentButton onClick={findMatchingSet}>Find Matching Set</TransparentButton>
              </Box>
            </Box>
          )}
          {parsedLink && (
            <Box sx={{ mb: 2 }}>
              <h3>Parsed Loadout:</h3>
              <StyledTextField
                fullWidth
                multiline
                rows={10}
                variant="outlined"
                value={parsedLink}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          )}
          {matchingArmorSet && (
            <Box sx={{ mb: 2 }}>
              <h3>Matching Armor Set:</h3>
              <StyledTextField
                fullWidth
                multiline
                rows={10}
                variant="outlined"
                value={JSON.stringify(matchingArmorSet, null, 2)}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <TransparentButton onClick={handleClose}>Close</TransparentButton>
        </DialogActions>
      </StyledDialog>
    </>
  );
};

export default ShareLoadout;
