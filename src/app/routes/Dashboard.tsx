import React, { useEffect, useState, useMemo } from 'react';
import { styled } from '@mui/system';
import SingleDiamondButton from '../../components/SingleDiamondButton';
import NumberBoxes from '../../components/NumberBoxes';
import StatsTable from '../../components/StatsTable';
import { store } from '../../store';
import { getDestinyMembershipId } from '../../features/membership/BungieAccount';
import { updateMembership } from '../../store/MembershipReducer';
import { getProfileArmor } from '../../features/profile/DestinyProfile';
import { updateProfileArmor } from '../../store/ProfileReducer';
import { useDispatch } from 'react-redux';
import { updateManifest } from '../../lib/bungie_api/Manifest';
import { separateArmor } from '../../features/armor-optimization/separatedArmor';
import { generatePermutations } from '../../features/armor-optimization/generatePermutations';
import { filterPermutations } from '../../features/armor-optimization/filterPermutations';
import { DestinyArmor, ArmorByClass } from '../../types'; // Corrected import

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
});

const HeaderContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '10px',
  gap: '20px',
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
  const [separatedArmor, setSeparatedArmor] = useState<ArmorByClass | null>(null);
  const [permutations, setPermutations] = useState<DestinyArmor[][] | null>(null);
  const [filteredPermutations, setFilteredPermutations] = useState<DestinyArmor[][] | null>(null);
  const [selectedValues, setSelectedValues] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const updateProfile = async () => {
      await updateManifest();
      const destinyMembership = await getDestinyMembershipId();
      dispatch(updateMembership(destinyMembership));
      const armor = await getProfileArmor();
      dispatch(updateProfileArmor(armor));
      const separated = separateArmor(armor);
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

  return (
    <Container>
      <HeaderContainer>
        <SingleDiamondButton />
      </HeaderContainer>
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
