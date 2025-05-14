import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const { isHovered } = useCursor();

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updatePosition);
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  const cursorVariants = {
    default: {
      width: 16,
      height: 16,
      backgroundColor: "white",
      mixBlendMode: "difference" as "difference",
    },
    hovered: {
      width: 60,
      height: 60,
      backgroundColor: "white",
      mixBlendMode: "difference" as "difference",
    }
  };

  return (
    <motion.div
      className="custom-cursor rounded-full"
      animate={isHovered ? "hovered" : "default"}
      variants={cursorVariants}
      style={{
        left: position.x,
        top: position.y,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.5
      }}
    />
  );
};

export default CustomCursor;