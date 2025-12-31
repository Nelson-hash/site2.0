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
    <Link to="/" className="inline-block">
      <motion.div
        // UPDATED STYLES: Matches the Navigation links exactly (Bold, Uppercase, Smaller size)
        className="font-bold tracking-widest uppercase text-sm md:text-base"
        
        // Remove scale animation to prevent layout shifts, use opacity instead
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => !isMobile && setHovered(true)}
        onMouseLeave={() => !isMobile && setHovered(false)}
        onTouchStart={handleTouch}
        
        initial={{ opacity: 0.6 }}
        whileHover={{ 
          opacity: 1,
          transition: { duration: 0.2 }
        }}
        style={{ color: 'inherit' }} // Inherits color from the parent (Films page handles text color)
      >
        HORUS
      </motion.div>
    </Link>
  );
};

export default HomeLink;
