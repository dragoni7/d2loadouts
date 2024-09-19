import { Popper, styled } from '@mui/material';

export const ExoticIcon = styled('img')<{ isOwned: boolean; isSelected: boolean }>(
  ({ isOwned, isSelected }) => ({
    width: isSelected ? '91px' : '50px',
    height: isSelected ? '91px' : '50px',
    marginRight: '10px',
    filter: isOwned ? 'none' : 'grayscale(100%)',
    border: isSelected ? '5px solid transparent' : 'none',
    borderImage: isSelected
      ? 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C) 1'
      : 'none',
    boxShadow: isSelected ? '0 0 10px 2px rgba(251, 245, 183, 0.5)' : 'none',
  })
);

export const ArrowButton = styled('div')<{ isSelected: boolean }>(({ isSelected }) => ({
  width: isSelected ? '20px' : '30px',
  height: isSelected ? '100px' : '30px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  borderRadius: '0',
  marginLeft: '10px',
  '&:hover': {
    border: '1px solid white',
  },
}));

export const ArrowIcon = styled('div')<{ isSelected: boolean }>(({ isSelected }) => ({
  width: 0,
  height: 0,
  borderLeft: '10px solid white',
  borderTop: '5px solid transparent',
  borderBottom: '5px solid transparent',
}));

export const SelectExotic = styled('span')({
  fontSize: '16px',
  fontWeight: 'bold',
  color: 'white',
  marginRight: '10px',
});

export const StyledPopper = styled(Popper)({
  '& .MuiAutocomplete-paper': {
    backgroundColor: 'transparent',
    color: 'white',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'white',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
  },
  '& .MuiAutocomplete-listbox': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  '& .MuiAutocomplete-option': {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&[aria-selected="true"]': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  },
});

export const ComboOption = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

export const ComboItem = styled('div')({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '4px',
});

export const ComboIcon = styled('img')({
  width: '24px',
  height: '24px',
  marginRight: '8px',
});
