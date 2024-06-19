import React from "react";
import "./HoverButton.css";

interface HoverButtonProps {
  text: string;
  onClick: () => void;
}

const HoverButton: React.FC<HoverButtonProps> = ({ text, onClick }) => {
  return (
    <button className="hover-button" onClick={onClick}>
      {text}
    </button>
  );
};

export default HoverButton;
