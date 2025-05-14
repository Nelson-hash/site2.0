import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';

const HomeLink: React.FC = () => {
  const { setHovered } = useCursor();

  return (
    <Link to="/">
      <motion.h1
        className="text-2xl font-bold tracking-widest"
        whileHover={{ scale: 1.1 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        HORUS
      </motion.h1>
    </Link>
  );
};

export default HomeLink;