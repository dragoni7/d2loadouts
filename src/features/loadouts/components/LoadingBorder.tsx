import React from 'react';
import { useSpring, animated } from 'react-spring';
import { styled } from '@mui/system';
import { Armor } from '../../../types/d2l-types';

const DefaultIconContainer = styled(animated.img)({
  padding: '2px',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '5px',
});

interface LoadingBorderProps {
  armor: Armor;
  size?: number;
}

const LoadingBorder: React.FC<LoadingBorderProps> = ({ armor, size }) => {
  const [border, api] = useSpring(
    () => ({
      from: { border: '4px solid rgba(21, 165, 224, 0)' },
      to: async (next) => {
        await next({ border: '4px solid rgba(21, 165, 224, 1)' });
        await next({ border: '4px solid rgba(21, 165, 224, 0)' });
      },
      loop: true,

      config: { duration: 2000, tension: 120, friction: 14 },
    }),
    []
  );

  return (
    <DefaultIconContainer
      src={armor.icon}
      alt={armor.name}
      width={size}
      height={size}
      style={border}
    />
  );
};

export default LoadingBorder;
