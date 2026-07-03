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
        className="font-bold tracking-widest uppercase text-xl md:text-2xl"
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => !isMobile && setHovered(true)}
        onMouseLeave={() => !isMobile && setHovered(false)}
        onTouchStart={handleTouch}
        initial={{ opacity: 0.7 }}
        whileHover={{ 
          opacity: 1,
          scale: 1.05, // MODIF 2: Agrandissement au hover
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        style={{ color: 'inherit', transformOrigin: 'left center' }} 
      >
        HORUS
      </motion.div>
    </Link>
  );
};

export default HomeLink;
