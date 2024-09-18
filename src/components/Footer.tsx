import React from 'react';
import { Box, Typography } from '@mui/material';

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
        height: '40px',
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
        sx={{
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        Built by Dragoni and Rorschach. Destiny 2 and its assets are the property of Bungie. Used
        under Bungie's Fan-Created Media and Art guidelines.
      </Typography>
    </Box>
  );
};

export default Footer;
