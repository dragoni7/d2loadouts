import React from 'react';
import { Character } from '../types/d2l-types';
import { useDispatch } from 'react-redux';
import { updateSelectedCharacter } from '../store/DashboardReducer';
import {
  HeaderOverlayImage,
  HeaderDisplayName,
  HeaderBottomContainer,
  HeaderButtonContainer,
  HeaderCharacterText,
  HeaderLinksContainer,
  HeaderStyledLink,
  Header,
} from '../styled';

interface HeaderComponentProps {
  emblemUrl: string;
  overlayUrl: string;
  displayName: string;
  characters: Character[];
  selectedCharacter: Character | null;
  onCharacterClick: (index: number) => void;
}

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
      <HeaderOverlayImage src={overlayUrl} alt="Overlay" />
      <HeaderDisplayName>{displayName}</HeaderDisplayName>
      <HeaderBottomContainer>
        <HeaderButtonContainer>
          {characters.map((character, index) => (
            <HeaderCharacterText
              key={index}
              isSelected={selectedCharacter?.id === character.id}
              onClick={() => handleCharacterClick(index)}
            >
              {character.class}
            </HeaderCharacterText>
          ))}
        </HeaderButtonContainer>
      </HeaderBottomContainer>
      <HeaderLinksContainer>
        <HeaderStyledLink
          href="https://buymeacoffee.com/d2loadouts"
          target="_blank"
          rel="noopener noreferrer"
        >
          Coffee
        </HeaderStyledLink>
        <HeaderStyledLink
          href="https://patreon.com/d2loadouts"
          target="_blank"
          rel="noopener noreferrer"
        >
          Patreon
        </HeaderStyledLink>
      </HeaderLinksContainer>
    </Header>
  );
};

export default HeaderComponent;
