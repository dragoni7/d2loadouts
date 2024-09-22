import { Box, styled, Typography } from '@mui/material';

// header
export const Header = styled('div')<{ emblemUrl: string }>(({ emblemUrl }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '120px',
  backgroundImage: `url(${emblemUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  padding: '0 20px',
  boxSizing: 'border-box',
  zIndex: 1000,
  font: 'Helvetica',
}));

export const HeaderOverlayImage = styled('img')({
  position: 'absolute',
  left: '210px',
  top: '120px',
  transform: 'translateY(-50%)',
  width: '100px',
  height: '100px',
});

export const HeaderDisplayName = styled('div')({
  marginLeft: '300px',
  marginTop: '30px',
  fontSize: '32px',
  color: 'white',
  fontWeight: 'bold',
});

export const HeaderBottomContainer = styled('div')({
  position: 'absolute',
  bottom: '0',
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
});

export const HeaderButtonContainer = styled('div')({
  display: 'flex',
  gap: '20px',
});

const sharedTextStyles = {
  fontSize: '24px',
  cursor: 'pointer',
  paddingBottom: '5px',
  transition: 'opacity 0.3s, transform 0.3s',
  position: 'relative' as const,
  '&:hover': {
    opacity: 1,
    transform: 'translateY(-2px)',
  },
};

export const HeaderCharacterText = styled('div')<{ isSelected: boolean }>(({ isSelected }) => ({
  ...sharedTextStyles,
  color: isSelected ? 'white' : 'rgba(255, 255, 255, 0.6)',
  opacity: isSelected ? 1 : 0.6,
  textTransform: 'capitalize',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '4px',
    backgroundColor: 'white',
    transform: isSelected ? 'scaleX(1)' : 'scaleX(0)',
    transition: 'transform 0.3s',
  },
}));

export const HeaderLinksContainer = styled('div')({
  position: 'absolute',
  right: '20px',
  top: '6%',
  display: 'flex',
  gap: '12px',
  alignItems: 'flex-end',
});

export const HeaderStyledLink = styled('a')({
  ...sharedTextStyles,
  color: 'rgba(255, 255, 255, 0.9)',
  textDecoration: 'none',
  opacity: 0.6,
  mixBlendMode: 'difference',
  '&:hover': {
    ...sharedTextStyles['&:hover'],
    color: 'white',
  },
});

// hover card

export const HoverCardContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '-100%',
  right: '100%',
  zIndex: 1600,
  padding: theme.spacing(1.5),
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  borderRadius: '0px',
  boxShadow: theme.shadows[10],
  width: '14vw',
  pointerEvents: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  fontFamily: 'Arial, sans-serif',
}));

export const HoverCardTitle = styled(Typography)({
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  fontSize: '16px',
  textAlign: 'center',
  color: '#ffffff',
});

export const HoverCardIcon = styled('img')({
  width: '100%',
  height: 'auto',
  objectFit: 'contain',
  margin: '8px 0',
});

export const HoverCardDescription = styled(Typography)({
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  color: '#cccccc',
});

export const HoverCardStatsList = styled('ul')({
  margin: '4px 0',
  paddingLeft: '20px',
  color: '#cccccc',
  listStyleType: 'none',
});

export const EnergyCapacitySquare = styled('div')(({ theme }) => ({
  width: '12px',
  height: '12px',
  backgroundColor: 'white',
  opacity: 0.3,
  marginRight: '2px',
}));

export const ModHoverCardHeader = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '8px',
});

export const ModHoverCardTitleRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const ModHoverCardIcon = styled('img')({
  width: '32px',
  height: '32px',
  marginRight: '8px',
});

export const ModHoverCardTitle = styled(Typography)({
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  fontSize: '18px',
  color: '#ffffff',
  flexGrow: 1,
});

export const HoverCardEnergyCostChip = styled(Box)(({ theme }) => ({
  color: '#ffffff',
  padding: '2px 6px',
  fontSize: '24px',
  fontWeight: 'bold',
}));

export const HoverCardModTypeLabel = styled(Typography)({
  fontSize: '12px',
  color: '#aaaaaa',
  marginTop: '4px',
});

export const HoverCardDivider = styled('div')({
  width: '100%',
  height: '1px',
  background:
    'linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0))',
  margin: '8px 0',
});

export const HoverCardModDescriptionContainer = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
});

export const HoverCardModDescription = styled(Typography)({
  fontSize: '14px',
  color: '#cccccc',
  flexGrow: 1,
});
