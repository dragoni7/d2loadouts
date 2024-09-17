import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/index';
import { createSelector } from '@reduxjs/toolkit';
import { encodeLoadout, decodeLoadout } from '../util/loadout-encoder';
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
import {
  CharacterClass,
  DecodedLoadoutData,
  FilteredPermutation,
  StatName,
} from '../../../types/d2l-types';
import { SharedLoadoutDto } from '../types';
import { D2LButton } from '../../../components/D2LButton';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    fontFamily: 'Helvetica, Arial, sans-serif',
    borderRadius: 0,
  },
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
  mobility: '/assets/mob.png',
  resilience: '/assets/res.png',
  recovery: '/assets/rec.png',
  discipline: '/assets/disc.png',
  intellect: '/assets/int.png',
  strength: '/assets/str.png',
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
  (state: RootState) => state.profile.characters[state.dashboard.selectedCharacter].class,
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
  const loadoutState = useSelector(selectLoadoutState);
  const selectedCharacterClass = useSelector(selectSelectedCharacterClass);

  const [open, setOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string>('');
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
    const dataToShare: SharedLoadoutDto = {
      mods: {
        helmet: loadoutState.helmetMods.map((mod) => mod.itemHash),
        gauntlets: loadoutState.gauntletMods.map((mod) => mod.itemHash),
        chest: loadoutState.chestArmorMods.map((mod) => mod.itemHash),
        legs: loadoutState.legArmorMods.map((mod) => mod.itemHash),
      },
      subclass: {
        damageType: loadoutState.subclassConfig.subclass.damageType,
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
    const shareableLink = `https://d2loadouts.com/?d=${encodedData}`;
    setShareLink(shareableLink);
    console.log('Generated link:', shareableLink);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  return (
    <>
      <D2LButton onClick={handleOpen}>Share Loadout</D2LButton>
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
            <D2LButton onClick={generateShareLink}>Generate Share Link</D2LButton>
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
                <D2LButton onClick={copyToClipboard} sx={{ mr: 1 }}>
                  Copy Link
                </D2LButton>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <D2LButton onClick={handleClose}>Close</D2LButton>
        </DialogActions>
      </StyledDialog>
    </>
  );
};

export default ShareLoadout;
