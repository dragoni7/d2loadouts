import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import AbilitiesModification from './AbilitiesModification';
import StatModifications from './StatModifications';
import './SubclassCustomizationWrapper.css';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { RootState } from '../../store';
import { SubclassConfig } from '../../types/d2l-types';
import { ManifestStatPlug } from '../../types/manifest-types';

interface SubclassCustomizationWrapperProps {
  onBackClick: () => void;
  subclass: SubclassConfig;
  screenshot: string;
}

const TransparentButton = styled(Button)(({ theme }) => ({
  background: 'transparent',
  color: 'white',
  padding: theme.spacing(1, 2),
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
  },
}));

const selectFragmentStatModifications = createSelector(
  (state: RootState) => state.loadoutConfig.loadout.subclassConfig.fragments,
  (fragments: ManifestStatPlug[]) =>
    fragments.reduce((acc, fragment) => {
      if (fragment.itemHash !== 0) {
        const stats = ['mobility', 'resilience', 'recovery', 'discipline', 'intellect', 'strength'];
        stats.forEach((stat) => {
          const value = fragment[`${stat}Mod` as keyof ManifestStatPlug] as number;
          if (value !== 0) {
            acc.push({ stat, value, name: fragment.name });
          }
        });
      }
      return acc;
    }, [] as { stat: string; value: number; name: string }[])
);

const SubclassCustomizationWrapper: React.FC<SubclassCustomizationWrapperProps> = ({
  onBackClick,
  subclass,
  screenshot,
}) => {
  const fragmentStatMods = useSelector(selectFragmentStatModifications);

  return (
    <Box
      className="subclass-customization-wrapper"
      style={{ backgroundImage: `url(${screenshot})` }}
    >
      <Box position="absolute" top={16} left={16} zIndex={1000}>
        <TransparentButton
          onClick={onBackClick}
          startIcon={<span style={{ fontSize: '1.2em' }}>←</span>}
        >
          Back
        </TransparentButton>
      </Box>
      <StatModifications modifications={fragmentStatMods} />
      <Box sx={{ marginTop: '15vh' }}>
        <AbilitiesModification subclass={subclass} />
      </Box>
    </Box>
  );
};

export default SubclassCustomizationWrapper;
