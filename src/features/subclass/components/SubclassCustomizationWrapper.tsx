import React from 'react';
import AbilitiesModification from './AbilitiesModification';
import { Box, Stack } from '@mui/material';
import { SubclassConfig } from '../../../types/d2l-types';
import { BackButton } from '../../../components/BackButton';
import FragmentStats from './FragmentStats';
import BuildStats from '@/components/BuildStats';

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
      <Box sx={{ marginTop: '7vh' }}>
        <AbilitiesModification subclass={subclass} />
      </Box>
      <Box position="absolute" bottom={50} left={16} zIndex={1000}>
        <Stack spacing={5}>
          <BuildStats />
          <FragmentStats />
        </Stack>
      </Box>
    </Box>
  );
};

export default SubclassCustomizationWrapper;
