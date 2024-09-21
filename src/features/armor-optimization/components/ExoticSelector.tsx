import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { db } from '../../../store/db';
import { ArmorSlot, Character, ExoticClassCombo } from '../../../types/d2l-types';
import {
  updateSelectedExoticClassCombo,
  updateSelectedExoticItemHash,
  updateSelectedValues,
} from '../../../store/DashboardReducer';
import { useDispatch } from 'react-redux';
import { ManifestExoticArmor } from '../../../types/manifest-types';
import { ARMOR } from '../../../lib/bungie_api/constants';
import {
  StyledPopper,
  ExoticIcon,
  ComboOption,
  ComboItem,
  ComboIcon,
  ArrowButton,
  ArrowIcon,
} from '../styled';

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
        slot: newValue?.slot as ArmorSlot,
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
    dispatch(updateSelectedValues({}));
  };

  return (
    <>
      {!selectedExotic ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
    </>
  );
};

export default ExoticSelector;
