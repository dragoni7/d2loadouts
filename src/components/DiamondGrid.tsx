import React from 'react';
import { ManifestSubclass } from '../types';
import './DiamondGrid.css';

interface DiamondGridProps {
  subclasses: ManifestSubclass[];
  onSelect: (subclass: ManifestSubclass) => void;
}

const DiamondGrid: React.FC<DiamondGridProps> = ({ subclasses, onSelect }) => {
  return (
    <div className="diamond-grid">
      {subclasses.map((subclass, index) => (
        <div
          key={index}
          className={`diamond-button button-${index + 1}`}
          onClick={() => onSelect(subclass)}
        >
          <img src={subclass.icon} alt={subclass.name} className="diamond-icon" />
        </div>
      ))}
    </div>
  );
};

export default DiamondGrid;
