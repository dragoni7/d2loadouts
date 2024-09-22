import cursorImage from '/assets/cursor.png';
import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const style = document.createElement('style');
    style.textContent = `
        * {
          cursor: none !important;
        }
      `;
    document.head.appendChild(style);

    const updateCursor = (e: MouseEvent) => {
      if (!visible) return;
      requestAnimationFrame(() => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      });
    };

    window.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseleave', () => setVisible(false));
    document.addEventListener('mouseenter', () => setVisible(true));

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseleave', () => setVisible(false));
      document.removeEventListener('mouseenter', () => setVisible(true));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.head.removeChild(style);
    };
  }, [visible]);

  return (
    <div
      ref={cursorRef}
      style={{
        width: '32px',
        height: '32px',
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 99999,
        backgroundImage: `url(${cursorImage})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        top: 0,
        left: 0,
        transition: 'transform 0.05s ease-out',
        willChange: 'transform',
        display: visible ? 'block' : 'none',
      }}
    />
  );
};

export default CustomCursor;
