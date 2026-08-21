import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export const TiltCard = ({ children, className = '' }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Calculate rotation angles
  const rotateXRaw = useTransform(y, [-0.5, 0.5], [12, -12]);
  const rotateYRaw = useTransform(x, [-0.5, 0.5], [-12, 12]);

  // Apply spring physics for ultra-smooth 3D motion
  const rotateX = useSpring(rotateXRaw, { damping: 25, stiffness: 200 });
  const rotateY = useSpring(rotateYRaw, { damping: 25, stiffness: 200 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      className={`tilt-card-wrapper ${className}`}
    >
      {children}
    </motion.div>
  );
};
