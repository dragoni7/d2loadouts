import React, { useEffect, useState, useMemo } from 'react';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { generatePermutations } from '../../features/armor-optimization/generate-permutations';
import {
  filterFromSharedLoadout,
  filterPermutations,
} from '../../features/armor-optimization/filter-permutations';
import SingleDiamondButton from '../../components/SingleDiamondButton';
import NumberBoxes from '../../features/armor-optimization/NumberBoxes';
import { getDestinyMembershipId } from '../../features/membership/bungie-account';
import { updateMembership } from '../../store/MembershipReducer';
import { getProfileData } from '../../features/profile/destiny-profile';
import { updateProfileData, updateSelectedCharacter } from '../../store/ProfileReducer';
import {
  armor,
  Character,
  CharacterClass,
  DecodedLoadoutData,
  DestinyArmor,
  FilteredPermutation,
  StatName,
  SubclassConfig,
} from '../../types/d2l-types';
import StatsTable from '../../features/armor-optimization/StatsTable';
import HeaderComponent from '../../components/HeaderComponent';
import { db } from '../../store/db';
import {
  resetLoadout,
  resetLoadoutArmorMods,
  updateLoadoutArmor,
  updateLoadoutCharacter,
  updateRequiredStatMods,
  updateSubclass,
  updateSubclassMods,
} from '../../store/LoadoutReducer';
import SubclassCustomizationWrapper from '../../features/subclass/SubclassCustomizationWrapper';
import { updateManifest } from '../../lib/bungie_api/manifest';
import LoadoutCustomization from '../../components/LoadoutCustomization';
import greyBackground from '../../assets/grey.png';
import ExoticSelector from '../../features/armor-optimization/ExoticSelector';
import { DAMAGE_TYPE } from '../../lib/bungie_api/constants';
import { decodeLoadout } from '../../features/loadouts/util/loadout-encoder';
import { updateSelectedExoticItemHash } from '../../store/DashboardReducer';
import { ManifestArmorStatMod, ManifestExoticArmor } from '../../types/manifest-types';
import { SharedLoadoutDto } from '../../features/loadouts/types';

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

  const selectedCharacter = useSelector((state: RootState) => state.profile.selectedCharacter);
  const [generatingPermutations, setGeneratingPermutations] = useState(false);
  const [subclasses, setSubclasses] = useState<
    { [key: number]: SubclassConfig | undefined } | undefined
  >(undefined);
  const [selectedSubclass, setSelectedSubclass] = useState<SubclassConfig | null>(null);
  const [customizingSubclass, setCustomizingSubclass] = useState<SubclassConfig | null>(null);
  const [lastNonPrismaticSubclass, setLastNonPrismaticSubclass] = useState<SubclassConfig | null>(
    null
  );
  const [showLoadoutCustomization, setShowLoadoutCustomization] = useState(false);
  const [showAbilitiesModification, setShowAbilitiesModification] = useState(false);
  const [sharedLoadoutDto, setSharedLoadoutDto] = useState<SharedLoadoutDto | undefined>(undefined);

  useEffect(() => {
    const updateProfile = async () => {
      await updateManifest();
      const destinyMembership = await getDestinyMembershipId();
      dispatch(updateMembership(destinyMembership));
      const profileData = await getProfileData();
      dispatch(updateProfileData(profileData));

      let targetCharacter = profileData.characters[0];
      let sharedExotic: ManifestExoticArmor | undefined = undefined;

      // if navigated here using a share link
      const sharedLoadoutLink = localStorage.getItem('lastShared');

      if (sharedLoadoutLink !== '' && sharedLoadoutLink !== null) {
        const sharedLoadoutDto = decodeLoadout(sharedLoadoutLink!);
        setSharedLoadoutDto(sharedLoadoutDto);

        const sharedClassCharacter = profileData.characters.find(
          (character: Character) => character.class === sharedLoadoutDto.characterClass
        );

        if (sharedClassCharacter) {
          targetCharacter = sharedClassCharacter;
        } else {
          console.log('Missing required character class');
        }

        sharedExotic = await db.manifestExoticArmorCollection
          .where('itemHash')
          .equals(Number(sharedLoadoutDto.selectedExoticItemHash))
          .first();

        if (sharedExotic === undefined || sharedExotic?.isOwned === false) {
          console.log('You do not own required exotic');
        }
      }

      dispatch(updateSelectedCharacter(targetCharacter));

      if (sharedExotic)
        dispatch(
          updateSelectedExoticItemHash({
            itemHash: sharedExotic.itemHash,
            slot: sharedExotic.slot as armor,
          })
        );
    };

    updateProfile().catch(console.error);
  }, []);

  useEffect(() => {
    const initSharedSubclass = async (
      sharedLoadoutDto: SharedLoadoutDto,
      selectedCharacter: Character
    ) => {
      const damageType = sharedLoadoutDto.subclass.damageType;
      if (Object.keys(selectedCharacter.subclasses).includes(String(damageType))) {
        setSelectedSubclass(selectedCharacter.subclasses[damageType]!);
        setLastNonPrismaticSubclass(selectedCharacter.subclasses[damageType]!);

        // set subclass abilities
        dispatch(
          updateSubclass({
            subclass: selectedCharacter.subclasses[damageType],
          })
        );
        dispatch(
          updateSubclassMods({
            category: 'SUPERS',
            mods: await db.manifestSubclassModDef
              .where('itemHash')
              .equals(sharedLoadoutDto.subclass.super)
              .toArray(),
          })
        );
        dispatch(
          updateSubclassMods({
            category: 'MOVMENT_ABILITIES',
            mods: await db.manifestSubclassModDef
              .where('itemHash')
              .equals(sharedLoadoutDto.subclass.movementAbility)
              .toArray(),
          })
        );
        dispatch(
          updateSubclassMods({
            category: 'MELEE_ABILITY',
            mods: await db.manifestSubclassModDef
              .where('itemHash')
              .equals(sharedLoadoutDto.subclass.meleeAbility)
              .toArray(),
          })
        );
        dispatch(
          updateSubclassMods({
            category: 'CLASS_ABILITIES',
            mods: await db.manifestSubclassModDef
              .where('itemHash')
              .equals(sharedLoadoutDto.subclass.classAbility)
              .toArray(),
          })
        );
        dispatch(
          updateSubclassMods({
            category: 'GRENADES',
            mods: await db.manifestSubclassModDef
              .where('itemHash')
              .equals(sharedLoadoutDto.subclass.grenade)
              .toArray(),
          })
        );
        dispatch(
          updateSubclassMods({
            category: 'ASPECTS',
            mods: await db.manifestSubclassAspectsDef
              .where('itemHash')
              .anyOf(sharedLoadoutDto.subclass.aspects)
              .toArray(),
          })
        );
        dispatch(
          updateSubclassMods({
            category: 'FRAGMENTS',
            mods: await db.manifestSubclassFragmentsDef
              .where('itemHash')
              .anyOf(sharedLoadoutDto.subclass.fragments)
              .toArray(),
          })
        );
      }
    };

    if (selectedCharacter) {
      dispatch(resetLoadout());
      dispatch(updateLoadoutCharacter(selectedCharacter));

      setSubclasses(selectedCharacter.subclasses);

      if (sharedLoadoutDto) {
        initSharedSubclass(sharedLoadoutDto, selectedCharacter).catch(console.error);
      } else {
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
    }
  }, [selectedCharacter, sharedLoadoutDto, dispatch]);

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
    let filtered: FilteredPermutation[] | null = null;

    if (permutations && sharedLoadoutDto) {
      const decodedLoadoutData: DecodedLoadoutData = {
        selectedExoticItemHash: sharedLoadoutDto.selectedExoticItemHash,
        selectedValues: {
          mobility: sharedLoadoutDto.selectedValues.mobility || 0,
          resilience: sharedLoadoutDto.selectedValues.resilience || 0,
          recovery: sharedLoadoutDto.selectedValues.recovery || 0,
          discipline: sharedLoadoutDto.selectedValues.discipline || 0,
          intellect: sharedLoadoutDto.selectedValues.intellect || 0,
          strength: sharedLoadoutDto.selectedValues.strength || 0,
        },
        statPriority: sharedLoadoutDto.statPriority as StatName[],
        characterClass: sharedLoadoutDto.characterClass as CharacterClass,
      };
      setGeneratingPermutations(true);
      const sharedLoadoutPermutation = filterFromSharedLoadout(decodedLoadoutData, permutations);
      filtered = sharedLoadoutPermutation === null ? null : [sharedLoadoutPermutation];
    } else if (permutations && selectedValues) {
      setGeneratingPermutations(true);
      filtered = filterPermutations(permutations, selectedValues);
    }

    setGeneratingPermutations(false);

    return filtered;
  }, [permutations, selectedValues, sharedLoadoutDto]);

  useEffect(() => {
    if (filteredPermutations && sharedLoadoutDto) {
      openLoadoutCustomization(filteredPermutations[0]).catch(console.error);
      localStorage.removeItem('lastShared');
    }
  }, [filteredPermutations, sharedLoadoutDto]);

  async function openLoadoutCustomization(filteredPermutation: FilteredPermutation) {
    dispatch(resetLoadoutArmorMods());
    dispatch(updateLoadoutArmor(filteredPermutation.permutation));
    let requiredMods: { mod: ManifestArmorStatMod; equipped: boolean }[] = [];

    for (const [stat, costs] of Object.entries(filteredPermutation.modsArray)) {
      for (const cost of costs) {
        const mod = await db.manifestArmorStatModDef
          .where(stat + 'Mod')
          .equals(cost)
          .first();
        if (mod !== undefined) requiredMods.push({ mod: mod, equipped: false });
      }
    }

    dispatch(updateRequiredStatMods(requiredMods));
    setShowLoadoutCustomization(true);
  }

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

  return (
    <PageContainer>
      {showAbilitiesModification && customizingSubclass ? (
        <SubclassCustomizationWrapper
          onBackClick={() => setShowAbilitiesModification(false)}
          subclass={customizingSubclass}
          screenshot={customizingSubclass.subclass.screenshot}
        />
      ) : showLoadoutCustomization ? (
        <LoadoutCustomization
          onBackClick={() => {
            setShowLoadoutCustomization(false);
            setSharedLoadoutDto(undefined);
          }}
          screenshot={selectedSubclass?.subclass.screenshot || ''}
          subclass={selectedSubclass!}
        />
      ) : sharedLoadoutDto === undefined && selectedCharacter && selectedSubclass ? (
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
                selectedCharacter={selectedCharacter!}
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
                    onPermutationClick={openLoadoutCustomization}
                  />
                ) : (
                  <p>Loading....</p>
                )}
              </RightPane>
            </BottomPane>
          </Container>
        </>
      ) : (
        <div>loading...</div>
      )}
    </PageContainer>
  );
};

export default Dashboard;
