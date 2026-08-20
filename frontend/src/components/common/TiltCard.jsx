import React, { useState, useRef } from 'react';

export const TiltCard = ({ children, className = '' }) => {
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s ease-out'
  });
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angles (max ~10 deg)
    const rotateX = -((y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s cubic-bezier(0.03, 0.98, 0.52, 0.99)'
    });

    setSpotlightPos({
      x: ((x / rect.width) * 100).toFixed(2),
      y: ((y / rect.height) * 100).toFixed(2),
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out'
    });
    setSpotlightPos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card-wrapper ${className}`}
      style={{
        ...tiltStyle,
        position: 'relative',
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
    >
      {/* Dynamic Specular Mouse Spotlight Glow */}
      <div
        className="tilt-spotlight"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 2,
          background: `radial-gradient(600px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(16, 185, 129, 0.18), rgba(6, 182, 212, 0.08) 40%, transparent 80%)`,
          opacity: spotlightPos.opacity,
          transition: 'opacity 0.3s ease'
        }}
      />
      {children}
    </div>
  );
};
