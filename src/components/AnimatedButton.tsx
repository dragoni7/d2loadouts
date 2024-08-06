import React from 'react';
import './AnimatedButton.css';

interface AnimatedButtonProps {
  icon: string;
  onSelect: () => void;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ icon, onSelect }) => {
  const handleClick = () => {
    onSelect();
  };

  return (
    <div className="button-container" onClick={handleClick}>
      <div className="animated-button">
        <img src={icon} alt="Prismatic Icon" className="animated-icon" />
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>
    </div>
  );
};

export default AnimatedButton;
