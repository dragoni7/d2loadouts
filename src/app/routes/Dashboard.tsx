import { styled } from "@mui/system";
import SingleDiamondButton from "../../components/SingleDiamondButton";
import NumberBoxes from "../../components/NumberBoxes";
import StatsTable from "../../components/StatsTable";
import { useEffect, useState } from "react";
import { store } from "../../store";
import { getDestinyMembershipId } from "../../features/membership/BungieAccount";
import { updateMembership } from "../../store/MembershipReducer";
import { getProfileArmor } from "../../features/profile/DestinyProfile";
import { updateProfileArmor } from "../../store/ProfileReducer";
import { useDispatch } from "react-redux";
import { updateManifest } from "../../lib/bungie_api/Manifest";
import { separateArmor } from "../../features/armor-optimization/separatedArmor";
import { generatePermutations } from "../../features/armor-optimization/generatePermutations";
import { filterPermutations } from "../../features/armor-optimization/filterPermutations";
import { DestinyArmor, ArmorByClass } from "../../types";

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
});

const HeaderContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "10px", // Further reduced margin to bring items closer
  gap: "20px", // Add gap to ensure proper spacing
});

const ContentContainer = styled("div")({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "flex-start",
  width: "100%",
  padding: "10px", // Further reduced padding to bring items closer
});

const LeftPane = styled("div")({
  marginRight: "10px", // Reduced margin
});

const RightPane = styled("div")({
  flexGrow: 1,
});

export const Dashboard = () => {
  const dispatch = useDispatch();
  const [separatedArmor, setSeparatedArmor] = useState<ArmorByClass | null>(
    null
  );
  const [permutations, setPermutations] = useState<DestinyArmor[][] | null>(
    null
  );
  const [filteredPermutations, setFilteredPermutations] = useState<
    DestinyArmor[][] | null
  >(null);
  const [selectedValues, setSelectedValues] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const updateProfile = async () => {
      // update / get manifest
      await updateManifest();

      console.log("Manifest updated");

      // store membership details into store
      const destinyMembership = await getDestinyMembershipId();

      dispatch(updateMembership(destinyMembership));

      // store profile armor array into store
      const armor = await getProfileArmor();

      dispatch(updateProfileArmor(armor));

      console.log(store.getState().profile.armor);
      const separated = separateArmor(armor);

      console.log(separated);
      const warlockPermutations = generatePermutations(separated.warlock);
      setPermutations(warlockPermutations);
      setFilteredPermutations(warlockPermutations);

      console.log("Warlock Armor Permutations:", warlockPermutations);
    };

    updateProfile().catch(console.error);
  }, [dispatch]);

  useEffect(() => {
    if (permutations) {
      const filtered = filterPermutations(permutations, selectedValues);
      setFilteredPermutations(filtered);
      console.log("Filtered permutations:", filtered);
    }
  }, [selectedValues, permutations]);

  const handleThresholdChange = (thresholds: { [key: string]: number }) => {
    setSelectedValues(thresholds);
    console.log("Selected thresholds:", thresholds);
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
          <h1 style={{ fontSize: "16px" }}>Armour Combinations</h1>
          {filteredPermutations ? <StatsTable /> : <p>Loading...</p>}
        </RightPane>
      </ContentContainer>
    </Container>
  );
};
