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
  const isCommercialPage = location.pathname === '/commercial';

  const linkStyle = "font-bold tracking-widest uppercase text-2xl sm:text-4xl md:text-5xl relative group";

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

  const closeMenu = () => {
    setIsFilmsMenuOpen(false);
    if (onMenuToggle) onMenuToggle(false);
  };

  const handleProjectClick = (title: string) => {
    closeMenu();
    navigate('/films', { state: { targetFilm: title } });
  };

  return (
    <>
      {/* FOND FLOUTÉ SUR MOBILE QUAND LE MENU FILMS EST OUVERT */}
      <AnimatePresence>
        {isFilmsMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMenu}
            className="fixed inset-0 z-30 bg-black/75 backdrop-blur-md md:bg-black/40 md:backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* COMMERCIAL / PUBS (En haut à gauche) */}
      <div className="fixed z-40 top-6 left-6 md:top-8 md:left-8 text-white mix-blend-difference pointer-events-none">
        <div className="pointer-events-auto">
          <Link 
            to="/commercial"
            onMouseEnter={() => !isMobile && setHovered(true)}
            onMouseLeave={() => !isMobile && setHovered(false)}
            className={`${linkStyle} ${isCommercialPage ? 'opacity-100' : 'opacity-75 hover:opacity-100'} transition-opacity duration-300`}
          >
            <span className="md:hidden">Pubs</span>
            <span className="hidden md:inline">Commercial</span>
            
            {isCommercialPage && (
              <motion.div 
                layoutId="underline-commercial"
                className="absolute -bottom-1 left-0 w-full h-[2px] md:h-[3px] bg-white"
              />
            )}
          </Link>
        </div>
      </div>

      {/* FILMS (En haut à droite) */}
      <div className="fixed z-40 top-6 right-6 md:top-8 md:right-8 text-white mix-blend-difference pointer-events-none flex flex-col items-end">
        <div className="pointer-events-auto flex flex-col items-end">
          <button 
            onClick={handleMenuClick}
            onMouseEnter={() => !isMobile && setHovered(true)}
            onMouseLeave={() => !isMobile && setHovered(false)}
            className={`${linkStyle} ${isFilmsPage || isFilmsMenuOpen ? 'opacity-100' : 'opacity-75 hover:opacity-100'} transition-opacity duration-300 outline-none`}
          >
            {isFilmsMenuOpen ? 'Fermer ✕' : 'Films'}
            {isFilmsPage && !isFilmsMenuOpen && (
              <motion.div 
                layoutId="underline-films"
                className="absolute -bottom-1 right-0 w-full h-[2px] md:h-[3px] bg-white"
              />
            )}
          </button>

          <AnimatePresence>
            {isFilmsMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="mt-6 md:mt-8 relative flex flex-col items-end w-full max-h-[75vh] overflow-y-auto no-scrollbar pr-1"
              >
                <div className="absolute right-[9px] top-4 bottom-2 w-[1.5px] bg-white/25 rounded-full" />

                {/* Courts-Métrages */}
                <div className="mb-8 md:mb-10 w-full flex flex-col items-end">
                  <h3 className="text-[11px] md:text-xs font-bold opacity-40 tracking-widest uppercase mb-5 md:mb-6 pr-7">
                    Courts-Métrages
                  </h3>
                  <ul className="space-y-5 md:space-y-6 w-full flex flex-col items-end">
                    {projects.courts.map((proj, idx) => (
                      <li key={idx} className="relative pr-7 group flex flex-col items-end">
                        <div className="absolute right-1 top-2.5 w-2.5 h-2.5 rounded-full bg-white/40 group-hover:bg-white group-hover:scale-125 transition-all duration-300 z-10" />
                        
                        <button 
                          onClick={() => !proj.isComingSoon && handleProjectClick(proj.title)}
                          onMouseEnter={() => !isMobile && !proj.isComingSoon && setHovered(true)}
                          onMouseLeave={() => !isMobile && !proj.isComingSoon && setHovered(false)}
                          className={`flex flex-col items-end text-right outline-none ${proj.isComingSoon ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <span className={`text-base sm:text-lg md:text-2xl font-light tracking-wide whitespace-pre-line leading-tight ${proj.isComingSoon ? 'opacity-40' : 'opacity-85 group-hover:opacity-100 transition-opacity'}`}>
                            {proj.title}
                          </span>
                          <span className="text-[10px] md:text-xs font-bold opacity-40 mt-1 tracking-widest uppercase group-hover:opacity-75 transition-opacity">
                            {proj.status}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Clips */}
                <div className="w-full flex flex-col items-end pb-4">
                  <h3 className="text-[11px] md:text-xs font-bold opacity-40 tracking-widest uppercase mb-5 md:mb-6 pr-7">
                    Clips
                  </h3>
                  <ul className="space-y-5 md:space-y-6 w-full flex flex-col items-end">
                    {projects.clips.map((proj, idx) => (
                      <li key={idx} className="relative pr-7 group flex flex-col items-end">
                        <div className="absolute right-1 top-2.5 w-2.5 h-2.5 rounded-full bg-white/40 group-hover:bg-white group-hover:scale-125 transition-all duration-300 z-10" />
                        
                        <button 
                          onClick={() => !proj.isComingSoon && handleProjectClick(proj.title)}
                          onMouseEnter={() => !isMobile && !proj.isComingSoon && setHovered(true)}
                          onMouseLeave={() => !isMobile && !proj.isComingSoon && setHovered(false)}
                          className={`flex flex-col items-end text-right outline-none ${proj.isComingSoon ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <span className={`text-base sm:text-lg md:text-2xl font-light tracking-wide whitespace-pre-line leading-tight ${proj.isComingSoon ? 'opacity-40' : 'opacity-85 group-hover:opacity-100 transition-opacity'}`}>
                            {proj.title}
                          </span>
                          <span className="text-[10px] md:text-xs font-bold opacity-40 mt-1 tracking-widest uppercase group-hover:opacity-75 transition-opacity">
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

      {/* À PROPOS (En bas à droite) */}
      <div className="fixed z-40 bottom-5 right-6 md:bottom-8 md:right-8 text-white mix-blend-difference pointer-events-none">
        <div className="pointer-events-auto">
          <Link 
            to="/about"
            onMouseEnter={() => !isMobile && setHovered(true)}
            onMouseLeave={() => !isMobile && setHovered(false)}
            className={`${linkStyle} ${isAboutPage ? 'opacity-100' : 'opacity-75 hover:opacity-100'} transition-opacity duration-300`}
          >
            À propos
            {isAboutPage && (
              <motion.div 
                layoutId="underline-about"
                className="absolute -bottom-1 right-0 w-full h-[2px] md:h-[3px] bg-white"
              />
            )}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navigation;
