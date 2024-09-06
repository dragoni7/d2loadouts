import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Autocomplete, TextField, Popper } from '@mui/material';
import { db } from '../../store/db';
import { armor, Character, ExoticClassCombo } from '../../types/d2l-types';
import {
  updateSelectedExoticClassCombo,
  updateSelectedExoticItemHash,
} from '../../store/DashboardReducer';
import { useDispatch } from 'react-redux';
import { ManifestExoticArmor } from '../../types/manifest-types';
import { ARMOR } from '../../lib/bungie_api/constants';

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

const ComboOption = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const ComboItem = styled('div')({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '4px',
});

const ComboIcon = styled('img')({
  width: '24px',
  height: '24px',
  marginRight: '8px',
});

interface ExoticSelectorProps {
  selectedCharacter: Character | undefined;
  selectedExoticItemHash: number | null;
}

interface IntrinsicMod {
  itemHash: number;
  name: string;
  icon: string;
}

const ExoticSelector: React.FC<ExoticSelectorProps> = ({
  selectedCharacter,
  selectedExoticItemHash,
}) => {
  const dispatch = useDispatch();
  const [exotics, setExotics] = useState<ManifestExoticArmor[]>([]);
  const [comboInput, setComboInput] = useState('');
  const [selectedExotic, setSelectedExotic] = useState<ManifestExoticArmor | null>(null);
  const [selectedCombo, setSelectedCombo] = useState<ExoticClassCombo | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [intrinsicMods, setIntrinsicMods] = useState<{ [key: number]: IntrinsicMod }>({});
  const exoticClassCombos = selectedCharacter?.exoticClassCombos;

  const fetchExoticData = async () => {
    if (selectedCharacter) {
      const data = await db.manifestExoticArmorCollection
        .where('class')
        .equalsIgnoreCase(selectedCharacter.class)
        .toArray();
      setExotics(data);
    }
  };

  const fetchIntrinsicModData = async () => {
    if (exoticClassCombos) {
      const hashes = new Set(
        exoticClassCombos.flatMap((combo) => [combo.firstIntrinsicHash, combo.secondIntrinsicHash])
      );
      const modsData = await db.manifestIntrinsicModDef
        .where('itemHash')
        .anyOf([...hashes])
        .toArray();

      const modsMap = modsData.reduce((acc, mod) => {
        acc[mod.itemHash] = {
          itemHash: mod.itemHash,
          name: mod.name,
          icon: mod.icon,
        };
        return acc;
      }, {} as { [key: number]: IntrinsicMod });

      setIntrinsicMods(modsMap);
    }
  };

  useEffect(() => {
    fetchExoticData();
    fetchIntrinsicModData();
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

  function handleExoticClassComboSelect(newValue: ExoticClassCombo | null) {
    setSelectedCombo(newValue);
    dispatch(updateSelectedExoticClassCombo(newValue));
  }

  const handleClearSelection = () => {
    setSelectedExotic(null);
    setSelectedCombo(null);
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
          <ExoticIcon
            src={selectedExotic.icon}
            alt="Exotic Icon"
            isOwned={selectedExotic.isOwned}
            isSelected={true}
          />
          {selectedExotic.slot === ARMOR.CLASS_ARMOR && (
            <Autocomplete
              id="exotic_combos"
              disablePortal
              value={selectedCombo}
              onChange={(event, newValue) =>
                handleExoticClassComboSelect(newValue as ExoticClassCombo | null)
              }
              inputValue={comboInput}
              onInputChange={(event, newInputValue) => {
                setComboInput(newInputValue);
              }}
              options={exoticClassCombos ? exoticClassCombos : []}
              getOptionLabel={(option: ExoticClassCombo) => {
                const first = intrinsicMods[option.firstIntrinsicHash];
                const second = intrinsicMods[option.secondIntrinsicHash];
                return `${first?.name || ''} / ${second?.name || ''}`;
              }}
              sx={{ width: 300 }}
              PopperComponent={StyledPopper}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;
                const first = intrinsicMods[option.firstIntrinsicHash];
                const second = intrinsicMods[option.secondIntrinsicHash];
                return (
                  <li {...otherProps} key={option.firstIntrinsicHash + option.secondIntrinsicHash}>
                    <ComboOption>
                      <ComboItem>
                        {first && <ComboIcon src={first.icon} alt={first.name} />}
                        <span>{first?.name || ''}</span>
                      </ComboItem>
                      <ComboItem>
                        {second && <ComboIcon src={second.icon} alt={second.name} />}
                        <span>{second?.name || ''}</span>
                      </ComboItem>
                    </ComboOption>
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Exotic Class Options"
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
          )}
          <ArrowButton isSelected={true} onClick={handleClearSelection}>
            <ArrowIcon isSelected={true} />
          </ArrowButton>
        </div>
      )}
    </NewComponentContainer>
  );
};

export default ExoticSelector;
