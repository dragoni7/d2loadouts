import cursorImage from '../../public/assets/cursor.png';
import React, { useEffect, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

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
      requestAnimationFrame(() => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      });
    };

    window.addEventListener('mousemove', updateCursor);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        width: '32px',
        height: '32px',
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 9999,
        backgroundImage: `url(${cursorImage})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        top: 0,
        left: 0,
        transform: 'translate(-50%, -50%)',
        transition: 'transform 0.1s ease-out',
        willChange: 'transform',
      }}
    />
  );
};

export default CustomCursor;
