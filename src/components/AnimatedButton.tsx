import React from "react";
import "./AnimatedButton.css";

interface AnimatedButtonProps {
  onSelect: any;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ onSelect }) => {
  const handleClick = () => {
    onSelect("Animated", "rgba(255, 105, 180, 1)"); // Example label and color for the animated button
  };

  return (
    <div className="button-container" onClick={handleClick}>
      <div className="animated-button">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
        <div className="shape shape4"></div>
      </div>
    </div>
  );
};

export default AnimatedButton;
