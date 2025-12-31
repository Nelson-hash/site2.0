import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';

const Navigation: React.FC = () => {
  const { setHovered, isMobile } = useCursor();
  const location = useLocation();

  const isFilmsPage = location.pathname === '/films';
  const isAboutPage = location.pathname === '/about';

  // HELPER: Font style - Bold, Uppercase, Bigger size
  const linkStyle = "font-bold tracking-widest uppercase text-lg md:text-2xl relative group";

  return (
    <>
      {/* LINK 1: FILMS */}
      <div className={`fixed z-40 text-white mix-blend-difference pointer-events-none
        ${isMobile ? 'bottom-6 left-6' : 'top-8 left-8'}`}
      >
        <div className="pointer-events-auto">
          <Link 
            to="/films"
            onMouseEnter={() => !isMobile && setHovered(true)}
            onMouseLeave={() => !isMobile && setHovered(false)}
            className={`${linkStyle} ${isFilmsPage ? 'opacity-100' : 'opacity-70 hover:opacity-100'} transition-opacity duration-300`}
          >
            Films
            {/* Underline animation */}
            {isFilmsPage && (
              <motion.div 
                layoutId="underline-films"
                className="absolute -bottom-1 left-0 w-full h-[2px] bg-white"
              />
            )}
          </Link>
        </div>
      </div>

      {/* LINK 2: A PROPOS */}
      <div className="fixed z-40 bottom-6 right-6 md:bottom-8 md:right-8 text-white mix-blend-difference pointer-events-none">
        <div className="pointer-events-auto">
          <Link 
            to="/about"
            onMouseEnter={() => !isMobile && setHovered(true)}
            onMouseLeave={() => !isMobile && setHovered(false)}
            className={`${linkStyle} ${isAboutPage ? 'opacity-100' : 'opacity-70 hover:opacity-100'} transition-opacity duration-300`}
          >
            A propos
            {/* Underline animation */}
            {isAboutPage && (
              <motion.div 
                layoutId="underline-about"
                className="absolute -bottom-1 left-0 w-full h-[2px] bg-white"
              />
            )}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navigation;
