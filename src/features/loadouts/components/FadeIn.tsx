import React, { ReactNode } from 'react';
import { useSpring, animated } from 'react-spring';

const FadeIn: React.FC<{ children: ReactNode; duration?: number; delay?: number }> = (props: {
  children: ReactNode;
  duration?: number;
  delay?: number;
}) => {
  const [opacity, api] = useSpring(
    () => ({
      from: { opacity: '0' },
      delay: props.delay ? props.delay : 0,
      to: { opacity: '1' },

      config: { duration: props.duration ? props.duration : 2000, tension: 120, friction: 14 },
    }),
    []
  );

  return <animated.div style={opacity}>{props.children}</animated.div>;
};

export default FadeIn;
