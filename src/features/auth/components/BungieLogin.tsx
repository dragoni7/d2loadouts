import React from 'react';
import { authenticate } from '../../../lib/bungie_api/authorization';
import { Button } from '@mui/material';

const BungieLogin: React.FC = () => {
  function onLogIn() {
    authenticate();
  }

  return (
    <Button
      variant="outlined"
      onClick={onLogIn}
      sx={{
        color: 'white',
        borderColor: 'rgba(255,255,255,0.5)',
        borderWidth: '1px',
        borderRadius: 0,
        padding: '10px 20px',
        transition: 'all 0.3s ease',
        fontFamily: 'Helvetica, Arial, sans-serif',
        '&:hover': {
          borderColor: 'rgba(255,255,255,1)',
          backgroundColor: 'rgba(255,255,255,0.1)',
        },
      }}
    >
      Authorize with Bungie.net
    </Button>
  );
};

export default BungieLogin;
