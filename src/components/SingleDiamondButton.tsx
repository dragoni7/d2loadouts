import React, { useState, useEffect, useCallback } from 'react';
import { useSpring, animated, config, to } from 'react-spring';
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
  const [isOblong, setIsOblong] = useState(false);

  // Animation configuration
  const normalSpeed = 15000;
  const fastSpeed = 700;
  const cycleLength = 10000;
  const speedUpDuration = 1000;
  const morphDuration = 50;

  const [{ rotation }, rotationApi] = useSpring(() => ({
    from: { rotation: 0 },
    to: { rotation: 360 },
    loop: true,
    config: { duration: normalSpeed },
  }));

  const [{ scale }, scaleApi] = useSpring(() => ({
    from: { scale: 1 },
    config: config.wobbly,
  }));

  const [{ shape }, shapeApi] = useSpring(() => ({
    shape: 0,
    config: { duration: morphDuration },
  }));

  const morph = useCallback(() => {
    setIsOblong(!isOblong);
    shapeApi.start({
      to: { shape: isOblong ? 0 : 1 },
    });
  }, [isOblong, shapeApi]);

  const accelerate = useCallback(() => {
    setIsAccelerating(true);
    morph();
    setTimeout(() => {
      rotationApi.start({
        to: { rotation: rotation.get() + 360 },
        config: { duration: fastSpeed },
        onRest: () => {
          setIsAccelerating(false);
          rotationApi.start({
            to: { rotation: rotation.get() + 360 },
            config: { duration: normalSpeed },
          });
        },
      });
      scaleApi.start({ to: { scale: 1.2 }, config: { duration: speedUpDuration } });
    }, morphDuration);
  }, [rotationApi, scaleApi, rotation, normalSpeed, fastSpeed, speedUpDuration, morph]);

  useEffect(() => {
    const interval = setInterval(accelerate, cycleLength);
    return () => clearInterval(interval);
  }, [accelerate, cycleLength]);

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
  }, [selectedSubclass, subclasses, onSubclassSelect, lastNonPrismaticSubclass]);

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

  const RotatingShape = ({ rotationOffset = 0 }: { rotationOffset?: number }) => (
    <animated.div
      className="rotating-shape"
      style={{
        transform: to(
          [rotation, shape],
          (r, s) => `rotate(${r + rotationOffset}deg) scale(${1 + s * 0.5}, ${1 - s * 0.3})`
        ),
        scale: scale,
        borderRadius: shape.to((s) => `${s * 50}%`),
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
            <div className="prismatic-glow diamond-shape"></div>
            <RotatingShape />
            <RotatingShape rotationOffset={120} />
            <RotatingShape rotationOffset={240} />
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
              <div className="prismatic-glow"></div>
              <RotatingShape />
              <RotatingShape rotationOffset={120} />
              <RotatingShape rotationOffset={240} />
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
