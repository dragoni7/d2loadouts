import React, { useEffect, useState, useMemo } from 'react';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { updateSelectedExoticItemHash, updateSelectedValues } from '../../store/DashboardReducer';
import { generatePermutations } from '../../features/armor-optimization/generate-permutations';
import { filterPermutations } from '../../features/armor-optimization/filter-permutations';
import SingleDiamondButton from '../../components/SingleDiamondButton';
import NumberBoxes from '../../features/armor-optimization/NumberBoxes';
import { getDestinyMembershipId } from '../../features/membership/bungie-account';
import { updateMembership } from '../../store/MembershipReducer';
import { getProfileData } from '../../features/profile/destiny-profile';
import { updateProfileData } from '../../store/ProfileReducer';
import { DestinyArmor, Character, FilteredPermutation } from '../../types/d2l-types';
import StatsTable from '../../features/armor-optimization/StatsTable';
import HeaderComponent from '../../components/HeaderComponent';
import ExoticSearch from '../../components/ExoticSearch';
import greyBackground from '../../assets/grey.png';
import { db } from '../../store/db';
import { resetLoadout, updateLoadoutCharacter, updateSubclass } from '../../store/LoadoutReducer';
import { ManifestSubclass } from '../../types/manifest-types';
import SubclassCustomizationWrapper from '../../features/subclass/SubclassCustomizationWrapper';
import { updateManifest } from '../../lib/bungie_api/manifest';
import LoadoutCustomization from '../../components/LoadoutCustomization';

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
  const dispatch = useDispatch<AppDispatch>();
  const membership = useSelector((state: RootState) => state.destinyMembership.membership);
  const characters = useSelector((state: RootState) => state.profile.profileData.characters);
  const { selectedValues, selectedExoticItemHash } = useSelector(
    (state: RootState) => state.dashboard
  );

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [subclasses, setSubclasses] = useState<ManifestSubclass[]>([]);
  const [selectedSubclass, setSelectedSubclass] = useState<ManifestSubclass | null>(null);
  const [customizingSubclass, setCustomizingSubclass] = useState<ManifestSubclass | null>(null);
  const [lastNonPrismaticSubclass, setLastNonPrismaticSubclass] = useState<ManifestSubclass | null>(
    null
  );
  const [showArmorCustomization, setShowArmorCustomization] = useState(false);
  const [showAbilitiesModification, setShowAbilitiesModification] = useState(false);

  useEffect(() => {
    const updateProfile = async () => {
      await updateManifest();
      const destinyMembership = await getDestinyMembershipId();
      dispatch(updateMembership(destinyMembership));
      const profileData = await getProfileData();
      dispatch(updateProfileData(profileData));

      if (profileData.characters.length > 0) {
        setSelectedCharacter(profileData.characters[0]);
      }
    };

    updateProfile().catch(console.error);
  }, [dispatch]);

  useEffect(() => {
    if (selectedCharacter) {
      dispatch(resetLoadout());
      dispatch(updateLoadoutCharacter(selectedCharacter));
      fetchSubclasses(selectedCharacter).then((subclassesData) => {
        setSubclasses(subclassesData);
        if (subclassesData.length > 0) {
          setSelectedSubclass(subclassesData[0]);
          const defaultSubclass =
            subclassesData.find((subclass) => !subclass.name.includes('Prismatic')) ||
            subclassesData[0];
          setLastNonPrismaticSubclass(defaultSubclass);
        }
      });
    }
  }, [selectedCharacter, dispatch]);

  const permutations = useMemo(() => {
    if (selectedCharacter && selectedExoticItemHash !== undefined) {
      return generatePermutations(selectedCharacter.armor, selectedExoticItemHash);
    }
    return null;
  }, [selectedCharacter, selectedExoticItemHash]);

  const filteredPermutations = useMemo(() => {
    if (permutations && selectedValues) {
      setIsLoading(true);
      const filtered = filterPermutations(permutations, selectedValues);
      setIsLoading(false);
      return filtered;
    }
    return null;
  }, [permutations, selectedValues]);

  const handleCharacterClick = (character: Character) => {
    if (selectedCharacter && selectedCharacter?.id !== character.id) {
      setSelectedCharacter(character);
    }
  };

  const handleSubclassSelect = (subclass: ManifestSubclass) => {
    setSelectedSubclass(subclass);

    if (selectedCharacter && subclass.damageType in selectedCharacter.subclasses) {
      dispatch(
        updateSubclass({
          subclass: selectedCharacter.subclasses[subclass.damageType]?.subclass,
        })
      );
    }
    if (!subclass.name.includes('Prismatic')) {
      setLastNonPrismaticSubclass(subclass);
    }
  };

  const handleSubclassRightClick = (subclass: ManifestSubclass) => {
    setCustomizingSubclass(subclass);
    setShowAbilitiesModification(true);
  };

  const handleBackClick = () => {
    setShowAbilitiesModification(false);
  };

  const handlePermutationClick = () => {
    setShowArmorCustomization(true);
  };

  const handleLoadoutCustomizationBackClick = () => {
    setShowArmorCustomization(false);
  };

  const fetchSubclasses = async (character: Character): Promise<ManifestSubclass[]> => {
    const data = await db.manifestSubclass
      .where('class')
      .equalsIgnoreCase(character.class)
      .toArray();
    return data.map((item) => ({
      ...item,
      itemHash: item.itemHash,
    }));
  };

  return (
    <PageContainer>
      {showAbilitiesModification && customizingSubclass ? (
        <SubclassCustomizationWrapper
          onBackClick={handleBackClick}
          subclass={customizingSubclass}
          screenshot={customizingSubclass.screenshot}
        />
      ) : showArmorCustomization ? (
        <LoadoutCustomization
          onBackClick={handleLoadoutCustomizationBackClick}
          screenshot={selectedSubclass?.screenshot || ''}
          subclass={selectedSubclass!}
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
                selectedExoticItemHash={selectedExoticItemHash}
              />
            </NewComponentWrapper>
            <BottomPane>
              <LeftPane>
                <DiamondButtonWrapper>
                  <SingleDiamondButton
                    subclasses={subclasses}
                    selectedSubclass={selectedSubclass}
                    onSubclassSelect={handleSubclassSelect}
                    onSubclassRightClick={handleSubclassRightClick}
                  />
                </DiamondButtonWrapper>
                <NumberBoxesWrapper>
                  <NumberBoxes />
                </NumberBoxesWrapper>
              </LeftPane>
              <RightPane>
                <h1 style={{ fontSize: '16px' }}>Armour Combinations</h1>
                {isLoading ? (
                  <p>Loading...</p>
                ) : filteredPermutations ? (
                  <StatsTable
                    permutations={filteredPermutations}
                    onPermutationClick={handlePermutationClick}
                  />
                ) : (
                  <p>Loading....</p>
                )}
              </RightPane>
            </BottomPane>
          </Container>
        </>
      )}
    </PageContainer>
  );
};

export default Dashboard;
