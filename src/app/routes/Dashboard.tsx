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
import { DestinyArmor, Character, FilteredPermutation, ManifestSubclass } from '../../types';
import StatsTable from '../../features/armor-optimization/StatsTable';
import { RootState } from '../../store';
import HeaderComponent from '../../components/HeaderComponent';
import ExoticSearch from '../../components/ExoticSearch';
import CustomizationPanel from '../../components/CustomizationPanel';
import greyBackground from '../../assets/grey.png';
import { db } from '../../store/db';

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
  overflowY: 'auto',
  backgroundImage: `url(${greyBackground})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  marginTop: '110px',
  '::-webkit-scrollbar': {
    width: '10px',
  },
  '::-webkit-scrollbar-track': {
    background: 'none',
  },
  '::-webkit-scrollbar-thumb': {
    background: 'grey',
    borderRadius: '0',
  },
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
  maxWidth: '800px',
  padding: '5px',
  boxSizing: 'border-box',
  margin: '0 auto',
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

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const membership = useSelector((state: RootState) => state.destinyMembership.membership);
  const characters = useSelector((state: RootState) => state.profile.profileData.characters);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedExoticItemHash, setSelectedExoticItemHash] = useState<string | null>(null);
  const [permutations, setPermutations] = useState<DestinyArmor[][] | null>(null);
  const [filteredPermutations, setFilteredPermutations] = useState<FilteredPermutation[] | null>(
    null
  );
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: number }>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [subclasses, setSubclasses] = useState<ManifestSubclass[]>([]);
  const [selectedSubclass, setSelectedSubclass] = useState<ManifestSubclass | null>(null);
  const [showCustomizationPanel, setShowCustomizationPanel] = useState(false);
  const [customizingSubclass, setCustomizingSubclass] = useState<ManifestSubclass | null>(null);

  useEffect(() => {
    const updateProfile = async () => {
      await updateManifest();
      const destinyMembership = await getDestinyMembershipId();
      dispatch(updateMembership(destinyMembership));
      const profileData = await getProfileData();
      dispatch(updateProfileData(profileData));

      if (profileData.characters.length > 0) {
        setSelectedCharacter(profileData.characters[0]);
        const initialPermutations = generatePermutations(
          profileData.characters[0].armor,
          selectedExoticItemHash
        );
        setPermutations(initialPermutations);
      }
    };

    updateProfile().catch(console.error);
  }, [dispatch]);

  useEffect(() => {
    if (selectedCharacter) {
      const newPermutations = generatePermutations(selectedCharacter.armor, selectedExoticItemHash);
      setPermutations(newPermutations);
      fetchSubclasses(selectedCharacter).then((subclassesData) => {
        setSubclasses(subclassesData);
        if (subclassesData.length > 0) {
          setSelectedSubclass(subclassesData[0]);
        }
      });
    }
  }, [selectedCharacter, selectedExoticItemHash]);

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
        const newPermutations = generatePermutations(character.armor, selectedExoticItemHash);
        setPermutations(newPermutations);
        const filtered = filterPermutations(newPermutations, selectedValues);
        setFilteredPermutations(filtered);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleSubclassSelect = (subclass: ManifestSubclass) => {
    setSelectedSubclass(subclass);
  };

  const handleSubclassRightClick = (subclass: ManifestSubclass) => {
    setCustomizingSubclass(subclass);
    setShowCustomizationPanel(true);
  };

  const handleBackClick = () => {
    setShowCustomizationPanel(false);
  };

  const fetchSubclasses = async (character: Character): Promise<ManifestSubclass[]> => {
    const data = await db.manifestSubclass
      .where('class')
      .equalsIgnoreCase(character.class)
      .toArray();
    return data.map((item) => ({
      ...item,
      itemHash: item.itemHash.toString(),
    }));
  };

  return (
    <PageContainer>
      {showCustomizationPanel && customizingSubclass ? (
        <CustomizationPanel
          screenshot={customizingSubclass.screenshot}
          onBackClick={handleBackClick}
        />
      ) : (
        <>
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
              <ExoticSearch
                selectedCharacter={selectedCharacter}
                onExoticSelect={setSelectedExoticItemHash}
              />
            </NewComponentWrapper>
            <BottomPane>
              <LeftPane>
                <DiamondButtonWrapper>
                  <SingleDiamondButton
                    subclasses={subclasses}
                    selectedSubclass={selectedSubclass}
                    onSubclassSelect={handleSubclassSelect}
                    onSubclassRightClick={handleSubclassRightClick} // Add this prop to handle right-click
                  />
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
        </>
      )}
    </PageContainer>
  );
};
