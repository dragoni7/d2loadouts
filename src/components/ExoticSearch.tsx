import React, { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { Autocomplete, TextField } from '@mui/material';
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

const ExoticIcon = styled('img')({
  width: '50px',
  height: '50px',
  marginRight: '10px',
});

const ArrowButton = styled('div')({
  width: '30px',
  height: '30px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  borderRadius: '50%',
  marginLeft: '10px',
});

const ArrowIcon = styled('div')({
  width: 0,
  height: 0,
  borderLeft: '10px solid white',
  borderTop: '5px solid transparent',
  borderBottom: '5px solid transparent',
});

const SelectExotic = styled('span')({
  fontSize: '16px',
  fontWeight: 'bold',
});

type ExoticViewModel = {
  itemHash: string;
  name: string;
  icon: string;
  isOwned: boolean;
};

interface ExoticSearchProps {
  selectedCharacter: Character | null;
}

const ExoticSearch: React.FC<ExoticSearchProps> = ({ selectedCharacter }) => {
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
            onChange={(event: any, newValue: ExoticViewModel | null) => {
              setSelectedExotic(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            id="exotics"
            options={exotics}
            getOptionLabel={(option: ExoticViewModel) => option.name}
            sx={{ width: 300 }}
            renderOption={(props, option) => (
              <li {...props} style={{ color: option.isOwned ? 'inherit' : 'grey' }}>
                <ExoticIcon src={option.icon} alt="Exotic Icon" />
                {option.name}
              </li>
            )}
            renderInput={(params) => <TextField {...params} label="Exotics" />}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {selectedExotic && <ExoticIcon src={selectedExotic.icon} alt="Exotic Icon" />}
          <ArrowButton onClick={handleClearSelection}>
            <ArrowIcon />
          </ArrowButton>
        </div>
      )}
    </NewComponentContainer>
  );
};

export default ExoticSearch;
