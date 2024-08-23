import React, { useState, useEffect } from 'react';
import { useSpring, animated, config } from 'react-spring';
import './SingleDiamondButton.css';
import { ManifestSubclass } from '../types/manifest-types';

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
  const [isAccelerating, setIsAccelerating] = useState(false);

  const normalSpeed = 15000;
  const fastSpeed = 700;
  const cycleLength = 10000;
  const speedUpDuration = 1000;

  const [{ rotation }, api] = useSpring(() => ({
    from: { rotation: 0 },
    to: { rotation: 360 },
    loop: true,
    config: { duration: normalSpeed },
  }));

  const [{ scale }, scaleApi] = useSpring(() => ({
    from: { scale: 1 },
    config: config.wobbly,
  }));

  useEffect(() => {
    const accelerate = () => {
      setIsAccelerating(true);
      api.start({
        to: { rotation: rotation.get() + 360 },
        config: { duration: fastSpeed },
        onRest: () => {
          setIsAccelerating(false);
          api.start({
            to: { rotation: rotation.get() + 360 },
            config: { duration: normalSpeed },
          });
        },
      });
      scaleApi.start({ to: { scale: 1.2 }, config: { duration: speedUpDuration } });
    };

    const interval = setInterval(() => {
      accelerate();
    }, cycleLength);

    return () => clearInterval(interval);
  }, [api, scaleApi, rotation, normalSpeed, fastSpeed, speedUpDuration]);

  useEffect(() => {
    if (!isAccelerating) {
      scaleApi.start({ to: { scale: 1 }, config: { duration: 500 } });
    }
  }, [isAccelerating, scaleApi]);

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

  const RotatingSquare = ({ rotationOffset = 0 }: { rotationOffset?: number }) => (
    <animated.div
      className="rotating-square"
      style={{
        transform: rotation.to((r) => `rotate(${r + rotationOffset}deg)`),
        scale: scale,
      }}
    />
  );
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
      {isPrismaticActive ? (
        <>
          <div
            className="prismatic-button diamond-shape"
            onClick={handleReset}
            onContextMenu={(event) => handleRightClick(event, currentSubclass!)}
          >
            <RotatingSquare />
            <RotatingSquare rotationOffset={120} />
            <RotatingSquare rotationOffset={240} />
            <div className="prismatic-glow diamond-shape"></div>
            <img src={currentSubclass!.icon} alt={currentSubclass!.name} className="diamond-icon" />
          </div>
          <div
            className="single-diamond-button"
            onClick={() => handleSelect(lastNonPrismaticSubclass!)}
            onContextMenu={(event) => handleRightClick(event, lastNonPrismaticSubclass!)}
          >
            <img
              src={lastNonPrismaticSubclass!.icon}
              alt={lastNonPrismaticSubclass!.name}
              className="diamond-icon"
            />
          </div>
        </>
      ) : (
        <>
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
              onClick={() => handleSelect(prismaticSubclass)}
              onContextMenu={(event) => handleRightClick(event, prismaticSubclass)}
            >
              <RotatingSquare />
              <RotatingSquare rotationOffset={120} />
              <RotatingSquare rotationOffset={240} />
              <div className="prismatic-glow"></div>
              <img
                src={prismaticSubclass.icon}
                alt={prismaticSubclass.name}
                className="circular-icon"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SingleDiamondButton;
