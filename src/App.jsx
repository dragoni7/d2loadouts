import React from 'react';
import './App.css';
import Background from './components/Background';
import CustomizationPanel from './components/CustomizationPanel';
import BungieLogin from './features/auth/components/BungieLogin';

function App() {
  return (
    <Background>
      <div className="overlay-container">
        <BungieLogin />
        <div>
          TEST
        </div>
        <CustomizationPanel />
      </div>
    </Background>
  );
}

export default App;
