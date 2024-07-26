import React, { useState } from 'react';
import { styled } from '@mui/system';

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

const ExoticSearch: React.FC = () => {
  const [isExoticSelected, setIsExoticSelected] = useState(false);
  const [selectedExotic, setSelectedExotic] = useState<string | null>(null);

  const handleSelectExotic = () => {
    setSelectedExotic('https://path-to-exotic-icon.png'); // Replace with the path to the selected exotic icon
    setIsExoticSelected(true);
  };

  const handleClearSelection = () => {
    setSelectedExotic(null);
    setIsExoticSelected(false);
  };

  return (
    <NewComponentContainer>
      {!isExoticSelected ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SelectExotic>Select Exotic</SelectExotic>
          <SearchInput placeholder="Search for an exotic..." />
          <button onClick={handleSelectExotic} style={{ display: 'none' }}>
            Select
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {selectedExotic && <ExoticIcon src={selectedExotic} alt="Exotic Icon" />}
          <ArrowButton onClick={handleClearSelection}>
            <ArrowIcon />
          </ArrowButton>
        </div>
      )}
    </NewComponentContainer>
  );
};

export default ExoticSearch;
