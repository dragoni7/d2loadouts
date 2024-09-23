import React from 'react';
import { Box, Container, Grid, styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import ModCustomization from '../features/armor-mods/components/ModCustomization';
import EquipLoadout from '../features/loadouts/components/EquipLoadout';
import AbilitiesModification from '../features/subclass/components/AbilitiesModification';
import ShareLoadout from '../features/loadouts/components/ShareLoadout';
import { SubclassConfig } from '../types/d2l-types';
import { BackButton } from './BackButton';
import BuildStats from './BuildStats';
import FadeIn from './FadeIn';

export const WarningTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 600,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: '0px',
    boxShadow: 10,
    fontFamily: 'Arial, sans-serif',
    color: 'orange',
    fontWeight: 'bold',
    fontSize: 18,
    [theme.breakpoints.down('lg')]: {
      fontSize: 16,
    },
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: 'black',
  },
}));

interface LoadoutCustomizationProps {
  onBackClick: () => void;
  screenshot: string;
  subclass: SubclassConfig;
}

const LoadoutCustomization: React.FC<LoadoutCustomizationProps> = ({
  onBackClick,
  screenshot,
  subclass,
}) => {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
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

      <Grid container columns={2} sx={{ position: 'relative', zIndex: 3, height: '100%' }}>
        <Grid item md={2}>
          <BackButton
            onClick={onBackClick}
            startIcon={<span style={{ fontSize: '1.2em' }}>←</span>}
          >
            Back
          </BackButton>
        </Grid>

        <Grid item md={1}>
          <Container maxWidth="lg">
            <ModCustomization />
          </Container>
        </Grid>
        <Grid item md={1} sx={{ marginTop: -4 }}>
          <FadeIn duration={400}>
            <AbilitiesModification subclass={subclass} />
          </FadeIn>
        </Grid>
        <Grid
          item
          md={1}
          sx={{
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <BuildStats />
        </Grid>
        <WarningTooltip
          title={'⚠️ You must be in orbit for equipping to occur properly ⚠️'}
          placement="top"
          slotProps={{ popper: { modifiers: [{ name: 'offset', options: { offset: [0, -30] } }] } }}
          arrow
        >
          <Grid item md={1} sx={{ textAlign: 'center', alignContent: 'end', marginBottom: 5 }}>
            <EquipLoadout />
            <ShareLoadout />
          </Grid>
        </WarningTooltip>
      </Grid>
    </Box>
  );
};

export default LoadoutCustomization;
