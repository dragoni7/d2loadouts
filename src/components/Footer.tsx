import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import LogoutButton from '@/features/auth/components/LogoutButton';
import RefreshCharacters from './RefreshCharacters';
import CoffeeButton from './CoffeeButton';
import useSelectedCharacter from '@/hooks/use-selected-character';
import packageJson from '../../package.json';

const Footer: React.FC = () => {
  const selectedcharacter = useSelectedCharacter();
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '5.4%',
        backgroundImage: `url(${selectedcharacter?.emblem?.secondarySpecial})`,
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
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ position: 'absolute', right: 0, zIndex: 1001, width: '100%' }}
      >
        <Typography
          variant="caption"
          textAlign="center"
          width="10%"
          sx={{
            color: 'white',
            position: 'relative',
            zIndex: 1,
          }}
        >
          App Version: {packageJson.version}
        </Typography>
        <Typography
          variant="caption"
          textAlign="center"
          width="95%"
          sx={{
            color: 'white',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Built by Dragoni and Rorschach. Destiny 2 and its assets are the property of Bungie. Used
          under Bungie's Fan-Created Media and Art guidelines. Consider supporting us!
        </Typography>
        <Box style={{ width: '5%' }}>
          <CoffeeButton />
        </Box>
        <RefreshCharacters />
        <LogoutButton />
      </Stack>
    </Box>
  );
};

export default Footer;
