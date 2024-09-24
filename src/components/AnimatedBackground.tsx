import React, { useState, useEffect, useCallback } from 'react';
import { styled } from '@mui/system';
import { useSpring, animated, config, to } from 'react-spring';

const AnimatedBackgroundWrapper = styled(animated.div)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
});

const RotatingShape = styled(animated.div)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  border: '1px solid rgba(172, 172, 172, 0.5)',
  opacity: 0.3,
  zIndex: -1,
});

const PrismaticGlow = styled('div')({
  position: 'absolute',
  background: 'transparent',
  borderRadius: '50%',
  transition: 'all 0.3s ease',
  zIndex: -1,
  '&:hover': {
    boxShadow: '0 0 100px 50px rgba(255, 105, 180, 0.8)',
  },
});

const AnimatedBackground: React.FC = () => {
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

  return (
    <AnimatedBackgroundWrapper style={{ transform: scale.to((s) => `scale(${s})`) }}>
      <PrismaticGlow />
      <RotatingShape
        style={{
          transform: to(
            [rotation, shape],
            (r, s) => `rotate(${r}deg) scale(${1 + s * 0.5}, ${1 - s * 0.1})`
          ),
          borderRadius: shape.to((s) => `${s * 50}%`),
        }}
      />
      <RotatingShape
        style={{
          transform: to(
            [rotation, shape],
            (r, s) => `rotate(${r + 120}deg) scale(${1 + s * 0.5}, ${1 - s * 0.1})`
          ),
          borderRadius: shape.to((s) => `${s * 50}%`),
        }}
      />
      <RotatingShape
        style={{
          transform: to(
            [rotation, shape],
            (r, s) => `rotate(${r + 240}deg) scale(${1 + s * 0.5}, ${1 - s * 0.1})`
          ),
          borderRadius: shape.to((s) => `${s * 50}%`),
        }}
      />
    </AnimatedBackgroundWrapper>
  );
};

export default AnimatedBackground;
