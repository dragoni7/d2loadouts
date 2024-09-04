import React, { useEffect, useState, useMemo } from 'react';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { generatePermutations } from '../../features/armor-optimization/generate-permutations';
import { filterPermutations } from '../../features/armor-optimization/filter-permutations';
import SingleDiamondButton from '../../components/SingleDiamondButton';
import NumberBoxes from '../../features/armor-optimization/NumberBoxes';
import { getDestinyMembershipId } from '../../features/membership/bungie-account';
import { updateMembership } from '../../store/MembershipReducer';
import { getProfileData } from '../../features/profile/destiny-profile';
import { updateProfileData, updateSelectedCharacter } from '../../store/ProfileReducer';
import { Character, FilteredPermutation, SubclassConfig } from '../../types/d2l-types';
import StatsTable from '../../features/armor-optimization/StatsTable';
import HeaderComponent from '../../components/HeaderComponent';
import { db } from '../../store/db';
import { resetLoadout, updateLoadoutCharacter, updateSubclass } from '../../store/LoadoutReducer';
import SubclassCustomizationWrapper from '../../features/subclass/SubclassCustomizationWrapper';
import { updateManifest } from '../../lib/bungie_api/manifest';
import LoadoutCustomization from '../../components/LoadoutCustomization';
import greyBackground from '../../assets/grey.png';
import ExoticSelector from '../../features/armor-optimization/ExoticSelector';
import { DAMAGE_TYPE } from '../../lib/bungie_api/constants';

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
  const { selectedValues, selectedExotic, selectedExoticClassCombo } = useSelector(
    (state: RootState) => state.dashboard
  );

  const [selectedCharacter, setSelectedCharacter] = useState<Character | undefined>(undefined);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [generatingPermutations, setGeneratingPermutations] = useState(false);
  const [subclasses, setSubclasses] = useState<
    { [key: number]: SubclassConfig | undefined } | undefined
  >(undefined);
  const [selectedSubclass, setSelectedSubclass] = useState<SubclassConfig | null>(null);
  const [customizingSubclass, setCustomizingSubclass] = useState<SubclassConfig | null>(null);
  const [lastNonPrismaticSubclass, setLastNonPrismaticSubclass] = useState<SubclassConfig | null>(
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
        dispatch(updateSelectedCharacter(profileData.characters[0]));
      }
    };

    updateProfile().catch(console.error);

    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (selectedCharacter) {
      dispatch(resetLoadout());
      dispatch(updateLoadoutCharacter(selectedCharacter));

      setSubclasses(selectedCharacter.subclasses);

      const keys = Object.keys(selectedCharacter.subclasses);

      for (let i = 0; i < keys.length; i++) {
        if (
          selectedCharacter.subclasses[Number(keys[i])] !== undefined &&
          selectedCharacter.subclasses[Number(keys[i])]!.damageType !== DAMAGE_TYPE.KINETIC
        ) {
          setSelectedSubclass(selectedCharacter.subclasses[Number(keys[i])]!);
          setLastNonPrismaticSubclass(selectedCharacter.subclasses[Number(keys[i])]!);
          dispatch(
            updateSubclass({
              subclass: selectedCharacter.subclasses[Number(keys[i])],
            })
          );
          break;
        }
      }
    }
  }, [selectedCharacter, dispatch]);

  const permutations = useMemo(() => {
    if (selectedCharacter && selectedExotic !== undefined) {
      if (selectedExoticClassCombo)
        return generatePermutations(
          selectedCharacter.armor,
          selectedExotic,
          selectedExoticClassCombo
        );

      return generatePermutations(selectedCharacter.armor, selectedExotic);
    }
    return null;
  }, [selectedCharacter, selectedExotic, selectedExoticClassCombo]);

  const filteredPermutations = useMemo(() => {
    if (permutations && selectedValues) {
      setGeneratingPermutations(true);
      const filtered = filterPermutations(permutations, selectedValues);
      setGeneratingPermutations(false);
      return filtered;
    }
    return null;
  }, [permutations, selectedValues]);

  const handleCharacterClick = (character: Character) => {
    dispatch(updateSelectedCharacter(character));
  };

  const handleSubclassSelect = (subclass: SubclassConfig) => {
    setSelectedSubclass(subclass);

    dispatch(
      updateSubclass({
        subclass: subclass,
      })
    );

    if (selectedCharacter) {
      dispatch(
        updateSubclass({
          subclass: selectedCharacter.subclasses[subclass.damageType],
        })
      );
    }
    if (subclass.damageType !== DAMAGE_TYPE.KINETIC) {
      setLastNonPrismaticSubclass(subclass);
    }
  };

  const handleSubclassRightClick = (subclass: SubclassConfig) => {
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

  return !dataLoading ? (
    <PageContainer>
      {showAbilitiesModification && customizingSubclass ? (
        <SubclassCustomizationWrapper
          onBackClick={handleBackClick}
          subclass={customizingSubclass}
          screenshot={customizingSubclass.subclass.screenshot}
        />
      ) : showArmorCustomization ? (
        <LoadoutCustomization
          onBackClick={handleLoadoutCustomizationBackClick}
          screenshot={selectedSubclass?.subclass.screenshot || ''}
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
              <ExoticSelector
                selectedCharacter={selectedCharacter}
                selectedExoticItemHash={selectedExotic.itemHash}
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
                {generatingPermutations ? (
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
  ) : (
    <div>loading...</div>
  );
};

export default Dashboard;
