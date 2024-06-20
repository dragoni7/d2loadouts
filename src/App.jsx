import React from 'react';
import './App.css';
import Background from './components/Background';
import CustomizationPanel from './components/CustomizationPanel';

function App() {
  return (
    <Background>
      <div className="overlay-container">
        <CustomizationPanel />
      </div>
    </Background>
  );
}

export default App;
