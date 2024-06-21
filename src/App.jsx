
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
import React from "react";
import { styled } from "@mui/system";
import StatsTable from "./components/StatsTable";
import NumberBoxes from "./components/NumberBoxes"; // Updated import path
import SingleDiamondButton from "./components/SingleDiamondButton"; // New import for SingleDiamondButton
import BungieLogin from './features/auth/components/BungieLogin'

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
  marginBottom: '10px', // Further reduced margin to bring items closer
  gap: '20px', // Add gap to ensure proper spacing
});

const ContentContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'flex-start',
  width: '100%',
  padding: '10px', // Further reduced padding to bring items closer
});

const LeftPane = styled('div')({
  marginRight: '10px', // Reduced margin
});

const RightPane = styled('div')({
  flexGrow: 1,
});

function App() {
  return (
    <Container>
      <BungieLogin />
      <HeaderContainer>
        <SingleDiamondButton />
      </HeaderContainer>
      <ContentContainer>
        <LeftPane>
          <NumberBoxes />
        </LeftPane>
        <RightPane>
          <h1 style={{ fontSize: '16px' }}>Armour Combinations</h1>
          <StatsTable />
        </RightPane>
      </ContentContainer>
    </Container>

  );
}

export default App;

