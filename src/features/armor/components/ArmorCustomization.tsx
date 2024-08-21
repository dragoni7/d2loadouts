import React from 'react';
import './ArmorCustomization.css';
import LoadoutArmor from './LoadoutArmor';
import EquipLoadout from '../../loadouts/components/EquipLoadout';
import { ManifestSubclass } from '../../../types/manifest-types';
import AbilitiesModification from '../../subclass/AbilitiesModification';

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
        <EquipLoadout />
      </div>
      <AbilitiesModification subclass={subclass} />
    </div>
  );
};

export default ArmorCustomization;
