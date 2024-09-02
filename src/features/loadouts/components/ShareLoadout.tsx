import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/index';
import { encodeLoadout, decodeLoadout, LoadoutData } from './loadoutEncoder';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

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

const StyledList = styled(List)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const StyledListItem = styled(ListItem)({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  marginBottom: '4px',
  width: '200px',
  padding: '4px 8px',
  borderRadius: 0,
  border: '1px solid white',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

const statIcons: Record<string, string> = {
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

const ShareLoadout: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [shareLink, setShareLink] = useState<string>('');
  const [parsedLink, setParsedLink] = useState<string>('');
  const loadoutState = useSelector((state: RootState) => ({
    helmetMods: state.loadoutConfig.loadout.helmetMods,
    gauntletMods: state.loadoutConfig.loadout.gauntletMods,
    chestArmorMods: state.loadoutConfig.loadout.chestArmorMods,
    legArmorMods: state.loadoutConfig.loadout.legArmorMods,
    subclassConfig: state.loadoutConfig.loadout.subclassConfig,
    selectedValues: state.dashboard.selectedValues,
    selectedExoticItemHash: state.dashboard.selectedExoticItemHash,
  }));

  const [statPriority, setStatPriority] = useState<string[]>([
    'mobility',
    'resilience',
    'recovery',
    'discipline',
    'intellect',
    'strength',
  ]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(statPriority);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setStatPriority(items);
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
    };
    const encodedData = encodeLoadout(dataToShare);
    const shareableLink = `${window.location.origin}/loadout?d=${encodedData}`;
    setShareLink(shareableLink);
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

      // Here you would typically reconstruct the full loadout data
      // by fetching item details using the hashes
      const reconstructedLoadout = decodedData;
      console.log('Reconstructed loadout:', reconstructedLoadout);
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
            <h3>Prioritize Stats : drag and drop stats based on which stat matters the most</h3>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="stats">
                {(provided) => (
                  <StyledList {...provided.droppableProps} ref={provided.innerRef}>
                    {statPriority.map((stat, index) => (
                      <Draggable key={stat} draggableId={stat} index={index}>
                        {(provided, snapshot) => (
                          <StyledListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              ...(snapshot.isDragging
                                ? { background: 'rgba(255, 255, 255, 0.3)' }
                                : {}),
                            }}
                          >
                            <ListItemIcon>
                              <StatIcon src={statIcons[stat]} alt={stat} />
                            </ListItemIcon>
                            <ListItemText primary={stat.charAt(0).toUpperCase() + stat.slice(1)} />
                          </StyledListItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </StyledList>
                )}
              </Droppable>
            </DragDropContext>
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
                <TransparentButton onClick={parseLink}>Parse Link</TransparentButton>
              </Box>
            </Box>
          )}
          {parsedLink && (
            <Box sx={{ mb: 2 }}>
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
        </DialogContent>
        <DialogActions>
          <TransparentButton onClick={handleClose}>Close</TransparentButton>
        </DialogActions>
      </StyledDialog>
    </>
  );
};

export default ShareLoadout;
