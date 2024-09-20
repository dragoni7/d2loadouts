import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import BungieLogin from '../../features/auth/components/BungieLogin';
import { regenerateTokens } from '../../lib/bungie_api/token-services';
import { isAuthenticated } from '../../lib/bungie_api/authorization';
import { Container, Grid, Paper, Box, Typography, styled, CircularProgress } from '@mui/material';
import pyramidBackground from '/assets/pyramid.jpg';
import FeatureSlider from '../../components/FeatureSlider';
import { useScramble } from 'use-scramble';
import { handleVersionUpdate } from '../../util/version-check';

const LoadingScreen = styled(Box)(({ theme }) => ({
  height: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: `url(${pyramidBackground})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}));

export const LandingRoute: React.FC = () => {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(true);
  const { ref, replay } = useScramble({
    text: 'D2Loadouts',
    speed: 0.3,
    tick: 1,
    step: 1,
    scramble: 10,
    seed: 0.5,
  });

  useEffect(() => {
    // version check
    handleVersionUpdate();
    // if navigated with share link, store the data before authenticating
    if (window.location.href.includes('d='))
      localStorage.setItem('lastShared', window.location.href.split('d=')[1]);

    setTimeout(async () => {
      if (isAuthenticated()) {
        console.log('Already authenticated');
        navigate('/app');
      } else if (await regenerateTokens()) {
        console.log('Tokens regenerated and authenticated');
        navigate('/app');
      } else {
        console.log('Not authenticated');
      }
      setHidden(false);
    }, 300);
  }, [navigate]);

  useEffect(() => {
    if (!hidden) {
      replay();
    }
  }, [hidden, replay]);

  if (hidden) {
    return (
      <LoadingScreen>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h5" sx={{ mt: 2, color: 'white' }}>
          Loading D2Loadouts...
        </Typography>
      </LoadingScreen>
    );
  }

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `url(${pyramidBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Helvetica, Arial, sans-serif',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)',
        },
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            bgcolor: 'rgba(20, 20, 20, 0.8)',
            padding: 6,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Grid container spacing={3} direction="column" alignItems="center">
            <Grid item xs={12}>
              <Typography
                ref={ref}
                variant="h2"
                component="h1"
                color="white"
                sx={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 'bold',
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="body1"
                color="white"
                sx={{
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                }}
              >
                D2Loadouts requires permission to read your Destiny 2 information
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ width: '100%', maxWidth: 600, margin: 'auto' }}>
              <FeatureSlider />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 4 }}>
              <BungieLogin />
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Typography
        variant="body2"
        color="white"
        sx={{
          marginTop: 2,
          opacity: 0.7,
          fontFamily: 'Helvetica, Arial, sans-serif',
        }}
      >
        Made by Rorschach and Dragoni
      </Typography>
    </Box>
  );
};

export default LandingRoute;
