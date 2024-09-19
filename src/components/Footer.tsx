import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import LogoutButton from '@/features/auth/components/LogoutButton';
import RefreshCharacters from './RefreshCharacters';
import CoffeeButton from './CoffeeButton';

interface FooterProps {
  emblemUrl: string;
}

const Footer: React.FC<FooterProps> = ({ emblemUrl }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '5.4%',
        backgroundImage: `url(${emblemUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        zIndex: 1000,
      }}
    >
      <Typography
        variant="caption"
        textAlign="center"
        sx={{
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          width: '100%',
        }}
      >
        Built by Dragoni and Rorschach. Destiny 2 and its assets are the property of Bungie. Used
        under Bungie's Fan-Created Media and Art guidelines. Consider supporting us!
      </Typography>

      <Stack
        direction="row"
        alignItems="flex-end"
        justifyContent="center"
        spacing={2}
        sx={{ position: 'absolute', right: 0, zIndex: 1001, width: '20%' }}
      >
        <Box style={{ width: '50%' }}>
          <CoffeeButton />
        </Box>
        <RefreshCharacters />
        <LogoutButton />
      </Stack>
    </Box>
  );
};

export default Footer;
