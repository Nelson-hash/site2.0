import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';

const Navigation: React.FC = () => {
  const { setHovered, isMobile } = useCursor();
  const location = useLocation();

  const isFilmsPage = location.pathname === '/films';
  const isAboutPage = location.pathname === '/about';

  // HELPER: Defines the font style for the menu links.
  // Currently set to 'font-bold' per your request.
  // change 'font-bold' to 'font-light' if you want it to match the "Films" page headers exactly.
  const linkStyle = "font-bold tracking-widest uppercase text-sm md:text-base relative group";

  return (
    <nav className="fixed top-0 left-0 w-full p-4 md:p-8 z-40 flex justify-between items-start pointer-events-none text-white mix-blend-difference">
      
      {/* LEFT LINK: FILMS */}
      <div className="pointer-events-auto">
        <Link 
          to="/films"
          onMouseEnter={() => !isMobile && setHovered(true)}
          onMouseLeave={() => !isMobile && setHovered(false)}
          className={`${linkStyle} ${isFilmsPage ? 'opacity-100' : 'opacity-60 hover:opacity-100'} transition-opacity duration-300`}
        >
          Films
          {/* Underline animation for active state */}
          {isFilmsPage && (
            <motion.div 
              layoutId="underline"
              className="absolute -bottom-1 left-0 w-full h-[1px] bg-white"
            />
          )}
        </Link>
      </div>

      {/* RIGHT LINK: A PROPOS */}
      <div className="pointer-events-auto">
        <Link 
          to="/about"
          onMouseEnter={() => !isMobile && setHovered(true)}
          onMouseLeave={() => !isMobile && setHovered(false)}
          className={`${linkStyle} ${isAboutPage ? 'opacity-100' : 'opacity-60 hover:opacity-100'} transition-opacity duration-300`}
        >
          A propos
           {/* Underline animation for active state */}
           {isAboutPage && (
            <motion.div 
              layoutId="underline"
              className="absolute -bottom-1 left-0 w-full h-[1px] bg-white"
            />
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
