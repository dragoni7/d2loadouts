import React, { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import { Autocomplete, TextField } from '@mui/material';
import { RootState, store } from '../store';
import { DestinyArmor } from '../types';
import { useSelector } from 'react-redux';
import { db } from '../store/db';

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

const SearchInput = styled('input')({
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid white',
  marginLeft: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
});

const SelectExotic = styled('span')({
  fontSize: '16px',
  fontWeight: 'bold',
});

type ExoticViewModel = {
  itemHash: string;
  name: string;
  icon: string;
};

const ExoticSearch: React.FC = () => {
  const [exotics, setExotics] = useState<Map<string, ExoticViewModel>>(new Map());
  const [selectedExotic, setSelectedExotic] = useState<ExoticViewModel | null>(null);
  const [inputValue, setInputValue] = React.useState('');

  const handleClearSelection = () => {
    setSelectedExotic(null);
  };

  useEffect(() => {});

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
            options={Array.from(exotics.values())}
            getOptionLabel={(option: ExoticViewModel) => option.name}
            sx={{ width: 300 }}
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
