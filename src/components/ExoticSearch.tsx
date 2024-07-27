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

const ExoticSearch: React.FC = () => {
  const [exotics, setExotics] = useState<DestinyArmor[]>([]);
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

  async function getManifestItemName(itemHash: string): Promise<string | undefined> {
    const itemDef = await db.manifestArmorDef.where('hash').equals(Number(itemHash)).first();
    return itemDef?.name;
  }

  useEffect(() => {
    const exoticItemInstances = store.getState().profile.profileData.characters[0]?.exotics;

    if (exoticItemInstances) {
      const obtainedExotics = new Set<DestinyArmor>();

      exoticItemInstances.helmet.forEach((exotic) => {
        obtainedExotics.add(exotic);
      });

      exoticItemInstances.arms.forEach((exotic) => {
        obtainedExotics.add(exotic);
      });

      exoticItemInstances.chest.forEach((exotic) => {
        obtainedExotics.add(exotic);
      });

      exoticItemInstances.legs.forEach((exotic) => {
        obtainedExotics.add(exotic);
      });

      exoticItemInstances.classItem.forEach((exotic) => {
        obtainedExotics.add(exotic);
      });

      const obtainedExoticArray = [...obtainedExotics];
      setExotics(obtainedExoticArray);
    }
  });

  return (
    <NewComponentContainer>
      {!isExoticSelected ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SelectExotic>Select Exotic</SelectExotic>
          <Autocomplete
            disablePortal
            id="exotics"
            options={exotics.map(async (e) => e.itemHash)}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Exotics" />}
          />
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
