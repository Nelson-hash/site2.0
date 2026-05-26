import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCursor } from '../context/CursorContext';

interface NavigationProps {
  onMenuToggle?: (isOpen: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onMenuToggle }) => {
  const { setHovered, isMobile } = useCursor();
  const location = useLocation();
  const navigate = useNavigate();
  const [isFilmsMenuOpen, setIsFilmsMenuOpen] = useState(false);

  const isFilmsPage = location.pathname === '/films';
  const isAboutPage = location.pathname === '/about';

  const linkStyle = "font-bold tracking-widest uppercase text-4xl md:text-5xl relative group";

  const projects = {
    courts: [
      { title: "NUIT BLANCHE", status: "2025", isComingSoon: false },
      { title: "GUEULE D'ANGE", status: "2025", isComingSoon: false },
      { title: "PRESQUE JAUNE", status: "En post-production", isComingSoon: true }
    ],
    clips: [
      { title: "QISHUI PAPITEDDYBEAR\nFEAT PENSE", status: "2024", isComingSoon: false },
      { title: "CONVICTION ELIAS LCS", status: "2026", isComingSoon: false }
    ]
  };

  const handleMenuClick = () => {
    const newState = !isFilmsMenuOpen;
    setIsFilmsMenuOpen(newState);
    if (onMenuToggle) onMenuToggle(newState);
  };

  const handleProjectClick = (title: string) => {
    setIsFilmsMenuOpen(false);
    if (onMenuToggle) onMenuToggle(false);
    navigate('/films', { state: { targetFilm: title } });
  };

  return (
    <>
      <div className="fixed z-40 top-6 right-6 md:top-8 md:right-8 text-white mix-blend-difference pointer-events-none flex flex-col items-end">
        <div className="pointer-events-auto flex flex-col items-end">
          <button 
            onClick={handleMenuClick}
            onMouseEnter={() => !isMobile && setHovered(true)}
            onMouseLeave={() => !isMobile && setHovered(false)}
            className={`${linkStyle} ${isFilmsPage ? 'opacity-100' : 'opacity-70 hover:opacity-100'} transition-opacity duration-300 outline-none`}
          >
            Films
            {isFilmsPage && (
              <motion.div 
                layoutId="underline-films"
                className="absolute -bottom-1 right-0 w-full h-[3px] bg-white"
              />
            )}
          </button>

          <AnimatePresence>
            {isFilmsMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mt-8 relative flex flex-col items-end w-full"
              >
                <div className="absolute right-[5px] top-6 bottom-1 w-[2px] bg-white/20 rounded-t-full" />
                <div className="absolute right-[2px] -bottom-1 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-white/30" />

                {/* Courts-Métrages */}
                <div className="mb-12 w-full flex flex-col items-end">
                  <h3 className="text-xs md:text-sm font-bold opacity-40 tracking-widest uppercase mb-8 pr-8">
                    Courts-Métrages
                  </h3>
                  <ul className="space-y-8 w-full flex flex-col items-end">
                    {projects.courts.map((proj, idx) => (
                      <li key={idx} className="relative pr-8 group flex flex-col items-end">
                        <div className="absolute right-0 top-3 w-3 h-3 rounded-full bg-white/30 group-hover:bg-white group-hover:scale-125 transition-all duration-300 z-10" />
                        
                        <button 
                          onClick={() => !proj.isComingSoon && handleProjectClick(proj.title)}
                          onMouseEnter={() => !isMobile && !proj.isComingSoon && setHovered(true)}
                          onMouseLeave={() => !isMobile && !proj.isComingSoon && setHovered(false)}
                          className={`flex flex-col items-end text-right outline-none ${proj.isComingSoon ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <span className={`text-lg md:text-2xl font-extralight tracking-wide whitespace-pre-line leading-tight ${proj.isComingSoon ? 'opacity-40' : 'opacity-80 group-hover:opacity-100 transition-opacity'}`}>
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

                {/* Clips */}
                <div className="w-full flex flex-col items-end">
                  <h3 className="text-xs md:text-sm font-bold opacity-40 tracking-widest uppercase mb-8 pr-8">
                    Clips
                  </h3>
                  <ul className="space-y-8 w-full flex flex-col items-end">
                    {projects.clips.map((proj, idx) => (
                      <li key={idx} className="relative pr-8 group flex flex-col items-end">
                        <div className="absolute right-0 top-3 w-3 h-3 rounded-full bg-white/30 group-hover:bg-white group-hover:scale-125 transition-all duration-300 z-10" />
                        
                        <button 
                          onClick={() => !proj.isComingSoon && handleProjectClick(proj.title)}
                          onMouseEnter={() => !isMobile && !proj.isComingSoon && setHovered(true)}
                          onMouseLeave={() => !isMobile && !proj.isComingSoon && setHovered(false)}
                          className={`flex flex-col items-end text-right outline-none ${proj.isComingSoon ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <span className={`text-lg md:text-2xl font-extralight tracking-wide whitespace-pre-line leading-tight ${proj.isComingSoon ? 'opacity-40' : 'opacity-80 group-hover:opacity-100 transition-opacity'}`}>
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

      {/* A PROPOS */}
      <div className="fixed z-40 bottom-6 right-6 md:bottom-8 md:right-8 text-white mix-blend-difference pointer-events-none">
        <div className="pointer-events-auto">
          <Link 
            to="/about"
            onMouseEnter={() => !isMobile && setHovered(true)}
            onMouseLeave={() => !isMobile && setHovered(false)}
            className={`${linkStyle} ${isAboutPage ? 'opacity-100' : 'opacity-70 hover:opacity-100'} transition-opacity duration-300`}
          >
            A propos
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
