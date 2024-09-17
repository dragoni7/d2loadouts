import React from 'react';
import AbilitiesModification from './AbilitiesModification';
import './SubclassCustomizationWrapper.css';
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
      className="subclass-customization-wrapper"
      style={{ backgroundImage: `url(${screenshot})` }}
    >
      <Box position="absolute" top={16} left={16} zIndex={1000}>
        <BackButton onClick={onBackClick} startIcon={<span style={{ fontSize: '1.2em' }}>←</span>}>
          Back
        </BackButton>
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
