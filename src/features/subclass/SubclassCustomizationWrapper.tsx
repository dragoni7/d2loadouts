import React from 'react';
import AbilitiesModification from './AbilitiesModification';
import StatModifications from './StatModifications';
import './SubclassCustomizationWrapper.css';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { SubclassConfig } from '../../types/d2l-types';

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

const SubclassCustomizationWrapper: React.FC<SubclassCustomizationWrapperProps> = ({
  onBackClick,
  subclass,
  screenshot,
}) => {
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
      <Box sx={{ marginTop: '15vh' }}>
        <AbilitiesModification subclass={subclass} />
      </Box>
      <Box position="absolute" bottom={16} left={16} zIndex={1000}>
        <StatModifications />
      </Box>
    </Box>
  );
};

export default SubclassCustomizationWrapper;
