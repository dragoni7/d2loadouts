import React from 'react';
import AbilitiesModification from './AbilitiesModification';
import './SubclassCustomizationWrapper.css';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ManifestSubclass } from '../types/manifest-types';

interface SubclassCustomizationWrapperProps {
  onBackClick: () => void;
  subclass: ManifestSubclass;
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
    <div
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
      <AbilitiesModification subclass={subclass} />
    </div>
  );
};

export default SubclassCustomizationWrapper;