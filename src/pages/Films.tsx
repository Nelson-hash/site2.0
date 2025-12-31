import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
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
  
  // -- Lightbox / Slider State --
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 

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

  // Reset scroll position on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    return () => { mountedRef.current = false; };
  }, []);

  // Preload images
  useEffect(() => {
    const allFilms = [...upcomingFilms, ...pastFilms];
    const imageSources = allFilms.map(film => film.image);
    ImageLoader.preloadImages(imageSources);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!activeFilm) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) closeLightbox();
        else handleBackToList();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, activeFilm, currentImageIndex]);

  // Handle Scroll Reset when Active Film Changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeFilm]);

  const handleFilmClick = useCallback(async (film: Film) => {
    if (!mountedRef.current) return;
    setLoadingStates(prev => new Map(prev.set(film.image, true)));
    
    // Reset slider index when opening a film
    setCurrentImageIndex(0);

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
  }, []);

  const handleBackToList = useCallback(() => {
    setActiveFilm(null);
    setExpandedTeam(null);
    setClickedFilm(null);
  }, []);

  const toggleTeamExpansion = useCallback((filmTitle: string) => {
    setExpandedTeam(prev => prev === filmTitle ? null : filmTitle);
  }, []);

  const handleLinkClick = useCallback((film: Film) => {
    if (film.link) {
        window.open(film.link, '_blank');
    }
  }, []);

  // -- Image Navigation Logic --
  const nextImage = () => {
    if (activeFilm && activeFilm.gallery) {
      setCurrentImageIndex((prev) => (prev + 1) % activeFilm.gallery!.length);
    }
  };

  const prevImage = () => {
    if (activeFilm && activeFilm.gallery) {
      setCurrentImageIndex((prev) => (prev - 1 + activeFilm.gallery!.length) % activeFilm.gallery!.length);
    }
  };

  const openLightbox = () => {
    if (activeFilm && activeFilm.gallery && activeFilm.gallery.length > 0) {
      setIsLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  // -- Swipe Logic --
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      nextImage();
    } else if (swipe > swipeConfidenceThreshold) {
      prevImage();
    }
  };

  const isImageLoading = activeFilm ? loadingStates.get(activeFilm.image) || false : false;

  const currentImageSrc = activeFilm 
    ? (activeFilm.gallery ? activeFilm.gallery[currentImageIndex] : activeFilm.image)
    : "";

  return (
    <motion.div
      className="min-h-screen w-screen flex flex-col relative overflow-x-hidden"
      animate={{
        backgroundColor: activeFilm ? activeFilm.theme.background : "#000000",
        color: activeFilm ? activeFilm.theme.text : "#ffffff",
        transition: { duration: 0.4, ease: "easeOut" }
      }}
    >
      <div className="fixed top-0 left-0 right-0 z-30 p-4 md:p-8 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <HomeLink />
        </div>
        
        {/* Back Button */}
        <AnimatePresence>
          {activeFilm && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={handleBackToList}
              className="pointer-events-auto text-sm md:text-base font-light tracking-widest uppercase hover:opacity-60 transition-opacity"
              style={{ color: activeFilm.theme.text }}
            >
              Retour / Back
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      <div className="w-full max-w-7xl mx-auto flex-grow flex flex-col justify-center pt-24 pb-12 px-4 md:px-8 min-h-screen">
        
        <AnimatePresence mode="wait">
          
          {/* --- LIST VIEW --- */}
          {!activeFilm ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="w-full flex flex-col md:flex-row md:items-start md:justify-center gap-16 md:gap-32"
            >
              {/* Short Films */}
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-end text-center md:text-right">
                <h2 className="text-xl md:text-3xl font-light mb-8 tracking-wide border-b border-white/20 pb-2">COURTS-METRAGES</h2>
                <div className="space-y-6">
                  {upcomingFilms.map((film, index) => (
                    <motion.div
                      key={index}
                      className="cursor-pointer group"
                      onMouseEnter={() => !isMobile && setHovered(true)}
                      onMouseLeave={() => !isMobile && setHovered(false)}
                      onClick={() => handleFilmClick(film)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <h3 className="text-2xl md:text-4xl font-extralight tracking-widest group-hover:text-gray-400 transition-colors">
                        {film.title}
                      </h3>
                      <span className="text-sm text-gray-500">{film.year}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Clips - FIX APPLIED HERE: Only handleFilmClick, removed handleLinkClick */}
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                <h2 className="text-xl md:text-3xl font-light mb-8 tracking-wide border-b border-white/20 pb-2">CLIPS</h2>
                <div className="space-y-6">
                  {pastFilms.map((film, index) => (
                    <motion.div
                      key={index}
                      className="cursor-pointer group"
                      onMouseEnter={() => !isMobile && setHovered(true)}
                      onMouseLeave={() => !isMobile && setHovered(false)}
                      // UPDATED: Now it only opens the project view first
                      onClick={() => handleFilmClick(film)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <h3 className="text-2xl md:text-4xl font-extralight tracking-widest group-hover:text-gray-400 transition-colors">
                        {film.title}
                      </h3>
                      <span className="text-sm text-gray-500">{film.year}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* --- DETAIL VIEW --- */
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full h-full flex flex-col items-center"
            >
              {/* Title Header */}
              <div className="w-full text-center mb-8 md:mb-12">
                 <h1 className="text-3xl md:text-6xl font-light tracking-widest uppercase mb-2">
                   {activeFilm.title}
                 </h1>
                 <p className="text-sm md:text-lg opacity-60 tracking-wide">{activeFilm.year}</p>
              </div>

              <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-center max-w-6xl">
                
                {/* --- LEFT COLUMN: IMAGE / SLIDER --- */}
                <div className="w-full lg:w-2/3 relative">
                  {isImageLoading ? (
                    <div className="aspect-video w-full bg-black/10 animate-pulse rounded-sm flex items-center justify-center">
                       <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="relative w-full aspect-video overflow-hidden rounded-sm group select-none">
                      <motion.img 
                        key={currentImageIndex} 
                        src={currentImageSrc}
                        alt={activeFilm.title}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                        onClick={openLightbox}
                        className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
                      />

                      {/* On-Page Navigation Arrows */}
                      {activeFilm.gallery && activeFilm.gallery.length > 1 && (
                        <>
                          <button 
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                          >
                             ←
                          </button>
                          <button 
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                          >
                             →
                          </button>
                          {/* Dots Indicator */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {activeFilm.gallery.map((_, idx) => (
                              <div 
                                key={idx} 
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* --- RIGHT COLUMN: INFO --- */}
                <div className="w-full lg:w-1/3 flex flex-col gap-8">
                  
                  {/* Description */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Synopsis</h3>
                    <p className="text-sm md:text-base leading-relaxed opacity-90 text-justify">
                      {activeFilm.description}
                    </p>
                    
                    {/* External Link Button */}
                    {activeFilm.link && (
                      <div className="mt-4">
                        <button 
                          onClick={() => handleLinkClick(activeFilm)}
                          className="text-sm border-b border-current pb-0.5 hover:opacity-50 transition-opacity"
                        >
                          Voir le projet ↗
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Team */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Crédits</h3>
                    <div className="space-y-1.5">
                       {activeFilm.team.main.map((member, index) => {
                          const [role, name] = member.split(' : ');
                          return (
                            <p key={index} className="text-sm leading-relaxed">
                              <span className="font-bold">{role} :</span> <span className="opacity-90">{name}</span>
                            </p>
                          );
                       })}
                       
                       {activeFilm.team.additional && (
                          <>
                             <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedTeam === activeFilm.title ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                <div className="space-y-1.5 pt-2 border-t border-black/10 dark:border-white/10">
                                   {activeFilm.team.additional.map((member, index) => {
                                      const [role, name] = member.split(' : ');
                                      return (
                                        <p key={index} className="text-sm leading-relaxed">
                                          <span className="font-bold">{role} :</span> <span className="opacity-90">{name}</span>
                                        </p>
                                      );
                                   })}
                                </div>
                             </div>
                             <button
                               onClick={() => toggleTeamExpansion(activeFilm.title)}
                               className="text-xs opacity-50 hover:opacity-100 mt-2 underline decoration-dotted underline-offset-4"
                             >
                               {expandedTeam === activeFilm.title ? '- Réduire les crédits' : '+ Tous les crédits'}
                             </button>
                          </>
                       )}
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {isLightboxOpen && activeFilm && activeFilm.gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={closeLightbox}
          >
            <button className="absolute top-4 right-4 text-white/70 hover:text-white p-4 z-50">
               ✕
            </button>

            <div 
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} 
            >
              <motion.img
                key={currentImageIndex}
                src={activeFilm.gallery[currentImageIndex]}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={handleDragEnd}
                className="max-w-[95%] max-h-[90vh] object-contain cursor-grab active:cursor-grabbing shadow-2xl"
              />
               <button 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-6 hidden md:block"
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                >
                  ❮
                </button>
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-6 hidden md:block"
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                >
                  ❯
                </button>
            </div>
             <div className="absolute bottom-6 text-white/40 text-sm tracking-widest pointer-events-none">
                {currentImageIndex + 1} / {activeFilm.gallery.length}
              </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default Films;
