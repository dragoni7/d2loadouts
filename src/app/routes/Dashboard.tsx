import { styled } from "@mui/system";
import SingleDiamondButton from "../../components/SingleDiamondButton";
import NumberBoxes from "../../components/NumberBoxes";
import StatsTable from "../../components/StatsTable";
import { useEffect } from "react";
import { store } from "../../store";
import { getDestinyMembershipId } from "../../features/membership/BungieAccount";
import { updateMembership } from "../../store/MembershipReducer";
import { getProfileArmor } from "../../features/profile/DestinyProfile";
import { updateProfileArmor } from "../../store/ProfileReducer";
import { useDispatch } from "react-redux";
import { updateManifest } from "../../lib/bungie_api/Manifest";
import { separateArmor } from "../../features/armor-optimization/separatedaArmor";

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

  useEffect(() => {
    const updateProfile = async () => {
      // update / get manifest
      await updateManifest();

      console.log("Manifest updated");

      // store membership details into store
      const destinyMembership = await getDestinyMembershipId();

      dispatch(updateMembership(destinyMembership));

      // store profile armor array into store
      var armor = await getProfileArmor();

      dispatch(updateProfileArmor(armor));

      console.log(store.getState().profile.armor);
      const separated = separateArmor(armor);

      console.log(separated);
    };

    updateProfile().catch(console.error);
  }, []);

  return (
    <Container>
      <HeaderContainer>
        <SingleDiamondButton />
      </HeaderContainer>
      <ContentContainer>
        <LeftPane>
          <NumberBoxes />
        </LeftPane>
        <RightPane>
          <h1 style={{ fontSize: "16px" }}>Armour Combinations</h1>
          <StatsTable />
        </RightPane>
      </ContentContainer>
    </Container>
  );
};
