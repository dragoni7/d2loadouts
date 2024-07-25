import React, { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import SingleDiamondButton from '../../components/SingleDiamondButton';
import NumberBoxes from '../../features/armor-optimization/NumberBoxes';
import { getDestinyMembershipId } from '../../features/membership/BungieAccount';
import { updateMembership } from '../../store/MembershipReducer';
import { getProfileData } from '../../features/profile/DestinyProfile';
import { updateProfileArmor, updateProfileCharacters } from '../../store/ProfileReducer';
import { useDispatch, useSelector } from 'react-redux';
import { updateManifest } from '../../lib/bungie_api/Manifest';
import { separateArmor } from '../../features/armor-optimization/separatedArmor';
import { generatePermutations } from '../../features/armor-optimization/generatePermutations';
import { filterPermutations } from '../../features/armor-optimization/filterPermutations';
import { DestinyArmor, ArmorByClass, Character, CharacterClass } from '../../types';
import StatsTable from '../../features/armor-optimization/StatsTable';
import { RootState } from '../../store';
import HeaderComponent from '../../components/HeaderComponent';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  paddingTop: '170px',
  width: '100vw',
  boxSizing: 'border-box',
  overflow: 'hidden',
});

const ContentContainer = styled('div')<{ isTransitioning: boolean; direction: 'left' | 'right' }>(
  ({ isTransitioning, direction }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    padding: '10px',
    transition: 'transform 0.3s ease-in-out',
    transform: isTransitioning
      ? `translateX(${direction === 'left' ? '-100vw' : '100vw'})`
      : 'translateX(0)',
  })
);

const LeftPane = styled('div')({
  marginRight: '10px',
});

const RightPane = styled('div')({
  flexGrow: 1,
});

export const Dashboard = () => {
  const dispatch = useDispatch();
  const membership = useSelector((state: RootState) => state.destinyMembership.membership);
  const characters = useSelector((state: RootState) => state.profile.characters);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [separatedArmor, setSeparatedArmor] = useState<ArmorByClass | null>(null);
  const [permutations, setPermutations] = useState<DestinyArmor[][] | null>(null);
  const [filteredPermutations, setFilteredPermutations] = useState<DestinyArmor[][] | null>(null);
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: number }>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  useEffect(() => {
    const updateProfile = async () => {
      await updateManifest();
      const destinyMembership = await getDestinyMembershipId();
      dispatch(updateMembership(destinyMembership));
      const profileData = await getProfileData();
      dispatch(updateProfileArmor(profileData.armor));
      dispatch(updateProfileCharacters(profileData.characters));
      const separated = separateArmor(profileData.armor);
      setSeparatedArmor(separated);
      if (profileData.characters.length > 0) {
        setSelectedCharacter(profileData.characters[0]);
        const initialPermutations = generatePermutations(
          separated[profileData.characters[0].class as CharacterClass]
        );
        setPermutations(initialPermutations);
        setFilteredPermutations(initialPermutations);
      }
    };

    updateProfile().catch(console.error);
  }, [dispatch]);

  useEffect(() => {
    if (permutations) {
      const filtered = filterPermutations(permutations, selectedValues);
      setFilteredPermutations(filtered);
    }
  }, [selectedValues, permutations]);

  const handleThresholdChange = (thresholds: { [key: string]: number }) => {
    setSelectedValues(thresholds);
  };

  const handleCharacterClick = (character: Character) => {
    if (selectedCharacter?.id !== character.id) {
      setDirection(character.class === 'warlock' ? 'left' : 'right');
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedCharacter(character);
        if (separatedArmor) {
          const characterClass: CharacterClass = character.class as CharacterClass;
          const newPermutations = generatePermutations(separatedArmor[characterClass]);
          setPermutations(newPermutations);
          setFilteredPermutations(newPermutations);
        }
        setIsTransitioning(false);
      }, 300);
    }
  };

  return (
    <Container>
      {selectedCharacter?.emblem?.secondarySpecial && (
        <HeaderComponent
          emblemUrl={selectedCharacter.emblem.secondarySpecial}
          overlayUrl={selectedCharacter.emblem.secondaryOverlay || ''}
          displayName={membership.bungieGlobalDisplayName}
          characters={characters}
          selectedCharacter={selectedCharacter}
          onCharacterClick={handleCharacterClick}
        />
      )}
      <ContentContainer isTransitioning={isTransitioning} direction={direction}>
        <LeftPane>
          <NumberBoxes onThresholdChange={handleThresholdChange} />
        </LeftPane>
        <RightPane>
          <h1 style={{ fontSize: '16px' }}>Armour Combinations</h1>
          {filteredPermutations ? (
            <StatsTable permutations={filteredPermutations} />
          ) : (
            <p>Loading...</p>
          )}
        </RightPane>
      </ContentContainer>
    </Container>
  );
};
