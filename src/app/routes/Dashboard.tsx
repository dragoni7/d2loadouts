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

// import React from 'react';
// import './App.css';
// import Background from './components/Background';
// import CustomizationPanel from './components/CustomizationPanel';

// function App() {
//   return (
//     <Background>
//       <div className="overlay-container">
//         <CustomizationPanel />
//       </div>
//     </Background>
//   );
// }

// export default App;

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
      // store membership id into store
      const destinyMembership = await getDestinyMembershipId();

      dispatch(updateMembership(destinyMembership));

      // update / get manifest

      // store profile armor array into store
      var armor = await getProfileArmor(
        store.getState().destinyMembership.membership
      );

      dispatch(updateProfileArmor(armor));

      console.log(store.getState().profile.armor);
      console.log(store.getState().destinyMembership.membership);
    };

    updateProfile().catch(console.error);
  }, []);

  return (
    <Container>
      <div>{localStorage.getItem("profile")}</div>
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
