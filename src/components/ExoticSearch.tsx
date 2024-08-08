import React, { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { Autocomplete, TextField, Popper } from '@mui/material';
import { db } from '../store/db';
import { Character } from '../types';

const NewComponentContainer = styled('div')({
  backgroundColor: 'transparent',
  padding: '20px',
  borderRadius: '10px',
  color: 'white',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ExoticIcon = styled('img')<{ isOwned: boolean; isSelected: boolean }>(
  ({ isOwned, isSelected }) => ({
    width: isSelected ? '100px' : '50px',
    height: isSelected ? '100px' : '50px',
    marginRight: '10px',
    filter: isOwned ? 'none' : 'grayscale(100%)',
    border: isSelected ? '5px solid gold' : 'none',
    boxShadow: isSelected ? '0 0 10px 2px gold' : 'none',
  })
);

const ArrowButton = styled('div')<{ isSelected: boolean }>(({ isSelected }) => ({
  width: isSelected ? '20px' : '30px',
  height: isSelected ? '100px' : '30px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  borderRadius: '0',
  marginLeft: '10px',
  '&:hover': {
    border: '1px solid white',
  },
}));

const ArrowIcon = styled('div')<{ isSelected: boolean }>(({ isSelected }) => ({
  width: 0,
  height: 0,
  borderLeft: '10px solid white',
  borderTop: '5px solid transparent',
  borderBottom: '5px solid transparent',
}));

const SelectExotic = styled('span')({
  fontSize: '16px',
  fontWeight: 'bold',
  color: 'white',
  marginRight: '10px',
});

const StyledPopper = styled(Popper)({
  '& .MuiAutocomplete-paper': {
    backgroundColor: 'rgba(128, 128, 128, 0.9)',
    color: 'white',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '&': {
      scrollbarWidth: 'none',
    },
  },
  '& .MuiAutocomplete-option': {
    '&:hover': {
      backgroundColor: 'rgba(128, 128, 128, 0.7)',
      border: '1px solid white',
    },
  },
});

type ExoticViewModel = {
  itemHash: string;
  name: string;
  icon: string;
  isOwned: boolean;
};

interface ExoticSearchProps {
  selectedCharacter: Character | null;
  onExoticSelect: (itemHash: string | null) => void;
}

const ExoticSearch: React.FC<ExoticSearchProps> = ({ selectedCharacter, onExoticSelect }) => {
  const [exotics, setExotics] = useState<ExoticViewModel[]>([]);
  const [selectedExotic, setSelectedExotic] = useState<ExoticViewModel | null>(null);
  const [inputValue, setInputValue] = React.useState('');

  const fetchExoticData = async () => {
    if (selectedCharacter) {
      const data = await db.manifestExoticArmorCollection
        .where('class')
        .equalsIgnoreCase(selectedCharacter.class)
        .toArray();
      setExotics(
        data.map((item) => ({
          itemHash: item.itemHash.toString(),
          name: item.name,
          icon: item.icon,
          isOwned: item.isOwned,
        }))
      );
    }
  };

  useEffect(() => {
    fetchExoticData();
  }, [selectedCharacter]);

  useEffect(() => {
    if (selectedExotic) {
      onExoticSelect(selectedExotic.itemHash);
    } else {
      onExoticSelect(null);
    }
  }, [selectedExotic]);

  useEffect(() => {
    setSelectedExotic(null);
  }, [selectedCharacter]);

  const handleClearSelection = () => {
    setSelectedExotic(null);
  };

  return (
    <NewComponentContainer>
      {!selectedExotic ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SelectExotic>Select Exotic</SelectExotic>
          <Autocomplete
            disablePortal
            value={selectedExotic}
            onChange={(event, newValue) => {
              setSelectedExotic(newValue as ExoticViewModel | null);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            id="exotics"
            options={exotics}
            getOptionLabel={(option: ExoticViewModel) => option.name}
            sx={{ width: 300 }}
            PopperComponent={StyledPopper}
            renderOption={(props, option) => (
              <li
                {...props}
                style={{ color: option.isOwned ? 'inherit' : 'rgba(211, 211, 211, 0.7)' }}
              >
                <ExoticIcon
                  src={option.icon}
                  alt="Exotic Icon"
                  isOwned={option.isOwned}
                  isSelected={false}
                />
                {option.name}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Exotics"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    borderRadius: '0',
                    '& fieldset': {
                      borderColor: 'white',
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
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'white',
                  },
                }}
              />
            )}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {selectedExotic && (
            <>
              <ExoticIcon
                src={selectedExotic.icon}
                alt="Exotic Icon"
                isOwned={selectedExotic.isOwned}
                isSelected={true}
              />
              <ArrowButton isSelected={true} onClick={handleClearSelection}>
                <ArrowIcon isSelected={true} />
              </ArrowButton>
            </>
          )}
        </div>
      )}
    </NewComponentContainer>
  );
};

export default ExoticSearch;
