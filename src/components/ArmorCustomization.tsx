import React from 'react';
import './ArmorCustomization.css';

interface ArmorCustomizationProps {
  onBackClick: () => void;
  screenshot: string;
}

const ArmorCustomization: React.FC<ArmorCustomizationProps> = ({ onBackClick, screenshot }) => {
  return (
    <div className="armor-customization-wrapper" style={{ backgroundImage: `url(${screenshot})` }}>
      <div className="customization-panel">
        <button className="back-button" onClick={onBackClick}>
          ← Back
        </button>
        <div className="armor-slots">
          {['Helmet', 'Arms', 'Chest', 'Leg', 'Class Item'].map((armorType) => (
            <div key={armorType} className="armor-slot">
              <div className="armor-header">{armorType}</div>
              <div className="mod-grid">
                {['slot1', 'slot2', 'slot3', 'slot4', 'slot5'].map((slot) => (
                  <div key={slot} className="mod">
                    {slot}
                    <div className="submenu-grid">
                      <div className="submenu-item">Option 1</div>
                      <div className="submenu-item">Option 2</div>
                      <div className="submenu-item">Option 3</div>
                      <div className="submenu-item">Option 4</div>
                      <div className="submenu-item">Option 5</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArmorCustomization;
