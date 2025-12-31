import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion'; // Added PanInfo
import { useCursor } from '../context/CursorContext';
import HomeLink from '../components/HomeLink';

// --- INTERFACES ---
interface Film {
  title: string;
  year: string;
  image: string;
  description: string;
  gallery?: string[]; 
  team: {
    main: string[];
    additional?: string[];
  };
  link?: string;
  theme: {
    background: string;
    text: string;
    accent: string;
  };
}

// --- UTILITIES ---
class ImageLoader {
  private static cache = new Map<string, HTMLImageElement>();
  private static loadingPromises = new Map<string, Promise<HTMLImageElement>>();

  static async loadImage(src: string, priority: 'high' | 'low' = 'low'): Promise<HTMLImageElement> {
    if (this.cache.has(src)) return this.cache.get(src)!;
    if (this.loadingPromises.has(src)) return this.loadingPromises.get(src)!;

    const loadingPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      const cleanup = () => this.loadingPromises.delete(src);

      img.onload = () => {
        this.cache.set(src, img);
        cleanup();
        resolve(img);
      };
      img.onerror = () => {
        cleanup();
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.decoding = 'async';
      img.loading = 'eager';
      if (priority === 'high' && 'fetchPriority' in img) {
        (img as any).fetchPriority = 'high';
      }
      img.src = src;
    });

    this.loadingPromises.set(src, loadingPromise);
    return loadingPromise;
  }

  static preloadImages(sources: string[]) {
    sources.forEach((src, index) => {
      this.loadImage(src, index === 0 ? 'high' : 'low').catch(() => {
        console.warn(`Failed to preload: ${src}`);
      });
    });
  }
}

// --- MAIN COMPONENT ---
const Films: React.FC = () => {
  const { setHovered, isMobile } = useCursor();
  const [activeFilm, setActiveFilm] = useState<Film | null>(null);  
  const [clickedFilm, setClickedFilm] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<Map<string, boolean>>(new Map());
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  
  // -- Lightbox State --
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const mountedRef = useRef(true);
  
  const upcomingFilms: Film[] = [
    { 
      title: "NUIT BLANCHE", 
      year: "2025",
      image: "/images/films/nuit-blanche.jpg",
      gallery: [
        "/images/films/nuit-blanche.jpg",
        "/images/films/nuit-blanche2.jpg",
        "/images/films/nuit-blanche3.jpg",
        "/images/films/nuit-blanche4.jpg"
      ],
      description: "Julien et Marie vont passer le week-end à la campagne, dans la maison de famille de Marie, où les attendent ses trois frères et sœurs. Tandis que les bouteilles défilent et que la soirée bat son plein, un drame se produit.",
      team: {
        main: [
          "Production : Horus Productions",
          "Coproduction : Studio Méricourt & Ulysse Arnal"
        ],
        additional: [
          "Cast : Tess Lepreux-Alles, Philippe Bertrand, Elise De Gaudemaris, Alban Pellet, Stanislas Bizeu, Christelle Ribeiro",
          "Continuité : Carla De Almeida Pinto",
          "Éclairage : Axel Peylet",
          "Image : Léo Lacan, assisté par Thibault Lienhardt",
          "Machinerie : Aristote Pham-Ba",
          "Maquillage : Marie Haegeman",
          "Musique : Pierre Bernier",
          "Post-production : Jonathan Le Borgne, Tristan Villeboux, Maxime Bardou",
          "Réalisation : Augustin Arnal, assisté par Justin Féral",
          "Régie : Jonah Webb, Alex Jourdan, Piotr",
          "Scénario : Augustin Arnal",
          "Son : Ancelin Audebert, Joffrey Duquenne, Mattias Thomas"
        ]
      },
      theme: {
        background: "#ffffff",
        text: "#000000",
        accent: "#555555"
      }
    },
    { 
      title: "GUEULE D'ANGE", 
      year: "2025",
      image: "/images/films/gueule-dange.jpg",
      gallery: [
        "/images/films/gueule-dange.jpg",
        "/images/films/gueule-dange2.jpg",
        "/images/films/gueule-dange3.jpg"
      ],
      description: "Lors d'un dîner mondain, Dorian perd un bout de sa lèvre. Il s'éclipse pour aller voir -Le Portrait- avec qui il semble partager un lien obscur et vital.",
      team: {
        main: [
          "Production : Horus Productions",
          "Réalisation & Scenario : Jonas Aragones"
        ],
        additional: [
          "Cast : Adrien Aucouturier, Joel Grimaud, Capucine Denis, Melvil Termini, Eliott Manning, Naoufel Bas, Robin Calmels, Paula Carpenter",
          "Réalisation : Jonas Aragones, assisté par Gil Ingrand",
          "Maquillage : Candice Thro, Elsa Desurvire",
          "Continuité : Gena",
          "Régie : Nathan Deymié, assisté par Nils Archi",
          "Image : Marta Romanzo, assistée par Jonas Bellaiche",
          "Machinerie : Kellyan",
          "Décoration : Félix Spinosi, assisté par Jawel Coudert",
          "Costumes : Violette Novat"
        ]
      },
      theme: {
        background: "#f0efed", 
        text: "#1a1a1a",        
        accent: "#757575"      
      }
    }
  ];
  
  const pastFilms: Film[] = [
    { 
      title: "QISHUI PAPITEDDYBEAR FEAT PENSE", 
      year: "2024",
      image: "/images/films/qishui.jpg",
      description: "QISHUI 1er extrait de LA CHAUFFE, EP commun entre PAPI TEDDY BEAR et PenseMusic‬",
      team: {
        main: [
          "Production : Horus Productions",
          "Son : Papiteddybear & Pense",
          "Image : Gabhus"
        ]
      },
      link: "https://www.youtube.com/watch?v=J_wA4imVTlg",
      theme: {
        background: "#d8e1e8",
        text: "#1a2a38",
        accent: "#7096b8"
      }
    }
  ];

  // Reset scroll position
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Preload images
  useEffect(() => {
    const allFilms = [...upcomingFilms, ...pastFilms];
    const imageSources = allFilms.map(film => film.image);
    ImageLoader.preloadImages(imageSources);
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen || !activeFilm || !activeFilm.gallery) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextLightboxImage();
      } else if (e.key === 'ArrowLeft') {
        prevLightboxImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, activeFilm, lightboxIndex]);

  const handleFilmClick = useCallback(async (film: Film) => {
    if (!mountedRef.current) return;
    setLoadingStates(prev => new Map(prev.set(film.image, true)));

    try {
      await ImageLoader.loadImage(film.image, 'high');
      if (mountedRef.current) {
        setActiveFilm(film);
        setLoadingStates(prev => new Map(prev.set(film.image, false)));
      }
    } catch (error) {
      console.error(`Failed to load film image: ${film.image}`, error);
      if (mountedRef.current) {
        setLoadingStates(prev => new Map(prev.set(film.image, false)));
      }
    }

    if (isMobile) {
      setHovered(true);
      setTimeout(() => setHovered(false), 300);
    }
  }, [isMobile, setHovered]);

  const toggleTeamExpansion = useCallback((filmTitle: string) => {
    setExpandedTeam(prev => prev === filmTitle ? null : filmTitle);
  }, []);

  const handleLinkClick = useCallback((film: Film) => {
    if (film.link) {
      if (isMobile) {
        if (clickedFilm === film.title) {
          window.open(film.link, '_blank');
          setClickedFilm(null);
        } else {
          setClickedFilm(film.title);
        }
      } else {
        window.open(film.link, '_blank');
      }
    }
  }, [isMobile, clickedFilm]);

  // -- Lightbox Logic --
  const openLightbox = () => {
    if (activeFilm && activeFilm.gallery && activeFilm.gallery.length > 0) {
      setLightboxIndex(0);
      setIsLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextLightboxImage = () => {
    if (activeFilm && activeFilm.gallery) {
      setLightboxIndex((prev) => (prev + 1) % activeFilm.gallery!.length);
    }
  };

  const prevLightboxImage = () => {
    if (activeFilm && activeFilm.gallery) {
      setLightboxIndex((prev) => (prev - 1 + activeFilm.gallery!.length) % activeFilm.gallery!.length);
    }
  };

  // -- Swipe Logic for Framer Motion --
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      nextLightboxImage();
    } else if (swipe > swipeConfidenceThreshold) {
      prevLightboxImage();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const isImageLoading = activeFilm ? loadingStates.get(activeFilm.image) || false : false;

  return (
    <motion.div
      className="min-h-screen w-screen flex flex-col items-center justify-center relative overflow-auto"
      animate={{
        backgroundColor: activeFilm ? activeFilm.theme.background : "#000000",
        color: activeFilm ? activeFilm.theme.text : "#ffffff",
        transition: { duration: 0.2, ease: "easeOut" }
      }}
    >
      <div className="fixed top-0 left-0 right-0 z-30 p-4 md:p-8 flex justify-start items-start">
        <HomeLink />
      </div>
      
      <div className="w-full max-w-7xl flex flex-col md:flex-row pt-20 md:pt-16 px-4 md:px-8 pb-8 md:items-center md:justify-center md:min-h-screen">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full md:w-2/5 space-y-8 md:space-y-16 mb-8 md:mb-0 md:flex md:flex-col md:justify-center"
        >
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl md:text-4xl font-light mb-6 md:mb-8 tracking-wide films-section-header">COURTS-METRAGES</h2>
            <div className="space-y-4 md:space-y-6">
              {upcomingFilms.map((film, index) => (
                <motion.div
                  key={index}
                  className="cursor-pointer py-2"
                  onMouseEnter={() => !isMobile && (setHovered(true), handleFilmClick(film))}
                  onMouseLeave={() => !isMobile && setHovered(false)}
                  onClick={() => { handleFilmClick(film); handleLinkClick(film); }}
                  whileHover={{ x: isMobile ? 0 : 20 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <h3 className="text-lg md:text-2xl font-light tracking-wide">
                    {film.title} 
                    <span className="ml-4 transition-colors duration-150 ease-out"
                      style={{ color: activeFilm?.title === film.title ? activeFilm.theme.accent : "#aaaaaa" }}>
                      {film.year}
                    </span>
                  </h3>
                </motion.div>
              ))}
            </div>
          </motion.section>
          
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl md:text-4xl font-light mb-6 md:mb-8 tracking-wide films-section-header">CLIPS</h2>
            <div className="space-y-4 md:space-y-6">
              {pastFilms.map((film, index) => (
                <motion.div
                  key={index}
                  className="cursor-pointer py-2"
                  onMouseEnter={() => !isMobile && (setHovered(true), handleFilmClick(film))}
                  onMouseLeave={() => !isMobile && setHovered(false)}
                  onClick={() => { handleFilmClick(film); handleLinkClick(film); }}
                  whileHover={{ x: isMobile ? 0 : 20 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex flex-col">
                    <h3 className="text-lg md:text-2xl font-light tracking-wide">
                      {film.title} 
                      <span className="ml-4 transition-colors duration-150 ease-out"
                        style={{ color: activeFilm?.title === film.title ? activeFilm.theme.accent : "#aaaaaa" }}>
                        {film.year}
                      </span>
                    </h3>
                    {isMobile && film.link && clickedFilm === film.title && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm opacity-60 mt-1"
                      >
                        Cliquez à nouveau pour ouvrir
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </motion.div>

        <div className="w-full md:w-3/5 md:pl-16 min-h-[300px] md:min-h-[500px] relative">
          {(activeFilm || isImageLoading) && (
            <div className="absolute inset-0 flex flex-col items-center md:items-start justify-start md:justify-start p-4 pt-8 md:pt-4">
              {isImageLoading ? (
                <div className="flex flex-col items-center justify-center animate-fade-in">
                  <div className="w-full max-w-md md:max-w-lg aspect-video bg-gradient-to-br from-gray-800/20 to-gray-900/20 rounded-lg mb-6 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white/80 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-sm opacity-60">Chargement de l'image...</p>
                </div>
              ) : activeFilm ? (
                <div className="animate-fade-in w-full">
                  <div className="flex flex-col md:flex-row md:gap-8">
                    <div className="w-full md:w-3/5 flex-shrink-0 mb-6 md:mb-0">
                      
                      {/* --- CLICKABLE IMAGE --- */}
                      <div 
                        className={`w-full aspect-video overflow-hidden rounded-lg mb-4 ${activeFilm.gallery ? 'cursor-zoom-in' : ''}`}
                        onClick={openLightbox}
                      >
                        <img 
                          src={activeFilm.image}
                          alt={activeFilm.title} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          style={{ opacity: 1, objectFit: 'cover' }}
                        />
                      </div>
                      {activeFilm.gallery && activeFilm.gallery.length > 0 && (
                        <p className="text-xs text-center mb-2 opacity-50 italic">
                          (Cliquez sur l'image pour voir la galerie)
                        </p>
                      )}
                      
                      <div className="w-full">
                        <p className="text-sm md:text-lg leading-relaxed text-center md:text-justify opacity-90">
                          {activeFilm.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-2/5 flex flex-col justify-start">
                      <h4 className="text-xs md:text-sm font-light tracking-wider opacity-70 mb-3 uppercase text-center md:text-left">
                        Équipe
                      </h4>
                      <div className="min-h-[200px] md:min-h-[300px]">
                        <div className="space-y-1 text-center md:text-left">
                          {/* --- MAIN TEAM RENDER (Updated Styles) --- */}
                          {activeFilm.team.main.map((member, index) => {
                            const [role, name] = member.split(' : ');
                            return (
                              <p key={index} className="text-xs md:text-sm leading-relaxed" 
                                style={{ color: activeFilm.theme.text }}>
                                <span className="font-bold">{role} :</span>{' '}
                                <span className="font-normal">{name}</span>
                              </p>
                            );
                          })}
                          
                          {activeFilm.team.additional && (
                            <>
                              <button
                                onClick={() => toggleTeamExpansion(activeFilm.title)}
                                onMouseEnter={() => !isMobile && setHovered(true)}
                                onMouseLeave={() => !isMobile && setHovered(false)}
                                className="text-xs md:text-sm opacity-60 hover:opacity-100 transition-opacity mt-2 underline"
                                style={{ color: activeFilm.theme.accent }}
                              >
                                {expandedTeam === activeFilm.title ? 'Lire moins' : 'Lire plus'}
                              </button>
                              
                              {/* --- ADDITIONAL TEAM RENDER (Updated Styles) --- */}
                              {expandedTeam === activeFilm.title && (
                                <div className="space-y-1 mt-3 pt-2 border-t border-opacity-20" style={{ borderColor: activeFilm.theme.text }}>
                                  {activeFilm.team.additional.map((member, index) => {
                                    const [role, name] = member.split(' : ');
                                    return (
                                      <p key={index} className="text-xs md:text-sm leading-relaxed" style={{ color: activeFilm.theme.text }}>
                                        <span className="font-bold">{role} :</span>{' '}
                                        <span className="font-normal">{name}</span>
                                      </p>
                                    );
                                  })}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {isLightboxOpen && activeFilm && activeFilm.gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 text-white/70 hover:text-white z-50 p-2"
              onClick={closeLightbox}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Left Arrow (Hide on mobile usually, but kept for clarity) */}
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 z-50 hidden md:block"
              onClick={(e) => { e.stopPropagation(); prevLightboxImage(); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* Main Image with Swipe Support */}
            <div 
              className="relative w-full h-full flex items-center justify-center p-8 md:p-12"
              onClick={(e) => e.stopPropagation()} 
            >
              <motion.img
                key={lightboxIndex}
                src={activeFilm.gallery[lightboxIndex]}
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 0 }}
                transition={{ duration: 0.3 }}
                
                // Swipe Properties
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={handleDragEnd}
                
                alt={`${activeFilm.title} screenshot ${lightboxIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm cursor-grab active:cursor-grabbing"
              />
              
              {/* Counter */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm font-light tracking-widest pointer-events-none">
                {lightboxIndex + 1} / {activeFilm.gallery.length}
              </div>
            </div>

            {/* Right Arrow */}
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 z-50 hidden md:block"
              onClick={(e) => { e.stopPropagation(); nextLightboxImage(); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default Films;
