import React from 'react';
import { styled } from '@mui/system';
import { Character } from '../types';

interface HeaderComponentProps {
  emblemUrl: string;
  overlayUrl: string;
  displayName: string;
  characters: Character[];
  selectedCharacter: Character | null;
  onCharacterClick: (character: Character) => void;
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

const ButtonContainer = styled('div')({
  position: 'absolute',
  bottom: '0px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '20px',
});

const CharacterText = styled('div')<{ isSelected: boolean }>(({ isSelected }) => ({
  fontSize: '24px',
  cursor: 'pointer',
  color: isSelected ? 'white' : 'rgba(255, 255, 255, 0.6)',
  opacity: isSelected ? 1 : 0.6,
  borderBottom: isSelected ? '4px solid white' : 'none',
  paddingBottom: '5px',
  transition: 'opacity 0.3s',
  textTransform: 'capitalize',
  '&:hover': {
    opacity: 1,
  },
}));

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  emblemUrl,
  overlayUrl,
  displayName,
  characters,
  selectedCharacter,
  onCharacterClick,
}) => (
  <Header emblemUrl={emblemUrl}>
    <OverlayImage src={overlayUrl} alt="Overlay Image" />
    <DisplayName>{displayName}</DisplayName>
    <ButtonContainer>
      {characters.map((character) => (
        <CharacterText
          key={character.id}
          isSelected={selectedCharacter?.id === character.id}
          onClick={() => onCharacterClick(character)}
        >
          {character.class}
        </CharacterText>
      ))}
    </ButtonContainer>
  </Header>
);

export default HeaderComponent;
