import React from "react";
import "./DiamondGrid.css";

const DiamondGrid: React.FC = () => {
  const buttons = [
    { id: 1, label: "1", color: "#3b82f6" }, // top
    { id: 2, label: "2", color: "#10b981" }, // left
    { id: 3, label: "3", color: "#f97316" }, // right
    { id: 4, label: "4", color: "#8b5cf6" }, // bottom
  ];

  return (
    <div className="diamond-grid">
      {buttons.map((button) => (
        <div
          key={button.id}
          className={`diamond-button button-${button.id}`}
          style={{ backgroundColor: button.color }}
        >
          <span>{button.label}</span>
        </div>
      ))}
    </div>
  );
};

export default DiamondGrid;
