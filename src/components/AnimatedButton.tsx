import React from "react";
import "./AnimatedButton.css";

const AnimatedButton: React.FC = () => {
  return (
    <div className="button-container">
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
