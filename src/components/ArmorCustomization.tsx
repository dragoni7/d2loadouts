import React from 'react';
import './ArmorCustomization.css';
import { ManifestSubclass } from '../types';
import ArmorMods from './ArmorMods';
import AbilitiesModification from './AbilitiesModification';

interface ArmorCustomizationProps {
  onBackClick: () => void;
  screenshot: string;
  subclass: ManifestSubclass;
  setSelectedSubclass: (subclass: ManifestSubclass) => void;
}

const ArmorCustomization: React.FC<ArmorCustomizationProps> = ({
  onBackClick,
  screenshot,
  subclass,
}) => {
  return (
    <div className="armor-customization-wrapper" style={{ backgroundImage: `url(${screenshot})` }}>
      <div className="left-panel">
        <ArmorMods />
      </div>
      <AbilitiesModification onBackClick={onBackClick} subclass={subclass} />
    </div>
  );
};

export default ArmorCustomization;
