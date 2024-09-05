import React from 'react';
import { Box, styled } from '@mui/material';

interface StatModification {
  stat: string;
  value: number;
  name: string;
}

interface StatModificationsProps {
  modifications: StatModification[];
}

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

const StatModificationText = styled('div')(({ theme }) => ({
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontWeight: 'bold',
  fontSize: '1rem',
  marginBottom: theme.spacing(0.5),
  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
}));

const StatModifications: React.FC<StatModificationsProps> = ({ modifications }) => {
  return (
    <StatModificationsContainer>
      {modifications.map(({ stat, value, name }, index) => {
        const color = value > 0 ? 'green' : 'red';
        const sign = value > 0 ? '+' : '';
        return (
          <StatModificationText key={`${stat}-${index}`} style={{ color }}>
            {stat.charAt(0).toUpperCase() + stat.slice(1)}: {sign}
            {value} ({name})
          </StatModificationText>
        );
      })}
    </StatModificationsContainer>
  );
};

export default StatModifications;
