import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import AbilitiesModification from './AbilitiesModification';
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

const StatModification = styled('div')(({ theme }) => ({
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontWeight: 'bold',
  fontSize: '1rem',
  marginBottom: theme.spacing(0.5),
  textShadow: '1px 1px 1px rgba(0, 0, 0, 0.5)',
}));

const StatModificationsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 16,
  left: 16,
  zIndex: 1000,
  padding: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(5px)',
  borderRadius: 0,
  border: '1px solid rgba(255, 255, 255, 0.3)',
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
            if (!acc[stat]) acc[stat] = [];
            acc[stat].push({ name: fragment.name, value });
          }
        });
      }
      return acc;
    }, {} as Record<string, { name: string; value: number }[]>)
);

const SubclassCustomizationWrapper: React.FC<SubclassCustomizationWrapperProps> = ({
  onBackClick,
  subclass,
  screenshot,
}) => {
  const fragmentStatMods = useSelector(selectFragmentStatModifications);

  const renderStatModifications = () => {
    return Object.entries(fragmentStatMods).map(([stat, modifications]) => {
      return modifications.map(({ name, value }, index) => {
        const color = value > 0 ? 'green' : 'red';
        const sign = value > 0 ? '+' : '';
        return (
          <StatModification key={`${stat}-${index}`} style={{ color }}>
            {stat.charAt(0).toUpperCase() + stat.slice(1)}: {sign}
            {value} ({name})
          </StatModification>
        );
      });
    });
  };

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
      <StatModificationsContainer>{renderStatModifications()}</StatModificationsContainer>
      <Box sx={{ marginTop: '15vh' }}>
        <AbilitiesModification subclass={subclass} />
      </Box>
    </Box>
  );
};

export default SubclassCustomizationWrapper;
