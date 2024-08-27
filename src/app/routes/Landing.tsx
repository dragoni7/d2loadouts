import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import BungieLogin from '../../features/auth/BungieLogin';
import { regenerateTokens } from '../../lib/bungie_api/token-services';
import { isAuthenticated } from '../../lib/bungie_api/Authorization';
import { Container, Grid, Paper, Box, Typography } from '@mui/material';
import pyramidBackground from '../../assets/pyramid.jpg';

const FogOverlay = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        left: '-50%',
        top: '-50%',
        right: '-50%',
        bottom: '-50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
        animation: 'fogAnimation 10s infinite linear',
      },
      '&::after': {
        animationDirection: 'reverse',
        animationDuration: '15s',
      },
      '@keyframes fogAnimation': {
        '0%': { transform: 'translate(0, 0)' },
        '100%': { transform: 'translate(25%, 25%)' },
      },
    }}
  />
);

export const LandingRoute = () => {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
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

  if (hidden) {
    return null;
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
        alignItems: 'center',
        justifyContent: 'center',
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
      <FogOverlay />
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
          <Grid
            container
            spacing={3}
            direction="column"
            justifyContent="space-around"
            alignItems="center"
          >
            <Grid item xs={12} marginBottom={6}>
              <Typography
                variant="h2"
                component="h1"
                color="white"
                sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              >
                D2Loadouts
              </Typography>
            </Grid>
            <Grid item xs={12} marginBottom={4}>
              <Typography
                variant="body1"
                color="white"
                sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
              >
                D2Loadouts requires permission to read your Destiny 2 information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <BungieLogin />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default LandingRoute;
