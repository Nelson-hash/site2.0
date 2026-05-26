import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCursor } from '../context/CursorContext';

const Navigation: React.FC = () => {
  const { setHovered, isMobile } = useCursor();
  const location = useLocation();
  const navigate = useNavigate();
  const [isFilmsMenuOpen, setIsFilmsMenuOpen] = useState(false);

  const isFilmsPage = location.pathname === '/films';
  const isAboutPage = location.pathname === '/about';

  // HELPER: Font style - Bold, Uppercase, 2x Bigger size
  const linkStyle = "font-bold tracking-widest uppercase text-4xl md:text-5xl relative group";

  const projects = {
    courts: ["NUIT BLANCHE", "GUEULE D'ANGE", "PRESQUE JAUNE"],
    clips: ["QISHUI PAPITEDDYBEAR FEAT PENSE"]
  };

  const handleProjectClick = () => {
    setIsFilmsMenuOpen(false); // Close menu on click
    navigate('/films');
  };

  return (
    <>
      {/* LINK 1: FILMS (Top Right + Dropdown Menu) */}
      <div className="fixed z-40 top-6 right-6 md:top-8 md:right-8 text-white mix-blend-difference pointer-events-none flex flex-col items-end">
        <div className="pointer-events-auto flex flex-col items-end">
          <button 
            onClick={() => setIsFilmsMenuOpen(!isFilmsMenuOpen)}
            onMouseEnter={() => !isMobile && setHovered(true)}
            onMouseLeave={() => !isMobile && setHovered(false)}
            className={`${linkStyle} ${isFilmsPage ? 'opacity-100' : 'opacity-70 hover:opacity-100'} transition-opacity duration-300 outline-none`}
          >
            Films
            {/* Underline animation */}
            {isFilmsPage && (
              <motion.div 
                layoutId="underline-films"
                className="absolute -bottom-1 right-0 w-full h-[3px] bg-white"
              />
            )}
          </button>

          {/* Vertical Menu Déroulant */}
          <AnimatePresence>
            {isFilmsMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mt-6 flex flex-col items-end text-right space-y-6"
              >
                {/* Section 1: Courts-Métrages */}
                <div>
                  <h3 className="text-sm md:text-base font-bold opacity-50 tracking-widest uppercase mb-2 border-b border-white/30 pb-1">
                    Courts-Métrages
                  </h3>
                  <ul className="space-y-1">
                    {projects.courts.map((proj, idx) => (
                      <li key={idx}>
                        <button 
                          onClick={handleProjectClick}
                          onMouseEnter={() => !isMobile && setHovered(true)}
                          onMouseLeave={() => !isMobile && setHovered(false)}
                          className="text-xl md:text-2xl font-light tracking-wide opacity-70 hover:opacity-100 transition-opacity"
                        >
                          {proj}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Section 2: Clips */}
                <div>
                  <h3 className="text-sm md:text-base font-bold opacity-50 tracking-widest uppercase mb-2 border-b border-white/30 pb-1">
                    Clips
                  </h3>
                  <ul className="space-y-1">
                    {projects.clips.map((proj, idx) => (
                      <li key={idx}>
                        <button 
                          onClick={handleProjectClick}
                          onMouseEnter={() => !isMobile && setHovered(true)}
                          onMouseLeave={() => !isMobile && setHovered(false)}
                          className="text-xl md:text-2xl font-light tracking-wide opacity-70 hover:opacity-100 transition-opacity"
                        >
                          {proj}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* LINK 2: A PROPOS (Bottom Right) */}
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
                className="absolute -bottom-1 right-0 w-full h-[3px] bg-white"
              />
            )}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navigation;
