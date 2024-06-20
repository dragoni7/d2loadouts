// src/components/Background.jsx
import React from 'react';
import './Background.css';
import backgroundImage from '../assets/prismaticwarlock.png';
import ParticlesBackground from './ParticlesBackground';

const Background = ({ children }) => {
  return (
    <div className="background-container">
      {children}
    </div>
  );
};

export default Background;
