import React, { useState, useEffect } from 'react';
import './SingleDiamondButton.css';

interface ManifestSubclass {
  name: string;
  icon: string;
}

interface SingleDiamondButtonProps {
  subclasses: ManifestSubclass[];
  selectedSubclass: ManifestSubclass | null;
  onSubclassSelect: (subclass: ManifestSubclass) => void;
}

const SingleDiamondButton: React.FC<SingleDiamondButtonProps> = ({
  subclasses,
  selectedSubclass,
  onSubclassSelect,
}) => {
  const [currentSubclass, setCurrentSubclass] = useState<ManifestSubclass | null>(null);
  const [lastNonPrismaticSubclass, setLastNonPrismaticSubclass] = useState<ManifestSubclass | null>(
    null
  );
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    if (!selectedSubclass && subclasses.length > 0) {
      const defaultSubclass =
        subclasses.find((subclass) => !subclass.name.includes('Prismatic')) || subclasses[0];
      setCurrentSubclass(defaultSubclass);
      setLastNonPrismaticSubclass(defaultSubclass);
      onSubclassSelect(defaultSubclass);
    } else if (selectedSubclass) {
      setCurrentSubclass(selectedSubclass);
    }
  }, [selectedSubclass, subclasses, onSubclassSelect]);

  const handleSelect = (subclass: ManifestSubclass) => {
    if (subclass.name.includes('Prismatic')) {
      setShowGrid(false);
      setLastNonPrismaticSubclass(currentSubclass);
      setCurrentSubclass(subclass);
    } else {
      setShowGrid(true);
      setLastNonPrismaticSubclass(currentSubclass);
      setCurrentSubclass(subclass);
    }
    onSubclassSelect(subclass);
  };

  const handleReset = () => {
    setShowGrid(true);
    if (lastNonPrismaticSubclass) {
      setCurrentSubclass(lastNonPrismaticSubclass);
      onSubclassSelect(lastNonPrismaticSubclass);
    }
  };

  const prismaticSubclass = subclasses.find((subclass) => subclass.name.includes('Prismatic'));
  const nonPrismaticSubclasses = subclasses
    .filter((subclass) => !subclass.name.includes('Prismatic') && subclass !== currentSubclass)
    .slice(0, 4);

  return (
    <div className="single-diamond-wrapper">
      {showGrid && (
        <div className="diamond-grid">
          {nonPrismaticSubclasses.map((subclass, index) => (
            <div
              key={index}
              className={`diamond-button button-${index + 1}`}
              onClick={() => handleSelect(subclass)}
            >
              <img src={subclass.icon} alt={subclass.name} className="diamond-icon" />
            </div>
          ))}
        </div>
      )}
      <div className="single-diamond-button">
        {currentSubclass && (
          <img src={currentSubclass.icon} alt={currentSubclass.name} className="diamond-icon" />
        )}
      </div>
      {prismaticSubclass && !showGrid && (
        <div className="prismatic-button" onClick={handleReset}>
          {lastNonPrismaticSubclass && (
            <img
              src={lastNonPrismaticSubclass.icon}
              alt={lastNonPrismaticSubclass.name}
              className="diamond-icon"
            />
          )}
        </div>
      )}
      {prismaticSubclass && showGrid && (
        <div className="prismatic-button" onClick={() => handleSelect(prismaticSubclass)}>
          <img
            src={prismaticSubclass.icon}
            alt={prismaticSubclass.name}
            className="circular-icon"
          />
        </div>
      )}
    </div>
  );
};

export default SingleDiamondButton;
