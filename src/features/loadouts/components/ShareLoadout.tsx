import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/index';
import { createSelector } from '@reduxjs/toolkit';
import { encodeLoadout } from '../util/loadout-encoder';
import {
  Box,
  ListItemIcon,
  ListItemText,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { CharacterClass, StatName } from '../../../types/d2l-types';
import { SharedLoadoutDto } from '../types';
import { D2LButton } from '../../../components/D2LButton';
import { statIcons } from '../../../util/constants';
import { copyToClipBoard } from '../../../util/app-utils';
import {
  StatListContainer,
  StatListItem,
  PriorityLabel,
  StatButton,
  StatIcon,
  ArrowContainer,
  ArrowButton,
  StyledDialog,
  StyledTextField,
} from '../styled';

const selectLoadoutState = createSelector(
  (state: RootState) => state.loadoutConfig.loadout,
  (state: RootState) => state.dashboard,
  (loadout, dashboard) => ({
    helmetMods: loadout.helmetMods,
    gauntletMods: loadout.gauntletsMods,
    chestArmorMods: loadout.chestArmorMods,
    legArmorMods: loadout.legArmorMods,
    classArmorMods: loadout.classArmorMods,
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
        chestArmor: loadoutState.chestArmorMods.map((mod) => mod.itemHash),
        legArmor: loadoutState.legArmorMods.map((mod) => mod.itemHash),
        classArmor: loadoutState.classArmorMods.map((mod) => mod.itemHash),
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
                <D2LButton onClick={() => copyToClipBoard(shareLink)} sx={{ mr: 1 }}>
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
