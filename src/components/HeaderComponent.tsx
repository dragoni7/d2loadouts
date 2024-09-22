import useSelectedCharacter from '@/hooks/use-selected-character';
import { RootState } from '@/store';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSelectedCharacter } from '../store/DashboardReducer';
import {
  Header,
  HeaderBottomContainer,
  HeaderButtonContainer,
  HeaderCharacterText,
  HeaderDisplayName,
  HeaderOverlayImage,
} from '../styled';

interface HeaderComponentProps {
  onCharacterClick: (index: number) => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ onCharacterClick }) => {
  const dispatch = useDispatch();

  const selectedCharacter = useSelectedCharacter();

  const characters = useSelector((root: RootState) => root.profile.characters);
  const displayName = useSelector(
    (root: RootState) => root.destinyMembership.membership.bungieGlobalDisplayName
  );

  const handleCharacterClick = (index: number) => {
    onCharacterClick(index);
    dispatch(updateSelectedCharacter(index));
  };

  return (
    <Header emblemUrl={selectedCharacter?.emblem?.secondarySpecial!}>
      <HeaderOverlayImage src={selectedCharacter?.emblem?.secondaryOverlay!} alt="Overlay" />
      <HeaderDisplayName>{displayName}</HeaderDisplayName>
      <HeaderBottomContainer>
        <HeaderButtonContainer>
          {characters.map((character, index) => (
            <HeaderCharacterText
              key={index}
              isSelected={selectedCharacter?.id === character.id}
              onClick={() => handleCharacterClick(index)}
            >
              {character.class.toLocaleUpperCase()}
            </HeaderCharacterText>
          ))}
        </HeaderButtonContainer>
      </HeaderBottomContainer>
    </Header>
  );
};

export default HeaderComponent;
