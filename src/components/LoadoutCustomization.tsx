import React from 'react';
import './LoadoutCustomization.css';
import { Button, Box, Container, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import ModCustomization from '../features/armor-mods/components/ModCustomization';
import EquipLoadout from '../features/loadouts/components/EquipLoadout';
import AbilitiesModification from '../features/subclass/AbilitiesModification';
import ShareLoadout from '../features/loadouts/components/ShareLoadout';
import { SubclassConfig } from '../types/d2l-types';

interface LoadoutCustomizationProps {
  onBackClick: () => void;
  screenshot: string;
  subclass: SubclassConfig;
}

const TransparentButton = styled(Button)(({ theme }) => ({
  zIndex: 1000,
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

const LoadoutCustomization: React.FC<LoadoutCustomizationProps> = ({
  onBackClick,
  screenshot,
  subclass,
}) => {
  return (
    <Box
      sx={{
        width: '100vw',
        display: 'flex',
        flexGrow: 1,
        backgroundImage: `url(${screenshot})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Grid container columns={2}>
        <Grid item md={1} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <TransparentButton
            onClick={onBackClick}
            startIcon={<span style={{ fontSize: '1.2em' }}>←</span>}
          >
            Back
          </TransparentButton>
        </Grid>
        <Grid item md={1} />
        <Grid
          item
          md={1}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <Container maxWidth="lg">
            <ModCustomization />
          </Container>
        </Grid>
        <Grid item md={1}>
          <AbilitiesModification subclass={subclass} />
        </Grid>
        <Grid item md={1} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', textAlign: 'center' }}>
          FREE SPACE FOR SOMETHING
        </Grid>
        <Grid item md={1} sx={{ textAlign: 'center' }}>
          <EquipLoadout />
          <ShareLoadout />
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoadoutCustomization;
