import React from 'react';
import { ManifestSubclass } from '../types';
import AbilitiesModification from './AbilitiesModification';
import './SubclassCustomizationWrapper.css';

interface SubclassCustomizationWrapperProps {
  onBackClick: () => void;
  subclass: ManifestSubclass;
  screenshot: string;
}

const SubclassCustomizationWrapper: React.FC<SubclassCustomizationWrapperProps> = ({
  onBackClick,
  subclass,
  screenshot,
}) => {
  return (
    <div
      className="subclass-customization-wrapper"
      style={{ backgroundImage: `url(${screenshot})` }}
    >
      <AbilitiesModification onBackClick={onBackClick} subclass={subclass} />
    </div>
  );
};

export default SubclassCustomizationWrapper;
