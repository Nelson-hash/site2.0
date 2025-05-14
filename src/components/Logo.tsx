import React from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';

const Logo: React.FC = () => {
  const { setHovered } = useCursor();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay: 0.3 }}
      className="logo-container flex flex-col items-center cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.h1 
        className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-widest"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        HORUS
      </motion.h1>
    </motion.div>
  );
};

export default Logo;