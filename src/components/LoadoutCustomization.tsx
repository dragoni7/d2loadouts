import React from 'react';
import './LoadoutCustomization.css';
import { Button, Box, Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ModCustomization from '../features/armor-mods/components/ModCustomization';
import EquipLoadout from '../features/loadouts/components/EquipLoadout';
import AbilitiesModification from '../features/subclass/AbilitiesModification';
import ShareLoadout from '../features/loadouts/components/ShareLoadout';
import { SubclassConfig, StatName } from '../types/d2l-types';
import SaveLoadout from '../features/loadouts/components/SaveLoadout';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

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

const StatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  marginRight: theme.spacing(2),
}));

const StatIcon = styled('img')({
  width: 24,
  height: 24,
  marginRight: 8,
});

const StatValue = styled(Typography)({
  color: 'white',
  fontSize: '1.2rem',
  fontWeight: 'bold',
});

const LoadoutCustomization: React.FC<LoadoutCustomizationProps> = ({
  onBackClick,
  screenshot,
  subclass,
}) => {
  const selectedPermutationStats = useSelector(
    (state: RootState) => state.dashboard.selectedPermutationStats
  );

  const statIcons: Record<StatName, string> = {
    mobility: 'assets/mob.png',
    resilience: 'assets/res.png',
    recovery: 'assets/rec.png',
    discipline: 'assets/disc.png',
    intellect: 'assets/int.png',
    strength: 'assets/str.png',
  };

  return (
    <Box
      sx={{
        width: '100vw',
        display: 'flex',
        flexGrow: 1,
        position: 'relative',
        overflow: 'auto',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: '50%',
          width: '2px',
          height: '100%',
          background:
            'linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0.8) 10%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1))',
          boxShadow: '0 0 10px rgba(0,0,0,0.7), 0 0 5px rgba(0,0,0,0.1)',
          zIndex: 2,
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${screenshot})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />

      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        }}
      />

      <Grid container columns={2} sx={{ position: 'relative', zIndex: 3 }}>
        <Grid item md={1}>
          <TransparentButton
            onClick={onBackClick}
            startIcon={<span style={{ fontSize: '1.2em' }}>←</span>}
          >
            Back
          </TransparentButton>
        </Grid>
        <Grid item md={1} />
        <Grid item md={1}>
          <Container maxWidth="lg">
            <ModCustomization />
          </Container>
        </Grid>
        <Grid item md={1}>
          <AbilitiesModification subclass={subclass} />
        </Grid>
        <Grid item md={1} sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
            {Object.entries(selectedPermutationStats).map(([stat, value]) => (
              <StatContainer key={stat}>
                <StatIcon src={statIcons[stat as StatName]} alt={stat} />
                <StatValue>{value}</StatValue>
              </StatContainer>
            ))}
          </Box>
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
