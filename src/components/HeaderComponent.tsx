import React from 'react';
import { styled } from '@mui/system';
import { Character } from '../types/d2l-types';
import { useDispatch } from 'react-redux';
import { updateSelectedCharacter } from '../store/DashboardReducer';

interface HeaderComponentProps {
  emblemUrl: string;
  overlayUrl: string;
  displayName: string;
  characters: Character[];
  selectedCharacter: Character | null;
  onCharacterClick: (index: number) => void;
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
  font: 'Helvetica',
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

const BottomContainer = styled('div')({
  position: 'absolute',
  bottom: '0',
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
});

const ButtonContainer = styled('div')({
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

const CharacterText = styled('div')<{ isSelected: boolean }>(({ isSelected }) => ({
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

const LinksContainer = styled('div')({
  position: 'absolute',
  right: '20px',
  bottom: '-2px',
  display: 'flex',
  gap: '20px',
  alignItems: 'flex-end',
});

const StyledLink = styled('a')({
  ...sharedTextStyles,
  color: 'rgba(255, 255, 255, 0.6)',
  textDecoration: 'none',
  opacity: 0.6,
  '&:hover': {
    ...sharedTextStyles['&:hover'],
    color: 'white',
  },
});

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  emblemUrl,
  overlayUrl,
  displayName,
  characters,
  selectedCharacter,
  onCharacterClick,
}) => {
  const dispatch = useDispatch();

  const handleCharacterClick = (index: number) => {
    onCharacterClick(index);
    dispatch(updateSelectedCharacter(index));
  };

  return (
    <Header emblemUrl={emblemUrl}>
      <OverlayImage src={overlayUrl} alt="Overlay" />
      <DisplayName>{displayName}</DisplayName>
      <BottomContainer>
        <ButtonContainer>
          {characters.map((character, index) => (
            <CharacterText
              key={index}
              isSelected={selectedCharacter?.id === character.id}
              onClick={() => handleCharacterClick(index)}
            >
              {character.class}
            </CharacterText>
          ))}
        </ButtonContainer>
      </BottomContainer>
      <LinksContainer>
        <StyledLink
          href="https://buymeacoffee.com/d2loadouts"
          target="_blank"
          rel="noopener noreferrer"
        >
          Coffee
        </StyledLink>
        <StyledLink href="https://patreon.com/d2loadouts" target="_blank" rel="noopener noreferrer">
          Patreon
        </StyledLink>
      </LinksContainer>
    </Header>
  );
};

export default HeaderComponent;
