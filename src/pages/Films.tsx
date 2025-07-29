import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCursor } from '../context/CursorContext';
import HomeLink from '../components/HomeLink';

interface Film {
  title: string;
  year: string;
  image: string;
  description: string;
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

// Image loader utility with better performance
class ImageLoader {
  private static cache = new Map<string, HTMLImageElement>();
  private static loadingPromises = new Map<string, Promise<HTMLImageElement>>();

  static async loadImage(src: string, priority: 'high' | 'low' = 'low'): Promise<HTMLImageElement> {
    // Return cached image immediately
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    // Return existing loading promise to avoid duplicate requests
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }

    // Create new loading promise
    const loadingPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      const cleanup = () => {
        this.loadingPromises.delete(src);
      };

      img.onload = () => {
        this.cache.set(src, img);
        cleanup();
        resolve(img);
      };

      img.onerror = () => {
        cleanup();
        reject(new Error(`Failed to load image: ${src}`));
      };

      // Optimize loading
      img.decoding = 'async';
      img.loading = 'eager';
      if (priority === 'high' && 'fetchPriority' in img) {
        (img as any).fetchPriority = 'high';
      }

      // Set src last to trigger loading
      img.src = src;
    });

    this.loadingPromises.set(src, loadingPromise);
    return loadingPromise;
  }

  static preloadImages(sources: string[]) {
    sources.forEach((src, index) => {
      // Load first image with high priority
      this.loadImage(src, index === 0 ? 'high' : 'low').catch(() => {
        console.warn(`Failed to preload: ${src}`);
      });
    });
  }
}

const Films: React.FC = () => {
  const { setHovered, isMobile } = useCursor();
  const [activeFilm, setActiveFilm] = useState<Film | null>(null);  
  const [clickedFilm, setClickedFilm] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<Map<string, boolean>>(new Map());
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const mountedRef = useRef(true);
  
  const upcomingFilms: Film[] = [
    { 
      title: "NUIT BLANCHE", 
      year: "2025",
      image: "/images/films/nuit-blanche.jpg",
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
          "Image : Léo Lacan, Thibault Lienhardt",
          "Machinerie : Aristote Pham-Ba",
          "Maquillage : Marie Haegeman",
          "Musique : Pierre Bernier",
          "Post-production : Jonathan Le Borgne, Tristan Villeboux, Maxime Bardou",
          "Réalisation : Augustin Arnal & Justin Féral",
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

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Preload all images on mount
  useEffect(() => {
    const allFilms = [...upcomingFilms, ...pastFilms];
    const imageSources = allFilms.map(film => film.image);
    
    // Start preloading immediately
    ImageLoader.preloadImages(imageSources);
  }, []);

  // Optimized film selection handler
  const handleFilmClick = useCallback(async (film: Film) => {
    if (!mountedRef.current) return;

    // Set loading state immediately for better UX
    setLoadingStates(prev => new Map(prev.set(film.image, true)));

    try {
      // Load image if not cached
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

    // Always handle touch feedback for mobile
    if (isMobile) {
      setHovered(true);
      setTimeout(() => setHovered(false), 300);
    }
  }, [isMobile, setHovered]);

  // Handle expand/collapse of team details
  const toggleTeamExpansion = useCallback((filmTitle: string) => {
    setExpandedTeam(prev => prev === filmTitle ? null : filmTitle);
  }, []);

  // Separate handler for link opening (only on click)
  const handleLinkClick = useCallback((film: Film) => {
    if (film.link) {
      if (isMobile) {
        // Mobile: two-click behavior
        if (clickedFilm === film.title) {
          window.open(film.link, '_blank');
          setClickedFilm(null);
        } else {
          setClickedFilm(film.title);
        }
      } else {
        // Desktop: direct click to open
        window.open(film.link, '_blank');
      }
    }
  }, [isMobile, clickedFilm]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
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
      {/* Fixed header with proper spacing */}
      <div className="fixed top-0 left-0 right-0 z-30 p-4 md:p-8">
        <HomeLink />
      </div>
      
      {/* Main content with proper padding to avoid header overlap */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row pt-20 md:pt-16 px-4 md:px-8 pb-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full md:w-2/5 space-y-8 md:space-y-16 mb-8 md:mb-0"
        >
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl md:text-4xl font-light mb-6 md:mb-8 tracking-wide films-section-header">COURTS-METRAGES</h2>
            <div className="space-y-4 md:space-y-6">
              {upcomingFilms.map((film, index) => (
                <motion.div
                  key={index}
                  className="cursor-pointer py-2"
                  onMouseEnter={() => {
                    if (!isMobile) {
                      setHovered(true);
                      handleFilmClick(film);
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) {
                      setHovered(false);
                    }
                  }}
                  onClick={() => {
                    handleFilmClick(film);
                    handleLinkClick(film);
                  }}
                  whileHover={{ x: isMobile ? 0 : 20 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <h3 className="text-lg md:text-2xl font-light tracking-wide">
                    {film.title} 
                    <span
                      className="ml-4 transition-colors duration-150 ease-out"
                      style={{
                        color: activeFilm?.title === film.title ? (activeFilm.theme.accent) : "#aaaaaa"
                      }}
                    >
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
                  onMouseEnter={() => {
                    if (!isMobile) {
                      setHovered(true);
                      handleFilmClick(film);
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) {
                      setHovered(false);
                    }
                  }}
                  onClick={() => {
                    handleFilmClick(film);
                    handleLinkClick(film);
                  }}
                  whileHover={{ x: isMobile ? 0 : 20 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex flex-col">
                    <h3 className="text-lg md:text-2xl font-light tracking-wide">
                      {film.title} 
                      <span
                        className="ml-4 transition-colors duration-150 ease-out"
                        style={{
                          color: activeFilm?.title === film.title ? (activeFilm.theme.accent) : "#aaaaaa"
                        }}
                      >
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

        {/* Film preview section - mobile-friendly layout with fixed positioning */}
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
                  {/* Top section: Image and Team info side by side on desktop */}
                  <div className="flex flex-col md:flex-row md:gap-8">
                    {/* Left column: Image and Description */}
                    <div className="w-full md:w-3/5 flex-shrink-0 mb-6 md:mb-0">
                      {/* Image */}
                      <div className="w-full aspect-video overflow-hidden rounded-lg mb-4">
                        <img 
                          src={activeFilm.image}
                          alt={activeFilm.title} 
                          className="w-full h-full object-cover"
                          style={{ 
                            opacity: 1,
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                      
                      {/* Description - stays under the image */}
                      <div className="w-full">
                        <p className="text-sm md:text-lg leading-relaxed text-center md:text-justify opacity-90">
                          {activeFilm.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Right column: Team information with fixed height container */}
                    <div className="w-full md:w-2/5 flex flex-col justify-start">
                      <h4 className="text-xs md:text-sm font-light tracking-wider opacity-70 mb-3 uppercase text-center md:text-left">
                        Équipe
                      </h4>
                      
                      {/* Fixed height container to prevent jumping */}
                      <div className="min-h-[200px] md:min-h-[300px]">
                        <div className="space-y-1 text-center md:text-left">
                          {activeFilm.team.main.map((member, index) => (
                            <p key={index} className="text-xs md:text-sm opacity-90 font-light leading-relaxed" 
                               style={{ color: activeFilm.theme.text }}>
                              <span className="opacity-70">{member.split(' : ')[0]} :</span>{' '}
                              <span style={{ color: activeFilm.theme.accent }}>{member.split(' : ')[1]}</span>
                            </p>
                          ))}
                          
                          {/* Additional team info (expandable for films that have it) */}
                          {activeFilm.team.additional && (
                            <>
                              {expandedTeam === activeFilm.title && (
                                <div className="space-y-1 mt-3 pt-2 border-t border-opacity-20" style={{ borderColor: activeFilm.theme.text }}>
                                  {activeFilm.team.additional.map((member, index) => {
                                    const role = member.split(' : ')[0];
                                    const names = member.split(' : ')[1];
                                    
                                    // Different colors for different sections
                                    let nameColor = activeFilm.theme.accent;
                                    if (role === 'Cast') nameColor = activeFilm.theme.background === '#ffffff' ? '#8B4513' : '#DEB887'; // Brown tones
                                    else if (role === 'Image' || role === 'Éclairage') nameColor = activeFilm.theme.background === '#ffffff' ? '#4682B4' : '#87CEEB'; // Blue tones
                                    else if (role === 'Son' || role === 'Musique') nameColor = activeFilm.theme.background === '#ffffff' ? '#228B22' : '#98FB98'; // Green tones
                                    else if (role === 'Post-production') nameColor = activeFilm.theme.background === '#ffffff' ? '#800080' : '#DA70D6'; // Purple tones
                                    else if (role.includes('Réalisation') || role === 'Scénario') nameColor = activeFilm.theme.background === '#ffffff' ? '#DC143C' : '#FFB6C1'; // Red tones
                                    
                                    return (
                                      <p key={index} className="text-xs md:text-sm opacity-90 font-light leading-relaxed">
                                        <span className="opacity-70" style={{ color: activeFilm.theme.text }}>{role} :</span>{' '}
                                        <span style={{ color: nameColor }}>{names}</span>
                                      </p>
                                    );
                                  })}
                                </div>
                              )}
                              
                              {/* Button positioned at bottom of container */}
                              <div className="absolute bottom-0 left-0 right-0 pt-4">
                                <button
                                  onClick={() => toggleTeamExpansion(activeFilm.title)}
                                  onMouseEnter={() => !isMobile && setHovered(true)}
                                  onMouseLeave={() => !isMobile && setHovered(false)}
                                  className="text-xs md:text-sm opacity-60 hover:opacity-100 transition-opacity underline"
                                  style={{ color: activeFilm.theme.accent }}
                                >
                                  {expandedTeam === activeFilm.title ? 'Lire moins' : 'Lire plus'}
                                </button>
                              </div>
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
    </motion.div>
  );
};

export default Films;
