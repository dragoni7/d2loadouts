import React from 'react';
import './ArmorCustomization.css';
import { ManifestSubclass } from '../../../types';
import LoadoutArmor from './loadout-armor';
import AbilitiesModification from '../../../components/AbilitiesModification';

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
        <LoadoutArmor />
      </div>
      <AbilitiesModification onBackClick={onBackClick} subclass={subclass} />
    </div>
  );
};

export default ArmorCustomization;
