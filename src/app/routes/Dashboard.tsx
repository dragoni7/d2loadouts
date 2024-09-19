import React, { useEffect, useState, useMemo } from 'react';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { generatePermutations } from '../../features/armor-optimization/generate-permutations';
import {
  filterFromSharedLoadout,
  filterPermutations,
} from '../../features/armor-optimization/filter-permutations';
import SingleDiamondButton from '../../components/SubclassSelector';
import NumberBoxes from '../../features/armor-optimization/components/NumberBoxes';
import { getDestinyMembershipId } from '../../features/membership/bungie-account';
import { updateMembership } from '../../store/MembershipReducer';
import {
  ArmorSlot,
  Character,
  CharacterClass,
  DecodedLoadoutData,
  FilteredPermutation,
  FragmentStatModifications,
  StatModifiers,
  StatName,
  SubclassConfig,
} from '../../types/d2l-types';
import PermutationsList from '../../features/armor-optimization/components/PermutationsList';
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
import SubclassCustomizationWrapper from '../../features/subclass/components/SubclassCustomizationWrapper';
import { updateManifest } from '../../lib/bungie_api/manifest';
import LoadoutCustomization from '../../components/LoadoutCustomization';
import background from '/assets/background.png';
import ExoticSelector from '../../features/armor-optimization/components/ExoticSelector';
import { DAMAGE_TYPE } from '../../lib/bungie_api/constants';
import { decodeLoadout } from '../../features/loadouts/util/loadout-encoder';
import {
  resetDashboard,
  updateSelectedCharacter,
  updateSelectedExoticItemHash,
} from '../../store/DashboardReducer';
import { Grid } from '@mui/material';
import { ManifestArmorStatMod, ManifestExoticArmor } from '../../types/manifest-types';
import { SharedLoadoutDto } from '../../features/loadouts/types';
import { updateProfileCharacters } from '../../store/ProfileReducer';
import { getProfileData } from '../../util/profile-characters';
import useArtificeMods from '../../hooks/use-artifice-mods';
import useStatMods from '../../hooks/use-stat-mods';
import StatModifications from '../../features/subclass/components/StatModifications';
import Footer from '../../components/Footer';

const DashboardContent = styled(Grid)(({ theme }) => ({
  backgroundImage: `url(${background})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const membership = useSelector((state: RootState) => state.destinyMembership.membership);
  const characters = useSelector((state: RootState) => state.profile.characters);
  const { selectedValues, selectedExotic, selectedExoticClassCombo } = useSelector(
    (state: RootState) => state.dashboard
  );

  const selectedCharacterIndex = useSelector(
    (state: RootState) => state.dashboard.selectedCharacter
  );
  const fragments = useSelector(
    (state: RootState) => state.loadoutConfig.loadout.subclassConfig.fragments
  );
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

  const statMods = useStatMods();
  const artificeMods = useArtificeMods();

  const fragmentStatModifications = useMemo(() => {
    return fragments.reduce(
      (acc, fragment) => {
        if (fragment.itemHash !== 0) {
          acc.mobility += fragment.mobilityMod;
          acc.resilience += fragment.resilienceMod;
          acc.recovery += fragment.recoveryMod;
          acc.discipline += fragment.disciplineMod;
          acc.intellect += fragment.intellectMod;
          acc.strength += fragment.strengthMod;
        }
        return acc;
      },
      {
        mobility: 0,
        resilience: 0,
        recovery: 0,
        discipline: 0,
        intellect: 0,
        strength: 0,
      } as FragmentStatModifications
    );
  }, [fragments]);

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

    const updateData = async () => {
      await updateManifest();
      const destinyMembership = await getDestinyMembershipId();
      dispatch(updateMembership(destinyMembership));
      const profileCharacters = await getProfileData();
      dispatch(updateProfileCharacters(profileCharacters));

      let sharedExotic: ManifestExoticArmor | undefined = undefined;

      let targetCharacterIndex = 0;

      // if navigated here using a share link
      const sharedLoadoutLink = localStorage.getItem('lastShared');

      if (sharedLoadoutLink !== '' && sharedLoadoutLink !== null) {
        const sharedLoadoutDto = decodeLoadout(sharedLoadoutLink!);
        setSharedLoadoutDto(sharedLoadoutDto);

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
            setLastNonPrismaticSubclass(
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

  const permutations = useMemo(() => {
    if (characters[selectedCharacterIndex] && selectedExotic !== undefined) {
      if (selectedExoticClassCombo)
        return generatePermutations(
          characters[selectedCharacterIndex].armor,
          selectedExotic,
          selectedExoticClassCombo,
          fragmentStatModifications
        );

      return generatePermutations(
        characters[selectedCharacterIndex].armor,
        selectedExotic,
        undefined,
        fragmentStatModifications
      );
    }
    return null;
  }, [
    selectedCharacterIndex,
    characters,
    selectedExotic,
    selectedExoticClassCombo,
    fragmentStatModifications,
  ]);

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

      const sharedLoadoutPermutation = filterFromSharedLoadout(
        decodedLoadoutData,
        permutations,
        fragmentStatModifications
      );
      filtered = sharedLoadoutPermutation === null ? null : [sharedLoadoutPermutation];
    } else if (permutations && selectedValues) {
      filtered = filterPermutations(permutations, selectedValues, fragmentStatModifications);
    }

    setGeneratingPermutations(false);

    return filtered;
  }, [permutations, selectedValues, sharedLoadoutDto, fragmentStatModifications]);

  useEffect(() => {
    if (filteredPermutations && sharedLoadoutDto) {
      openLoadoutCustomization(filteredPermutations[0]);
      localStorage.removeItem('lastShared');
    }
  }, [filteredPermutations, sharedLoadoutDto]);

  function openLoadoutCustomization(filteredPermutation: FilteredPermutation) {
    dispatch(resetLoadoutArmorMods());
    dispatch(updateLoadoutArmor(filteredPermutation.permutation));
    const allStatMods = statMods.concat(artificeMods);
    let requiredMods: { mod: ManifestArmorStatMod; equipped: boolean }[] = [];

    for (const [stat, costs] of Object.entries(filteredPermutation.modsArray)) {
      for (const cost of costs) {
        const matchedStatMod = allStatMods.find(
          (mod) => mod[(stat + 'Mod') as StatModifiers] === cost
        );
        if (matchedStatMod !== undefined) {
          requiredMods.push({
            mod: {
              energyCost: matchedStatMod.energyCost,
              collectibleHash: matchedStatMod.collectibleHash,
              mobilityMod: matchedStatMod.mobilityMod,
              resilienceMod: matchedStatMod.resilienceMod,
              recoveryMod: matchedStatMod.recoveryMod,
              disciplineMod: matchedStatMod.disciplineMod,
              intellectMod: matchedStatMod.intellectMod,
              strengthMod: matchedStatMod.strengthMod,
              category: matchedStatMod.category,
              isOwned: matchedStatMod.isOwned,
              itemHash: matchedStatMod.itemHash,
              name: matchedStatMod.name,
              icon: matchedStatMod.icon,
            },
            equipped: false,
          });
        }
      }
    }

    dispatch(updateRequiredStatMods(requiredMods));
    setShowLoadoutCustomization(true);
  }

  const handleCharacterClick = (index: number) => {
    if (index === selectedCharacterIndex) return;

    dispatch(resetDashboard());
    dispatch(updateSelectedCharacter(index));
    dispatch(resetLoadout());
    dispatch(updateLoadoutCharacter(characters[index]));
    setSubclasses(characters[index].subclasses);
  };

  const handleSubclassSelect = (subclass: SubclassConfig) => {
    setSelectedSubclass(subclass);

    dispatch(
      updateSubclass({
        subclass: subclass,
      })
    );

    if (selectedCharacterIndex) {
      dispatch(
        updateSubclass({
          subclass: characters[selectedCharacterIndex].subclasses[subclass.damageType],
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
    <>
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
      ) : sharedLoadoutDto === undefined && selectedSubclass ? (
        <>
          <HeaderComponent
            emblemUrl={characters[selectedCharacterIndex]?.emblem?.secondarySpecial || ''}
            overlayUrl={characters[selectedCharacterIndex]?.emblem?.secondaryOverlay || ''}
            displayName={membership.bungieGlobalDisplayName}
            characters={characters}
            selectedCharacter={characters[selectedCharacterIndex]!}
            onCharacterClick={handleCharacterClick}
          />

          <Grid
            container
            sx={{
              width: '100vw',
              height: '100vh',
              overflowY: 'auto',
              paddingTop: '130px',
            }}
          >
            <DashboardContent item container md={12} justifyContent="space-evenly">
              <Grid item container direction="column" md={4} spacing={6} sx={{ marginTop: '2%' }}>
                <Grid item>
                  <SingleDiamondButton
                    subclasses={subclasses}
                    selectedSubclass={selectedSubclass}
                    onSubclassSelect={handleSubclassSelect}
                    onSubclassRightClick={handleSubclassRightClick}
                  />
                </Grid>
                <Grid item>
                  <NumberBoxes />
                </Grid>
              </Grid>
              <Grid
                container
                item
                md={4}
                spacing={3}
                direction="column"
                justifyContent={'flex-start'}
                alignItems={'center'}
                sx={{ marginTop: '1%' }}
              >
                <Grid item>
                  <ExoticSelector
                    selectedCharacter={characters[selectedCharacterIndex]!}
                    selectedExoticItemHash={selectedExotic.itemHash}
                  />
                </Grid>
                <Grid item>
                  <StatModifications />
                </Grid>
              </Grid>
              <Grid item md={4} sx={{ marginTop: '1%' }}>
                {generatingPermutations ? (
                  <p>Loading...</p>
                ) : filteredPermutations ? (
                  <PermutationsList
                    permutations={filteredPermutations}
                    onPermutationClick={openLoadoutCustomization}
                  />
                ) : (
                  <p>Loading....</p>
                )}
              </Grid>
              <Footer
                emblemUrl={characters[selectedCharacterIndex]?.emblem?.secondarySpecial || ''}
              />
            </DashboardContent>
          </Grid>
        </>
      ) : (
        <div>loading...</div>
      )}
    </>
  );
};

export default Dashboard;
