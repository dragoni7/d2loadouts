import { Logout } from '@mui/icons-material';
import { Tooltip, IconButton, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  function onLogoutClick() {
    localStorage.removeItem('authTokens');
    navigate('/');
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '1%',
        right: '0',
        zIndex: 9999,
        mixBlendMode: 'difference',
      }}
    >
      <Tooltip title="Logout">
        <IconButton
          onClick={onLogoutClick}
          sx={{
            borderRadius: 4,
          }}
        >
          <Logout color="inherit" fontSize="large" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
