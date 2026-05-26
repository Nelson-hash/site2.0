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

  // Data structure updated to include the status/date
  const projects = {
    courts: [
      { title: "NUIT BLANCHE", status: "2025" },
      { title: "GUEULE D'ANGE", status: "2025" },
      { title: "PRESQUE JAUNE", status: "En post-production" }
    ],
    clips: [
      { title: "QISHUI PAPITEDDYBEAR FEAT PENSE", status: "2024" }
    ]
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
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mt-8 relative flex flex-col items-end w-full"
              >
                {/* Continuous Chronological Line */}
                <div className="absolute right-[5px] top-6 bottom-1 w-[2px] bg-white/20 rounded-t-full" />
                {/* Arrowhead at the bottom of the line */}
                <div className="absolute right-[2px] -bottom-1 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-white/30" />

                {/* Section 1: Courts-Métrages */}
                <div className="mb-12 w-full flex flex-col items-end">
                  <h3 className="text-xs md:text-sm font-bold opacity-40 tracking-widest uppercase mb-8 pr-8">
                    Courts-Métrages
                  </h3>
                  <ul className="space-y-8 w-full flex flex-col items-end">
                    {projects.courts.map((proj, idx) => (
                      <li key={idx} className="relative pr-8 group flex flex-col items-end">
                        {/* Dot on the timeline */}
                        <div className="absolute right-0 top-3 w-3 h-3 rounded-full bg-white/30 group-hover:bg-white group-hover:scale-125 transition-all duration-300 z-10" />
                        
                        <button 
                          onClick={handleProjectClick}
                          onMouseEnter={() => !isMobile && setHovered(true)}
                          onMouseLeave={() => !isMobile && setHovered(false)}
                          className="flex flex-col items-end text-right outline-none"
                        >
                          <span className="text-xl md:text-3xl font-extralight tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">
                            {proj.title}
                          </span>
                          <span className="text-[10px] md:text-xs font-bold opacity-40 mt-1 tracking-widest uppercase group-hover:opacity-70 transition-opacity">
                            {proj.status}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Section 2: Clips */}
                <div className="w-full flex flex-col items-end">
                  <h3 className="text-xs md:text-sm font-bold opacity-40 tracking-widest uppercase mb-8 pr-8">
                    Clips
                  </h3>
                  <ul className="space-y-8 w-full flex flex-col items-end">
                    {projects.clips.map((proj, idx) => (
                      <li key={idx} className="relative pr-8 group flex flex-col items-end">
                        {/* Dot on the timeline */}
                        <div className="absolute right-0 top-3 w-3 h-3 rounded-full bg-white/30 group-hover:bg-white group-hover:scale-125 transition-all duration-300 z-10" />
                        
                        <button 
                          onClick={handleProjectClick}
                          onMouseEnter={() => !isMobile && setHovered(true)}
                          onMouseLeave={() => !isMobile && setHovered(false)}
                          className="flex flex-col items-end text-right outline-none"
                        >
                          <span className="text-xl md:text-3xl font-extralight tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">
                            {proj.title}
                          </span>
                          <span className="text-[10px] md:text-xs font-bold opacity-40 mt-1 tracking-widest uppercase group-hover:opacity-70 transition-opacity">
                            {proj.status}
                          </span>
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
