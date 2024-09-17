import { Button, styled } from '@mui/material';

export const D2LButton = styled(Button)(({ theme }) => ({
  background: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(10px)',
  color: 'white',
  padding: theme.spacing(1, 2),
  fontFamily: 'Helvetica, Arial, sans-serif',
  '&:hover': {
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 1)',
  },
  borderRadius: 0,
  border: '1px solid rgba(255, 255, 255, 0.5)',
  transition: 'all 0.3s ease',
}));
