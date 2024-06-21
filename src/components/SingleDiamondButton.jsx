import React, { useState } from 'react';
import DiamondGrid from './DiamondGrid';
import AnimatedButton from './AnimatedButton';
import './SingleDiamondButton.css';

const SingleDiamondButton = () => {
  const [hovered, setHovered] = useState(false);
  const [currentButton, setCurrentButton] = useState({
    label: '5',
    color: '#ff6347',
    type: 'single' // Added type to differentiate between single diamond and animated button
  });

  const handleHover = () => setHovered(true);
  const handleLeave = () => setHovered(false);
  const handleSelect = (label, color, type) => {
    setCurrentButton({ label, color, type });
    setHovered(false);
  };

  return (
    <div 
      className="single-diamond-wrapper" 
      onMouseEnter={handleHover} 
      onMouseLeave={handleLeave}
    >
      <div className={`button-container ${hovered ? 'hide-mini-diamond' : ''}`}>
        <div className="mini-diamond-button" />
        {currentButton.type === 'single' ? (
          <div
            className="single-diamond-button"
            style={{ backgroundColor: currentButton.color, opacity: hovered ? 0.5 : 1 }}
          >
            <span>{currentButton.label}</span>
          </div>
        ) : (
          <div className="animated-button-wrapper">
            <AnimatedButton onSelect={() => {}} />
          </div>
        )}
        {currentButton.type !== 'animated' && (
          <div className="mini-animated-button">
            <AnimatedButton onSelect={() => handleSelect('Animated', 'rgba(255, 105, 180, 1)', 'animated')} />
          </div>
        )}
      </div>
      {hovered && (
        <div className="diamond-grid-animated-container">
          <div className="diamond-grid-wrapper">
            <DiamondGrid onSelect={(label, color) => handleSelect(label, color, 'single')} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleDiamondButton;
