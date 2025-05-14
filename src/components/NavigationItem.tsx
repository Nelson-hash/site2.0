import React from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';

interface NavigationItemProps {
  title: string;
  href: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const NavigationItem: React.FC<NavigationItemProps> = ({ title, href, position }) => {
  const { setHovered } = useCursor();
  
  return (
    <motion.a
      href={href}
      className="nav-item"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.8 }}
      transition={{ duration: 1, delay: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {title}
    </motion.a>
  );
};

export default NavigationItem;