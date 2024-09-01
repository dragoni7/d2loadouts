import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Autocomplete, TextField, Popper } from '@mui/material';
import { db } from '../store/db';
import { armor, Character } from '../types/d2l-types';
import { updateSelectedExoticItemHash } from '../store/DashboardReducer';
import { useDispatch } from 'react-redux';
import { ManifestExoticArmor } from '../types/manifest-types';

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
    width: isSelected ? '91px' : '50px',
    height: isSelected ? '91px' : '50px',
    marginRight: '10px',
    filter: isOwned ? 'none' : 'grayscale(100%)',
    border: isSelected ? '5px solid transparent' : 'none',
    borderImage: isSelected
      ? 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C) 1'
      : 'none',
    boxShadow: isSelected ? '0 0 10px 2px rgba(251, 245, 183, 0.5)' : 'none',
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
    backgroundColor: 'transparent',
    color: 'white',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'white',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
  },
  '& .MuiAutocomplete-listbox': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  '& .MuiAutocomplete-option': {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&[aria-selected="true"]': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  },
});

interface ExoticSearchProps {
  selectedCharacter: Character | undefined;
  selectedExoticItemHash: number | null;
}

const ExoticSearch: React.FC<ExoticSearchProps> = ({
  selectedCharacter,
  selectedExoticItemHash,
}) => {
  const dispatch = useDispatch();
  const [exotics, setExotics] = useState<ManifestExoticArmor[]>([]);
  const [selectedExotic, setSelectedExotic] = useState<ManifestExoticArmor | null>(null);
  const [inputValue, setInputValue] = React.useState('');

  const fetchExoticData = async () => {
    if (selectedCharacter) {
      const data = await db.manifestExoticArmorCollection
        .where('class')
        .equalsIgnoreCase(selectedCharacter.class)
        .toArray();
      setExotics(data);
    }
  };

  useEffect(() => {
    fetchExoticData();
  }, [selectedCharacter]);

  useEffect(() => {
    if (selectedExoticItemHash) {
      const exotic = exotics.find((e) => e.itemHash === selectedExoticItemHash);
      setSelectedExotic(exotic || null);
    } else {
      setSelectedExotic(null);
    }
  }, [selectedExoticItemHash, exotics]);

  useEffect(() => {
    setSelectedExotic(null);
    setInputValue('');
  }, [selectedCharacter]);

  const handleExoticSelect = (newValue: ManifestExoticArmor | null) => {
    setSelectedExotic(newValue);
    dispatch(
      updateSelectedExoticItemHash({
        itemHash: newValue ? newValue.itemHash : null,
        slot: newValue?.slot as armor,
      })
    );
  };

  const handleClearSelection = () => {
    setSelectedExotic(null);
    dispatch(updateSelectedExoticItemHash({ itemHash: null, slot: null }));
  };

  return (
    <NewComponentContainer>
      {!selectedExotic ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SelectExotic>Select Exotic</SelectExotic>
          <Autocomplete
            disablePortal
            value={selectedExotic}
            onChange={(event, newValue) =>
              handleExoticSelect(newValue as ManifestExoticArmor | null)
            }
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            id="exotics"
            options={exotics}
            getOptionLabel={(option: ManifestExoticArmor) => option.name}
            sx={{ width: 300 }}
            PopperComponent={StyledPopper}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props;
              return (
                <li
                  {...otherProps}
                  key={option.itemHash}
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
              );
            }}
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
