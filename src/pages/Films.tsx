import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCursor } from '../context/CursorContext';
import HomeLink from '../components/HomeLink';

interface Film {
  title: string;
  year: string;
  image: string;
  description: string;
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
  const mountedRef = useRef(true);
  
  const upcomingFilms: Film[] = [
    { 
      title: "NUIT BLANCHE", 
      year: "2025",
      image: "/images/films/nuit-blanche.jpg",
      description: "Julien et Marie vont passer le week-end à la campagne, dans la maison de famille de Marie, où les attendent ses trois frères et sœurs. Tandis que les bouteilles défilent et que la soirée bat son plein, un drame se produit.",
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

        {/* Film preview section - moved more to the right with justified text */}
        <div className="w-full md:w-3/5 md:pl-16 min-h-[300px] md:min-h-[400px] relative">
          {(activeFilm || isImageLoading) && (
            <div className="absolute inset-0 flex flex-col items-center md:items-start justify-center p-4">
              {isImageLoading ? (
                <div className="flex flex-col items-center justify-center animate-fade-in">
                  <div className="w-full max-w-md md:max-w-lg aspect-video bg-gradient-to-br from-gray-800/20 to-gray-900/20 rounded-lg mb-6 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white/80 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-sm opacity-60">Chargement de l'image...</p>
                </div>
              ) : activeFilm ? (
                <div className="animate-fade-in w-full">
                  <div className="w-full max-w-md md:max-w-lg aspect-video overflow-hidden rounded-lg mb-6">
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
                  <p className="text-sm md:text-lg leading-relaxed text-center md:text-justify max-w-md opacity-90">
                    {activeFilm.description}
                  </p>
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
