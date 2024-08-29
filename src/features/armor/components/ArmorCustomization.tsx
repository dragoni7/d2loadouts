import React from 'react';
import './ArmorCustomization.css';
import ArmorGrid from './ArmorGrid';
import EquipLoadout from '../../loadouts/components/EquipLoadout';
import { ManifestSubclass } from '../../../types/manifest-types';
import AbilitiesModification from '../../subclass/AbilitiesModification';
import { Button, Box, Container, Stack, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { flexRender } from '@tanstack/react-table';

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
        <Grid item md={1}>
          SPACE FOR SOMETHING
        </Grid>
        <Grid
          item
          md={1}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <Container maxWidth="lg">
            <ArmorGrid />
          </Container>
        </Grid>
        <Grid item md={1}>
          <AbilitiesModification subclass={subclass} />
        </Grid>
        <Grid item md={1} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          SPACE FOR SOMETHING
        </Grid>
        <Grid item md={1} sx={{ textAlign: 'center' }}>
          <EquipLoadout />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ArmorCustomization;
