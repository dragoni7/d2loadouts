import { Box, Dialog, IconButton, ListItem, styled, TextField, Typography } from '@mui/material';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    fontFamily: 'Helvetica, Arial, sans-serif',
    borderRadius: 0,
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: 'white',
    fontFamily: 'Helvetica, Arial, sans-serif',
    '& fieldset': {
      borderColor: 'white',
      borderRadius: 0,
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'white',
    fontFamily: 'Helvetica, Arial, sans-serif',
  },
}));

export const StatIcon = styled('img')({
  width: 24,
  height: 24,
  marginRight: 10,
});
export const StatListContainer = styled(Box)({
  position: 'relative',
  height: '400px',
});

export const StatListItem = styled(ListItem)<{ index: number }>(({ theme, index }) => ({
  backgroundColor: 'transparent',
  width: '100%',
  padding: theme.spacing(1, 2),
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  transition: 'transform 0.3s ease',
  transform: `translateY(${index * 60}px)`,
}));

export const PriorityLabel = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  color: 'white',
  width: '120px',
}));

export const ArrowButton = styled(IconButton)(({ theme }) => ({
  color: 'white',
  padding: theme.spacing(0.5),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  width: '24px',
  height: '24px',
}));

export const StatButton = styled(Box)(({ theme }) => ({
  width: '150px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: theme.spacing(0, 1),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid white',
}));

export const ArrowContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: theme.spacing(2),
  width: '24px',
}));
