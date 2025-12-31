import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';

const HomeLink: React.FC = () => {
  const { setHovered, isMobile } = useCursor();

  const handleTouch = () => {
    if (isMobile) {
      setHovered(true);
      setTimeout(() => setHovered(false), 300);
    }
  };

  return (
    <Link to="/" className="inline-block">
      <motion.div
        // UPDATED STYLES: Bold, Uppercase, Bigger size to match Navigation
        className="font-bold tracking-widest uppercase text-xl md:text-2xl"
        
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => !isMobile && setHovered(true)}
        onMouseLeave={() => !isMobile && setHovered(false)}
        onTouchStart={handleTouch}
        
        initial={{ opacity: 0.7 }}
        whileHover={{ 
          opacity: 1,
          transition: { duration: 0.2 }
        }}
        style={{ color: 'inherit' }} 
      >
        HORUS
      </motion.div>
    </Link>
  );
};

export default HomeLink;
