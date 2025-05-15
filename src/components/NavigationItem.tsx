import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';

interface NavigationItemProps {
  title: string;
  href: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const NavigationItem: React.FC<NavigationItemProps> = ({ title, href, position }) => {
  const { setHovered, isMobile } = useCursor();
  
  // Mobile touch event handlers
  const handleTouch = () => {
    // On mobile, we can briefly flash the "hovered" state on touch
    if (isMobile) {
      setHovered(true);
      setTimeout(() => setHovered(false), 300);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.8 }}
      transition={{ duration: 1, delay: 0.5 }}
      className={isMobile ? "py-3" : ""}
    >
      <Link 
        to={href}
        className={`nav-item ${isMobile ? 'text-xl py-2 px-4' : ''}`}
        onMouseEnter={() => !isMobile && setHovered(true)}
        onMouseLeave={() => !isMobile && setHovered(false)}
        onTouchStart={handleTouch}
      >
        {title}
      </Link>
    </motion.div>
  );
};

export default NavigationItem;
