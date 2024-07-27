import { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import SingleDiamondButton from '../../components/SingleDiamondButton';
import NumberBoxes from '../../features/armor-optimization/NumberBoxes';
import { getDestinyMembershipId } from '../../features/membership/BungieAccount';
import { updateMembership } from '../../store/MembershipReducer';
import { getProfileData } from '../../features/profile/DestinyProfile';
import { updateProfileData } from '../../store/ProfileReducer';
import { useDispatch, useSelector } from 'react-redux';
import { updateManifest } from '../../lib/bungie_api/Manifest';
import { generatePermutations } from '../../features/armor-optimization/generatePermutations';
import { filterPermutations } from '../../features/armor-optimization/filterPermutations';
import { DestinyArmor, ArmorBySlot, Character } from '../../types';
import StatsTable from '../../features/armor-optimization/StatsTable';
import { RootState } from '../../store';
import HeaderComponent from '../../components/HeaderComponent';
import NewComponent from '../../components/ExoticSearch';
import greyBackground from '../../assets/grey.png';

const PageContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
});

const Container = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  width: '100vw',
  boxSizing: 'border-box',
  overflow: 'hidden',
  backgroundImage: `url(${greyBackground})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  marginTop: '130px',
});

const TopPane = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  padding: '10px',
  boxSizing: 'border-box',
  marginBottom: '20px',
  backgroundColor: 'transparent',
  border: '2px solid white',
});

const BottomPane = styled('div')({
  display: 'flex',
  width: '100%',
  padding: '10px',
  boxSizing: 'border-box',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  border: '2px solid white',
});

const LeftPane = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '600px',
  padding: '10px',
  boxSizing: 'border-box',
  marginTop: '-80px',
  margin: '0 auto',
});

const RightPane = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '600px',
  padding: '10px',
  boxSizing: 'border-box',
  margin: '0 auto',
  border: '2px solid white',
});

const DiamondButtonWrapper = styled('div')({
  marginTop: '50px',
  marginBottom: '80px',
  marginRight: '40px',
  alignSelf: 'flex-end',
});

const NumberBoxesWrapper = styled('div')({
  marginBottom: '20px',
});

const NewComponentWrapper = styled('div')({
  marginBottom: '20px',
});

export const Dashboard = () => {
  const dispatch = useDispatch();
  const membership = useSelector((state: RootState) => state.destinyMembership.membership);
  const characters = useSelector((state: RootState) => state.profile.profileData.characters);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
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
      dispatch(updateProfileData(profileData));

      if (profileData.characters.length > 0) {
        setSelectedCharacter(profileData.characters[0]);
        const initialPermutations = generatePermutations(profileData.characters[0].armor);
        setPermutations(initialPermutations);
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
    if (selectedCharacter && selectedCharacter?.id !== character.id) {
      setDirection(character.class === 'warlock' ? 'left' : 'right');
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedCharacter(character);
        const newPermutations = generatePermutations(selectedCharacter.armor);
        setPermutations(newPermutations);
        setFilteredPermutations(newPermutations);
        setIsTransitioning(false);
      }, 300);
    }
  };

  return (
    <PageContainer>
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
      <Container>
        <NewComponentWrapper>
          <NewComponent />
        </NewComponentWrapper>
        <BottomPane>
          <LeftPane>
            <DiamondButtonWrapper>
              <SingleDiamondButton />
            </DiamondButtonWrapper>
            <NumberBoxesWrapper>
              <NumberBoxes onThresholdChange={handleThresholdChange} />
            </NumberBoxesWrapper>
          </LeftPane>
          <RightPane>
            <h1 style={{ fontSize: '16px' }}>Armour Combinations</h1>
            {filteredPermutations ? (
              <StatsTable permutations={filteredPermutations} />
            ) : (
              <p>Loading...</p>
            )}
          </RightPane>
        </BottomPane>
      </Container>
    </PageContainer>
  );
};
