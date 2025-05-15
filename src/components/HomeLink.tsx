import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';

const HomeLink: React.FC = () => {
  const { setHovered, isMobile } = useCursor();

  // Handle touch events for mobile
  const handleTouch = () => {
    if (isMobile) {
      setHovered(true);
      setTimeout(() => setHovered(false), 300);
    }
  };

  return (
    <Link to="/">
      <motion.h1
        className="text-2xl font-bold tracking-widest"
        whileHover={{ scale: isMobile ? 1 : 1.1 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => !isMobile && setHovered(true)}
        onMouseLeave={() => !isMobile && setHovered(false)}
        onTouchStart={handleTouch}
      >
        HORUS
      </motion.h1>
    </Link>
  );
};

export default HomeLink;
