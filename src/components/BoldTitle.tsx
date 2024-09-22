import { styled, Typography } from '@mui/material';

export const BoldTitle = styled(Typography)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(1),
  fontSize: '30px',
  fontWeight: 'bold',
}));
