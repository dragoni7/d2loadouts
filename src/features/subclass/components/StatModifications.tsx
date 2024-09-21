import React from 'react';
import { Box, styled, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { ManifestStatPlug } from '../../../types/manifest-types';
import { statIcons } from '../../../util/constants';

const StatModificationsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(5px)',
  borderRadius: 0,
  border: '1px solid rgba(255, 255, 255, 0.3)',
  width: '100%',
  height: '100%',
}));

const StatModificationItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontWeight: 'bold',
  fontSize: '1rem',
  marginBottom: theme.spacing(0.5),
  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
}));

const StatIcon = styled('img')({
  width: '20px',
  height: '20px',
  marginRight: '8px',
});

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

const StatModifications: React.FC = () => {
  const modifications = useSelector(selectFragmentStatModifications);

  if (modifications.length === 0) {
    return null;
  }

  return (
    <StatModificationsContainer>
      <Typography
        sx={{
          opacity: 0.8,
          borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
          paddingBottom: 1,
          marginBottom: 2,
          width: '60%',
        }}
      >
        Fragment Effects
      </Typography>
      {modifications.map(({ stat, value, name }, index) => {
        const color = value > 0 ? 'green' : 'red';
        const sign = value > 0 ? '+' : '';
        return (
          <StatModificationItem key={`${stat}-${index}`}>
            <StatIcon
              src={statIcons[stat]}
              alt={stat}
              style={{ filter: `drop-shadow(0 0 2px ${color})` }}
            />
            <span style={{ color }}>
              {sign}
              {value} {name}
            </span>
          </StatModificationItem>
        );
      })}
    </StatModificationsContainer>
  );
};

export default StatModifications;
