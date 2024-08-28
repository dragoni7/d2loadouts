import React from 'react';
import './ArmorCustomization.css';
import ArmorGrid from './ArmorGrid';
import EquipLoadout from '../../loadouts/components/EquipLoadout';
import { ManifestSubclass } from '../../../types/manifest-types';
import AbilitiesModification from '../../subclass/AbilitiesModification';
import { Button, Box, Container, Stack, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ArmorCustomizationProps {
  onBackClick: () => void;
  screenshot: string;
  subclass: ManifestSubclass;
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

const ArmorCustomization: React.FC<ArmorCustomizationProps> = ({
  onBackClick,
  screenshot,
  subclass,
}) => {
  return (
    <Grid
      container
      sx={{
        backgroundImage: `url(${screenshot})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
      }}
    >
      <Grid
        item
        container
        alignItems="flex-start"
        px={3}
        md={6}
        sx={{
          zIndex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <Grid item md={12}>
          <TransparentButton
            onClick={onBackClick}
            startIcon={<span style={{ fontSize: '1.2em' }}>←</span>}
          >
            Back
          </TransparentButton>
        </Grid>
        <ArmorGrid />
        <Grid item md={12}>
          <EquipLoadout />
        </Grid>
      </Grid>
      <Grid item container md={6}>
        <AbilitiesModification subclass={subclass} />
      </Grid>
    </Grid>
  );
};

export default ArmorCustomization;
