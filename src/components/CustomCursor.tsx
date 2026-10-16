import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCursor } from '../context/CursorContext';

const CustomCursor: React.FC = () => {
  const { isHovered, isMobile } = useCursor();

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 20, stiffness: 250, mass: 0.4 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (isMobile) return;

    const updatePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', updatePosition, { passive: true });
    return () => window.removeEventListener('mousemove', updatePosition);
  }, [isMobile, cursorX, cursorY]);

  if (isMobile) return null;

  return (
    <motion.div
      className="custom-cursor bg-white"
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        width: isHovered ? 56 : 14,
        height: isHovered ? 56 : 14,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 18,
      }}
    />
  );
};

export default CustomCursor;
