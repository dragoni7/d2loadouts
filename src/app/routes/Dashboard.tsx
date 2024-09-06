import React, { useEffect, useState, useMemo } from 'react';
import { Box, Container, styled } from '@mui/system';
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
import {
  updateSelectedExoticClassCombo,
  updateSelectedExoticItemHash,
} from '../../store/DashboardReducer';
import StatModifications from '../../features/subclass/StatModifications';
import { Grid, Paper } from '@mui/material';

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  overflowY: 'auto',
  backgroundImage: `url(${greyBackground})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: theme.spacing(3),
  paddingTop: '120px',
}));

const LeftRightColumn = styled(Grid)(({ theme }) => ({
  width: '40%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const MiddleColumn = styled(Grid)(({ theme }) => ({
  width: '20%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const HeaderWrapper = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1100,
});

const NumberBoxesContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginLeft: theme.spacing(25),
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(5px)',
  borderRadius: 0,
  padding: theme.spacing(2),
  alignSelf: 'flex-start',
  width: 'auto',
  maxWidth: '100%',
}));

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const membership = useSelector((state: RootState) => state.destinyMembership.membership);
  const characters = useSelector((state: RootState) => state.profile.profileData.characters);
  const { selectedValues, selectedExotic, selectedExoticClassCombo } = useSelector(
    (state: RootState) => state.dashboard
  );

  const selectedCharacter = useSelector((state: RootState) => state.profile.selectedCharacter);
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
    dispatch(updateSelectedExoticItemHash({ itemHash: null, slot: null }));
    dispatch(updateSelectedExoticClassCombo(null));
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
          <HeaderWrapper>
            <HeaderComponent
              emblemUrl={selectedCharacter?.emblem?.secondarySpecial || ''}
              overlayUrl={selectedCharacter?.emblem?.secondaryOverlay || ''}
              displayName={membership.bungieGlobalDisplayName}
              characters={characters}
              selectedCharacter={selectedCharacter!}
              onCharacterClick={handleCharacterClick}
            />
          </HeaderWrapper>
          <ContentContainer>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ExoticSelector
                  selectedCharacter={selectedCharacter!}
                  selectedExoticItemHash={selectedExotic.itemHash}
                />
              </Grid>
              <LeftRightColumn item xs={12} md={5}>
                <SingleDiamondButton
                  subclasses={subclasses}
                  selectedSubclass={selectedSubclass}
                  onSubclassSelect={handleSubclassSelect}
                  onSubclassRightClick={handleSubclassRightClick}
                />
                <NumberBoxesContainer>
                  <NumberBoxes />
                </NumberBoxesContainer>
              </LeftRightColumn>
              <MiddleColumn item xs={12} md={2}>
                <StatModifications />
              </MiddleColumn>
              <LeftRightColumn item xs={12} md={5}>
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
              </LeftRightColumn>
            </Grid>
          </ContentContainer>
        </>
      )}
    </PageContainer>
  ) : (
    <div>loading...</div>
  );
};

export default Dashboard;
