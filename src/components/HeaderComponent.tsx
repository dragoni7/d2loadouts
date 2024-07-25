import React from 'react';
import { styled } from '@mui/system';

interface HeaderComponentProps {
  emblemUrl: string;
  overlayUrl: string;
  displayName: string;
}

const Header = styled('div')<{ emblemUrl: string }>(({ emblemUrl }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '130px',
  backgroundImage: `url(${emblemUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  padding: '0 20px',
  boxSizing: 'border-box',
  zIndex: 1000,
}));

const OverlayImage = styled('img')({
  position: 'absolute',
  left: '210px',
  top: '120px',
  transform: 'translateY(-50%)',
  width: '100px',
  height: '100px',
});

const DisplayName = styled('div')({
  marginLeft: '300px',
  marginTop: '30px',
  fontSize: '32px',
  color: 'white',
  fontWeight: 'bold',
});

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  emblemUrl,
  overlayUrl,
  displayName,
}) => (
  <Header emblemUrl={emblemUrl}>
    <OverlayImage src={overlayUrl} alt="Overlay Image" />
    <DisplayName>{displayName}</DisplayName>
  </Header>
);

export default HeaderComponent;
