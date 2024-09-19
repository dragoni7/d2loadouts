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
        mixBlendMode: 'difference',
      }}
    >
      <Tooltip title="Logout">
        <IconButton
          onClick={onLogoutClick}
          sx={{
            borderRadius: 4,
            mixBlendMode: 'difference',
          }}
        >
          <Logout color="inherit" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
