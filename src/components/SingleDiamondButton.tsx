import React, { useState, useEffect } from 'react';
import './SingleDiamondButton.css';
import { ManifestSubclass } from '../types';

interface SingleDiamondButtonProps {
  subclasses: ManifestSubclass[];
  selectedSubclass: ManifestSubclass | null;
  onSubclassSelect: (subclass: ManifestSubclass) => void;
  onSubclassRightClick: (subclass: ManifestSubclass) => void;
}

const SingleDiamondButton: React.FC<SingleDiamondButtonProps> = ({
  subclasses,
  selectedSubclass,
  onSubclassSelect,
  onSubclassRightClick,
}) => {
  const [currentSubclass, setCurrentSubclass] = useState<ManifestSubclass | null>(null);
  const [lastNonPrismaticSubclass, setLastNonPrismaticSubclass] = useState<ManifestSubclass | null>(
    null
  );
  const [isPrismaticActive, setIsPrismaticActive] = useState(false);

  const getDefaultSubclass = () => {
    return subclasses.find((subclass) => !subclass.name.includes('Prismatic')) || subclasses[0];
  };

  useEffect(() => {
    if (selectedSubclass) {
      setCurrentSubclass(selectedSubclass);
      setIsPrismaticActive(selectedSubclass.name.includes('Prismatic'));
      if (!selectedSubclass.name.includes('Prismatic')) {
        setLastNonPrismaticSubclass(selectedSubclass);
      } else if (!lastNonPrismaticSubclass) {
        setLastNonPrismaticSubclass(getDefaultSubclass());
      }
    } else if (subclasses.length > 0) {
      const defaultSubclass = getDefaultSubclass();
      setCurrentSubclass(defaultSubclass);
      setLastNonPrismaticSubclass(defaultSubclass);
      onSubclassSelect(defaultSubclass);
    }
  }, [selectedSubclass, subclasses, onSubclassSelect]);

  const handleSelect = (subclass: ManifestSubclass) => {
    if (subclass.name.includes('Prismatic')) {
      setIsPrismaticActive(true);
    } else {
      setIsPrismaticActive(false);
      setLastNonPrismaticSubclass(subclass);
    }
    setCurrentSubclass(subclass);
    onSubclassSelect(subclass);
  };

  const handleReset = () => {
    if (lastNonPrismaticSubclass) {
      setIsPrismaticActive(false);
      setCurrentSubclass(lastNonPrismaticSubclass);
      onSubclassSelect(lastNonPrismaticSubclass);
    }
  };

  const handleRightClick = (event: React.MouseEvent, subclass: ManifestSubclass) => {
    event.preventDefault();
    onSubclassRightClick(subclass);
  };

  const prismaticSubclass = subclasses.find((subclass) => subclass.name.includes('Prismatic'));
  const nonPrismaticSubclasses = subclasses
    .filter((subclass) => !subclass.name.includes('Prismatic') && subclass !== currentSubclass)
    .slice(0, 4);

  return (
    <div className="single-diamond-wrapper">
      {!isPrismaticActive && (
        <div className="diamond-grid">
          {nonPrismaticSubclasses.map((subclass, index) => (
            <div
              key={subclass.itemHash}
              className={`diamond-button button-${index + 1}`}
              onClick={() => handleSelect(subclass)}
              onContextMenu={(event) => handleRightClick(event, subclass)}
            >
              <img src={subclass.icon} alt={subclass.name} className="diamond-icon" />
            </div>
          ))}
        </div>
      )}
      <div
        className="single-diamond-button"
        onContextMenu={(event) => handleRightClick(event, currentSubclass!)}
      >
        {currentSubclass && (
          <img src={currentSubclass.icon} alt={currentSubclass.name} className="diamond-icon" />
        )}
      </div>
      {prismaticSubclass && (
        <div
          className="prismatic-button"
          onClick={isPrismaticActive ? handleReset : () => handleSelect(prismaticSubclass)}
          onContextMenu={(event) =>
            handleRightClick(
              event,
              isPrismaticActive ? lastNonPrismaticSubclass! : prismaticSubclass
            )
          }
        >
          <img
            src={isPrismaticActive ? lastNonPrismaticSubclass!.icon : prismaticSubclass.icon}
            alt={isPrismaticActive ? lastNonPrismaticSubclass!.name : prismaticSubclass.name}
            className={isPrismaticActive ? 'diamond-icon' : 'circular-icon'}
          />
        </div>
      )}
    </div>
  );
};

export default SingleDiamondButton;
