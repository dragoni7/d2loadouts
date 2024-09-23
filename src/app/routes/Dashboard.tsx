import FadeIn from '@/components/FadeIn';
import Filters from '@/features/armor-optimization/components/Filters';
import {
  filterFromSharedLoadout,
  filterPermutations,
} from '@/features/armor-optimization/filter-permutations';
import usePermutations from '@/features/armor-optimization/hooks/use-permutations';
import { getModsFromPermutation } from '@/features/armor-optimization/util/permutation-utils';
import { equipSharedMods } from '@/features/loadouts/util/loadout-utils';
import useFragmentStats from '@/features/subclass/hooks/use-fragment-stats';
import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../../components/Footer';
import HeaderComponent from '../../components/HeaderComponent';
import LoadoutCustomization from '../../components/LoadoutCustomization';
import SubclassSelector from '../../features/subclass/components/SubclassSelector';
import ExoticSelector from '../../features/armor-optimization/components/ExoticSelector';
import NumberBoxes from '../../features/armor-optimization/components/NumberBoxes';
import PermutationsList from '../../features/armor-optimization/components/PermutationsList';
import { SharedLoadoutDto } from '../../features/loadouts/types';
import { decodeLoadout } from '../../features/loadouts/util/loadout-encoder';
import { getDestinyMembershipId } from '../../features/membership/bungie-account';
import { getProfileData } from '../../features/profile/profile-data';
import SubclassCustomizationWrapper from '../../features/subclass/components/SubclassCustomizationWrapper';
import { DAMAGE_TYPE, STATS } from '../../lib/bungie_api/constants';
import { updateManifest } from '../../lib/bungie_api/manifest';
import { AppDispatch, RootState } from '../../store';
import {
  resetDashboard,
  updateSelectedCharacter,
  updateSelectedExoticItemHash,
} from '../../store/DashboardReducer';
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
import { updateMembership } from '../../store/MembershipReducer';
import { updateProfileCharacters } from '../../store/ProfileReducer';
import {
  ArmorSlot,
  Character,
  CharacterClass,
  DecodedLoadoutData,
  FilteredPermutation,
  StatName,
  SubclassConfig,
} from '../../types/d2l-types';
import { ManifestExoticArmor } from '../../types/manifest-types';
import background from '/assets/background.png';
import FragmentStats from '@/features/subclass/components/FragmentStats';

const DashboardContent = styled(Grid)(({ theme }) => ({
  backgroundImage: `url(${background})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const LoadingScreen = styled(Box)(({ theme }) => ({
  height: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  backgroundImage: `url(${background})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const characters = useSelector((state: RootState) => state.profile.characters);
  const { selectedValues, selectedExotic, selectedExoticClassCombo, selectedCharacter } =
    useSelector((state: RootState) => state.dashboard);

  const [subclasses, setSubclasses] = useState<
    { [key: number]: SubclassConfig | undefined } | undefined
  >(undefined);
  const [selectedSubclass, setSelectedSubclass] = useState<SubclassConfig | null>(null);
  const [customizingSubclass, setCustomizingSubclass] = useState<SubclassConfig | null>(null);
  const [showLoadoutCustomization, setShowLoadoutCustomization] = useState(false);
  const [showAbilitiesModification, setShowAbilitiesModification] = useState(false);
  const [sharedLoadoutDto, setSharedLoadoutDto] = useState<SharedLoadoutDto | undefined>(undefined);
  const [loadingMessage, setLoadingMessage] = useState<String>('Loading...');

  const permutations = usePermutations();
  const fragmentStatModifications = useFragmentStats();

  const filteredPermutations = useMemo(() => {
    let filtered: FilteredPermutation[] | null = null;

    if (permutations) {
      if (sharedLoadoutDto) {
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

        const sharedLoadoutPermutation = filterFromSharedLoadout(
          decodedLoadoutData,
          permutations,
          fragmentStatModifications
        );
        filtered = sharedLoadoutPermutation === null ? null : [sharedLoadoutPermutation];
      } else {
        filtered = filterPermutations(permutations, selectedValues, fragmentStatModifications);
      }
    }

    return filtered;
  }, [
    permutations,
    selectedValues,
    sharedLoadoutDto,
    fragmentStatModifications,
    selectedExotic,
    selectedExoticClassCombo,
  ]);

  const maxReachableValues = useMemo(() => {
    if (!permutations) return null;

    const maxValues: { [key in StatName]: number } = {
      mobility: 0,
      resilience: 0,
      recovery: 0,
      discipline: 0,
      intellect: 0,
      strength: 0,
    };

    STATS.forEach((stat) => {
      let value = 100;
      let permutationsFound = false;

      while (value >= 0 && !permutationsFound) {
        const testSelectedValues = {
          ...selectedValues,
          [stat]: value,
        };

        const filtered = filterPermutations(
          permutations,
          testSelectedValues,
          fragmentStatModifications
        );

        if (filtered && filtered.length > 0) {
          permutationsFound = true;
          maxValues[stat as StatName] = value;
        } else {
          value -= 10;
        }
      }

      if (!permutationsFound) {
        maxValues[stat as StatName] = 0;
      }
    });

    return maxValues;
  }, [permutations, fragmentStatModifications, selectedValues]);

  useEffect(() => {
    const initSharedSubclass = async (
      sharedLoadoutDto: SharedLoadoutDto,
      selectedCharacter: Character
    ) => {
      const damageType = sharedLoadoutDto.subclass.damageType;
      if (Object.keys(selectedCharacter.subclasses).includes(String(damageType))) {
        setSelectedSubclass(selectedCharacter.subclasses[damageType]!);

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

    const updateData = async () => {
      setLoadingMessage('Loading Destiny Data...');
      await updateManifest();
      const destinyMembership = await getDestinyMembershipId();
      dispatch(updateMembership(destinyMembership));
      setLoadingMessage('Loading Character Data...');
      const profileCharacters = await getProfileData();
      dispatch(updateProfileCharacters(profileCharacters));

      let sharedExotic: ManifestExoticArmor | undefined = undefined;

      let targetCharacterIndex = 0;

      // if navigated here using a share link
      const sharedLoadoutLink = localStorage.getItem('lastShared');

      if (sharedLoadoutLink !== '' && sharedLoadoutLink !== null) {
        setLoadingMessage('Finding Best Loadout From Share Link...');
        const sharedLoadoutDto = decodeLoadout(sharedLoadoutLink!);
        setSharedLoadoutDto(sharedLoadoutDto);

        await equipSharedMods(sharedLoadoutDto, dispatch).catch(console.error);

        targetCharacterIndex = profileCharacters.findIndex(
          (character: Character) => character.class === sharedLoadoutDto.characterClass
        );

        if (targetCharacterIndex !== -1) {
          await initSharedSubclass(sharedLoadoutDto, profileCharacters[targetCharacterIndex]);
        } else {
          console.log('Missing required character class');
        }

        sharedExotic = await db.manifestExoticArmorCollection
          .where('itemHash')
          .equals(Number(sharedLoadoutDto.selectedExoticItemHash))
          .first();

        if (sharedExotic === undefined || sharedExotic?.isOwned === false) {
          console.log('You do not own required exotic');
        } else {
          dispatch(
            updateSelectedExoticItemHash({
              itemHash: sharedExotic.itemHash,
              slot: sharedExotic.slot as ArmorSlot,
            })
          );
        }

        setSharedLoadoutDto(undefined);
      } else {
        const keys = Object.keys(profileCharacters[targetCharacterIndex].subclasses);

        for (let i = 0; i < keys.length; i++) {
          if (
            profileCharacters[targetCharacterIndex].subclasses[Number(keys[i])] !== undefined &&
            profileCharacters[targetCharacterIndex].subclasses[Number(keys[i])]!.damageType !==
              DAMAGE_TYPE.KINETIC
          ) {
            setSelectedSubclass(
              profileCharacters[targetCharacterIndex].subclasses[Number(keys[i])]!
            );
            dispatch(
              updateSubclass({
                subclass: profileCharacters[targetCharacterIndex].subclasses[Number(keys[i])],
              })
            );
            break;
          }
        }
      }

      targetCharacterIndex = targetCharacterIndex === -1 ? 0 : targetCharacterIndex;

      dispatch(updateSelectedCharacter(targetCharacterIndex));

      setSubclasses(profileCharacters[targetCharacterIndex].subclasses);

      dispatch(updateLoadoutCharacter(profileCharacters[targetCharacterIndex]));
    };

    updateData().catch(console.error);
  }, []);

  useEffect(() => {
    if (filteredPermutations && sharedLoadoutDto) {
      openLoadoutCustomization(filteredPermutations[0], false).catch(console.error);
      localStorage.removeItem('lastShared');
    }
  }, [filteredPermutations, sharedLoadoutDto]);

  async function openLoadoutCustomization(
    filteredPermutation: FilteredPermutation,
    clearMods: boolean = true
  ) {
    if (clearMods) dispatch(resetLoadoutArmorMods());

    dispatch(updateLoadoutArmor(filteredPermutation.permutation));

    dispatch(updateRequiredStatMods(await getModsFromPermutation(filteredPermutation.modsArray)));

    setShowLoadoutCustomization(true);
  }

  const handleCharacterClick = (index: number) => {
    if (index === selectedCharacter) return;

    dispatch(resetDashboard());
    dispatch(updateSelectedCharacter(index));
    dispatch(resetLoadout());
    dispatch(updateLoadoutCharacter(characters[index]));
    setSubclasses(characters[index].subclasses);

    const keys = Object.keys(characters[index].subclasses);

    for (let i = 0; i < keys.length; i++) {
      if (
        characters[index].subclasses[Number(keys[i])] !== undefined &&
        characters[index].subclasses[Number(keys[i])]!.damageType !== DAMAGE_TYPE.KINETIC
      ) {
        setSelectedSubclass(characters[index].subclasses[Number(keys[i])]!);

        dispatch(
          updateSubclass({
            subclass: characters[index].subclasses[Number(keys[i])],
          })
        );
        break;
      }
    }
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
          subclass: characters[selectedCharacter].subclasses[subclass.damageType],
        })
      );
    }
  };

  const handleSubclassRightClick = (subclass: SubclassConfig) => {
    setCustomizingSubclass(subclass);
    setShowAbilitiesModification(true);
  };

  return (
    <>
      {showAbilitiesModification && customizingSubclass ? (
        <FadeIn duration={160}>
          <SubclassCustomizationWrapper
            onBackClick={() => setShowAbilitiesModification(false)}
            subclass={customizingSubclass}
            screenshot={customizingSubclass.subclass.screenshot}
          />
        </FadeIn>
      ) : showLoadoutCustomization && sharedLoadoutDto === undefined ? (
        <FadeIn duration={160}>
          <LoadoutCustomization
            onBackClick={() => {
              setShowLoadoutCustomization(false);
            }}
            screenshot={selectedSubclass?.subclass.screenshot || ''}
            subclass={selectedSubclass!}
          />
        </FadeIn>
      ) : sharedLoadoutDto === undefined && selectedSubclass ? (
        <>
          <FadeIn duration={200}>
            <HeaderComponent onCharacterClick={handleCharacterClick} />
          </FadeIn>

          <FadeIn duration={300}>
            <DashboardContent
              container
              md={12}
              justifyContent="space-evenly"
              sx={{ width: '100vw', height: '100vh', overflowY: 'auto', paddingTop: '120px' }}
            >
              <Grid item md={4} sx={{ marginTop: '2%' }}>
                <Stack spacing={1} rowGap={6} marginLeft={1} alignItems="center">
                  <SubclassSelector
                    subclasses={subclasses}
                    selectedSubclass={selectedSubclass}
                    onSubclassSelect={handleSubclassSelect}
                    onSubclassRightClick={handleSubclassRightClick}
                  />
                  <NumberBoxes maxReachableValues={maxReachableValues} />
                </Stack>
              </Grid>
              <Grid
                item
                container
                md={4}
                spacing={3}
                direction="column"
                justifyContent={'start'}
                alignItems={'center'}
                sx={{ marginTop: '1%' }}
              >
                <Grid item>
                  <ExoticSelector />
                </Grid>
                <Grid item height="20%">
                  <Filters />
                </Grid>
                <Grid item alignSelf="flex-start">
                  <FragmentStats />
                </Grid>
              </Grid>
              <Grid item md={4} sx={{ marginTop: '1%' }}>
                {filteredPermutations ? (
                  <PermutationsList
                    permutations={filteredPermutations}
                    onPermutationClick={openLoadoutCustomization}
                  />
                ) : (
                  false
                )}
              </Grid>
              <Footer />
            </DashboardContent>
          </FadeIn>
        </>
      ) : (
        <LoadingScreen>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h5" sx={{ mt: 2, color: 'white' }}>
            {loadingMessage}
          </Typography>
        </LoadingScreen>
      )}
    </>
  );
};

export default Dashboard;
