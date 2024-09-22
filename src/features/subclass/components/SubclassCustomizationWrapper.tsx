import React from 'react';
import AbilitiesModification from './AbilitiesModification';
import { Box } from '@mui/material';
import { SubclassConfig } from '../../../types/d2l-types';
import { BackButton } from '../../../components/BackButton';
import StatModifications from './StatModifications';

interface SubclassCustomizationWrapperProps {
  onBackClick: () => void;
  subclass: SubclassConfig;
  screenshot: string;
}

const SubclassCustomizationWrapper: React.FC<SubclassCustomizationWrapperProps> = ({
  onBackClick,
  subclass,
  screenshot,
}) => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${screenshot})`,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'auto',
      }}
    >
      <Box position="absolute" top={16} left={16} zIndex={1000}>
        <BackButton onClick={onBackClick} startIcon={<span style={{ fontSize: '1.2em' }}>←</span>}>
          Back
        </BackButton>
      </Box>
      <Box sx={{ marginTop: '5vh' }}>
        <AbilitiesModification subclass={subclass} />
      </Box>
      <Box position="absolute" bottom={16} left={16} zIndex={1000}>
        <StatModifications />
      </Box>
    </Box>
  );
};

export default SubclassCustomizationWrapper;
