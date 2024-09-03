import React, { useState, useEffect, useCallback } from 'react';
import { useSpring, animated, config, to } from 'react-spring';
import './SingleDiamondButton.css';
import { ManifestSubclass } from '../types/manifest-types';
import { SubclassConfig } from '../types/d2l-types';
import { DAMAGE_TYPE } from '../lib/bungie_api/constants';
import { damp } from 'three/src/math/MathUtils';

interface SingleDiamondButtonProps {
  subclasses: { [key: number]: SubclassConfig | undefined } | undefined;
  selectedSubclass: SubclassConfig | null;
  onSubclassSelect: (subclass: SubclassConfig) => void;
  onSubclassRightClick: (subclass: SubclassConfig) => void;
}

const SingleDiamondButton: React.FC<SingleDiamondButtonProps> = ({
  subclasses,
  selectedSubclass,
  onSubclassSelect,
  onSubclassRightClick,
}) => {
  const [currentSubclass, setCurrentSubclass] = useState<SubclassConfig | undefined>(undefined);
  const [lastNonPrismaticSubclass, setLastNonPrismaticSubclass] = useState<
    SubclassConfig | undefined
  >(undefined);
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

  function getDefaultSubclass(): SubclassConfig | undefined {
    if (subclasses) {
      const keys = Object.keys(subclasses);
      for (let i = 0; i < keys.length; i++) {
        if (
          subclasses[Number(keys[i])] !== undefined &&
          subclasses[Number(keys[i])]?.damageType !== DAMAGE_TYPE.KINETIC
        )
          return subclasses[Number(keys[i])]!;
      }
    }

    return undefined;
  }

  useEffect(() => {
    if (selectedSubclass) {
      setCurrentSubclass(selectedSubclass);
      setIsPrismaticActive(selectedSubclass.subclass.damageType === DAMAGE_TYPE.KINETIC);
      if (selectedSubclass.subclass.damageType !== DAMAGE_TYPE.KINETIC) {
        setLastNonPrismaticSubclass(selectedSubclass);
      } else if (!lastNonPrismaticSubclass) {
        setLastNonPrismaticSubclass(getDefaultSubclass());
      }
    } else if (subclasses) {
      const defaultSubclass = getDefaultSubclass();
      setCurrentSubclass(defaultSubclass);
      setLastNonPrismaticSubclass(defaultSubclass);
      onSubclassSelect(defaultSubclass!);
    }
  }, [selectedSubclass, subclasses, onSubclassSelect, lastNonPrismaticSubclass]);

  const handleSelect = (subclass: SubclassConfig) => {
    if (subclass.damageType === DAMAGE_TYPE.KINETIC) {
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

  const handleRightClick = (event: React.MouseEvent, subclass: SubclassConfig) => {
    event.preventDefault();
    onSubclassRightClick(subclass);
  };

  const RotatingShape = ({ rotationOffset = 0 }: { rotationOffset?: number }) => (
    <animated.div
      className="rotating-shape"
      style={{
        transform: to(
          [rotation, shape],
          (r, s) => `rotate(${r + rotationOffset}deg) scale(${1 + s * 0.5}, ${1 - s * 0.1})`
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
          {subclasses &&
            [
              DAMAGE_TYPE.ARC,
              DAMAGE_TYPE.SOLAR,
              DAMAGE_TYPE.STASIS,
              DAMAGE_TYPE.STRAND,
              DAMAGE_TYPE.VOID,
            ]
              .filter((key) => Number(key) !== selectedSubclass?.damageType)
              .map((damageType, index) => (
                <div
                  key={index}
                  className={`diamond-button button-${index + 1}`}
                  onClick={() => {
                    if (damageType in subclasses) handleSelect(subclasses[Number(damageType)]!);
                  }}
                  onContextMenu={(event) => {
                    if (damageType in subclasses && selectedSubclass?.damageType === damageType)
                      handleRightClick(event, subclasses[Number(damageType)]!);
                  }}
                >
                  <img
                    src={`src/assets/subclass-icons/${damageType}.png`}
                    alt={String(damageType)}
                    className="diamond-icon"
                    style={{ filter: damageType in subclasses ? 'none' : 'grayscale(100%)' }}
                  />
                </div>
              ))}
        </div>
      )}
      {isPrismaticActive ? (
        <>
          <div
            className="prismatic-button diamond-shape"
            onClick={handleReset}
            onContextMenu={(event) => {
              if (selectedSubclass?.damageType === DAMAGE_TYPE.KINETIC)
                handleRightClick(event, currentSubclass!);
            }}
          >
            <div className="prismatic-glow diamond-shape"></div>
            <RotatingShape />
            <RotatingShape rotationOffset={120} />
            <RotatingShape rotationOffset={240} />
            <img
              src={currentSubclass!.subclass.icon}
              alt={currentSubclass!.subclass.name}
              className="diamond-icon"
            />
          </div>
          <div
            className="single-diamond-button"
            onClick={() => handleSelect(lastNonPrismaticSubclass!)}
            onContextMenu={(event) => {
              if (selectedSubclass?.damageType !== DAMAGE_TYPE.KINETIC)
                handleRightClick(event, lastNonPrismaticSubclass!);
            }}
          >
            <img
              src={lastNonPrismaticSubclass!.subclass.icon}
              alt={lastNonPrismaticSubclass!.subclass.name}
              className="diamond-icon"
            />
          </div>
        </>
      ) : (
        <>
          <div
            className="single-diamond-button"
            onContextMenu={(event) => {
              if (selectedSubclass?.damageType !== DAMAGE_TYPE.KINETIC)
                handleRightClick(event, currentSubclass!);
            }}
          >
            {currentSubclass && (
              <img
                src={currentSubclass.subclass.icon}
                alt={currentSubclass.subclass.name}
                className="diamond-icon"
              />
            )}
          </div>
          {subclasses !== undefined && subclasses[DAMAGE_TYPE.KINETIC] ? (
            <div
              className="prismatic-button"
              onClick={() => handleSelect(subclasses[DAMAGE_TYPE.KINETIC]!)}
              onContextMenu={(event) => {
                if (selectedSubclass?.damageType === DAMAGE_TYPE.KINETIC)
                  handleRightClick(event, subclasses[DAMAGE_TYPE.KINETIC]!);
              }}
            >
              <div className="prismatic-glow"></div>
              <RotatingShape />
              <RotatingShape rotationOffset={120} />
              <RotatingShape rotationOffset={240} />
              <img
                src={subclasses[DAMAGE_TYPE.KINETIC]!.subclass.icon}
                alt={subclasses[DAMAGE_TYPE.KINETIC]!.subclass.name}
                className="circular-icon"
              />
            </div>
          ) : (
            <div></div>
          )}
        </>
      )}
    </div>
  );
};

export default SingleDiamondButton;
