import React from 'react';
import AbilitiesModification from './AbilitiesModification';
import { Box, Grid, Stack } from '@mui/material';
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
    <Grid
      container
      alignItems="center"
      justifyContent="flex-start"
      sx={{
        backgroundImage: `url(${screenshot})`,
        width: '100vw',
        height: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'auto',
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 0,
        }}
      />
      <Grid item md={12}>
        <BackButton onClick={onBackClick} startIcon={<span style={{ fontSize: '1.2em' }}>←</span>}>
          Back
        </BackButton>
      </Grid>
      <Grid item md={4}>
        <Stack spacing={2} alignItems="flex-start" justifyContent="center" marginLeft={2}>
          <Box width="53%">
            <BuildStats />
          </Box>
          <FragmentStats />
        </Stack>
      </Grid>
      <Grid item height="95%" marginTop={2} zIndex={1}>
        <AbilitiesModification subclass={subclass} />
      </Grid>
    </Grid>
  );
};

export default SubclassCustomizationWrapper;
