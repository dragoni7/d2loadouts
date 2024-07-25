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
import { DestinyArmor, ArmorByClass } from '../../types';
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
});

const ContentContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'flex-start',
  width: '100%',
  padding: '10px',
});

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
  const [separatedArmor, setSeparatedArmor] = useState<ArmorByClass | null>(null);
  const [permutations, setPermutations] = useState<DestinyArmor[][] | null>(null);
  const [filteredPermutations, setFilteredPermutations] = useState<DestinyArmor[][] | null>(null);
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const updateProfile = async () => {
      await updateManifest();
      const destinyMembership = await getDestinyMembershipId();
      dispatch(updateMembership(destinyMembership));
      const profileData = await getProfileData();
      dispatch(updateProfileArmor(profileData.armor));
      dispatch(updateProfileCharacters(profileData.characters));
      const separated = separateArmor(profileData.armor);
      const warlockPermutations = generatePermutations(separated.warlock);
      setPermutations(warlockPermutations);
      setFilteredPermutations(warlockPermutations);
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

  useEffect(() => {
    if (characters.length > 0) {
      const character = characters[0];
      if (character.emblem) {
        console.log(
          `Emblem: ${character.emblem.secondaryOverlay || ''} ${
            character.emblem.secondarySpecial || ''
          }`
        );
      }
    }
  }, [membership, characters]);

  const character = characters[0];

  return (
    <Container>
      {character?.emblem?.secondarySpecial && (
        <HeaderComponent
          emblemUrl={character.emblem.secondarySpecial}
          overlayUrl={character.emblem.secondaryOverlay || ''}
          displayName={membership.bungieGlobalDisplayName}
        />
      )}
      <ContentContainer>
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
