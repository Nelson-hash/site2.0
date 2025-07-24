import React, { useState, useEffect } from 'react';
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

const Films: React.FC = () => {
  const { setHovered, isMobile } = useCursor();
  const [activeFilm, setActiveFilm] = useState<Film | null>(null);  
  const [clickedFilm, setClickedFilm] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  
  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  // Aggressive image preloading with loading state tracking + priority loading
  useEffect(() => {
    const allFilms = [...upcomingFilms, ...pastFilms];
    
    // Add preload links to head for critical images
    allFilms.forEach((film, index) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = film.image;
      if (index === 0) {
        link.setAttribute('fetchpriority', 'high');
      }
      document.head.appendChild(link);
    });
    
    const preloadImage = (src: string) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, src]));
          resolve(src);
        };
        img.onerror = () => {
          console.warn(`Failed to preload image: ${src}`);
          reject(src);
        };
        // Force immediate loading
        img.src = src;
      });
    };

    // Preload all images immediately
    allFilms.forEach(film => {
      preloadImage(film.image);
    });

    // Cleanup function to remove preload links
    return () => {
      allFilms.forEach(film => {
        const links = document.querySelectorAll(`link[href="${film.image}"]`);
        links.forEach(link => link.remove());
      });
    };
  }, []);
  
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

  // Debug: Log image paths to check if they're correct
  useEffect(() => {
    console.log('Film images:', {
      nuitBlanche: '/images/films/nuit-blanche.jpg',  
      qishui: '/images/films/qishui.jpg'
    });
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const imageVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.15,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.1,
        ease: "easeIn"
      }
    }
  };

  // Handle film selection for mobile and desktop
  const handleFilmClick = (film: Film) => {
    // On mobile, handle two-click behavior for links
    if (isMobile) {
      if (film.link) {
        if (clickedFilm === film.title) {
          // Second click - open link
          window.open(film.link, '_blank');
          setClickedFilm(null);
        } else {
          // First click - show preview
          setActiveFilm(film);
          setClickedFilm(film.title);
          setHovered(true);
          setTimeout(() => setHovered(false), 300);
        }
      } else {
        // No link, just show preview
        setActiveFilm(film);
        setHovered(true);
        setTimeout(() => setHovered(false), 300);
      }
    } else {
      // Desktop behavior - immediate link opening
      if (film.link) {
        window.open(film.link, '_blank');
      }
      setActiveFilm(film);
    }
  };
  
  return (
    <motion.div
      className="min-h-screen w-screen flex flex-col items-center justify-center relative overflow-auto"
      animate={{
        backgroundColor: activeFilm ? activeFilm.theme.background : "#000000",
        color: activeFilm ? activeFilm.theme.text : "#ffffff",
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      style={{
        // Use CSS custom properties for smoother color transitions
        '--bg-color': activeFilm ? activeFilm.theme.background : '#000000',
        '--text-color': activeFilm ? activeFilm.theme.text : '#ffffff'
      }}
    >
      {/* Fixed header with proper spacing */}
      <div className="fixed top-0 left-0 right-0 z-30 p-4 md:p-8">
        <HomeLink />
      </div>
      
      {/* Main content with proper padding to avoid header overlap */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row pt-20 md:pt-16 px-4 md:px-8 pb-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full md:w-2/5 space-y-8 md:space-y-16 mb-8 md:mb-0"
        >
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl md:text-4xl font-mono mb-6 md:mb-8 tracking-wider">COURTS-METRAGES</h2>
            <div className="space-y-4 md:space-y-6">
              {upcomingFilms.map((film, index) => (
                <motion.div
                  key={index}
                  className="cursor-pointer py-2"
                  onMouseEnter={() => {
                    if (!isMobile) {
                      setHovered(true);
                      setActiveFilm(film);
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) {
                      setHovered(false);
                      setActiveFilm(null);
                    }
                  }}
                  onClick={() => handleFilmClick(film)}
                  whileHover={{ x: isMobile ? 0 : 20 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <h3 className="text-lg md:text-2xl font-light tracking-wide">
                    {film.title} 
                    <motion.span
                      animate={{
                        color: activeFilm?.title === film.title ? (activeFilm.theme.accent) : "#aaaaaa"
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="ml-4"
                    >
                      {film.year}
                    </motion.span>
                  </h3>
                </motion.div>
              ))}
            </div>
          </motion.section>
          
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl md:text-4xl font-mono mb-6 md:mb-8 tracking-wider">CLIPS</h2>
            <div className="space-y-4 md:space-y-6">
              {pastFilms.map((film, index) => (
                <motion.div
                  key={index}
                  className="cursor-pointer py-2"
                  onMouseEnter={() => {
                    if (!isMobile) {
                      setHovered(true);
                      setActiveFilm(film);
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) {
                      setHovered(false);
                      setActiveFilm(null);
                    }
                  }}
                  onClick={() => handleFilmClick(film)}
                  whileHover={{ x: isMobile ? 0 : 20 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex flex-col">
                    <h3 className="text-lg md:text-2xl font-light tracking-wide">
                      {film.title} 
                      <motion.span
                        animate={{
                          color: activeFilm?.title === film.title ? (activeFilm.theme.accent) : "#aaaaaa"
                        }} 
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="ml-4"
                      >
                        {film.year}
                      </motion.span>
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

        {/* Film preview section */}
        <div className="w-full md:w-3/5 min-h-[300px] md:min-h-[400px] relative film-preview-container">
          {activeFilm && (
            <div 
              key={activeFilm.title}
              className="absolute inset-0 flex flex-col items-center justify-center p-4 animate-fade-in"
            >
              <div className="w-full max-w-md md:max-w-lg aspect-video overflow-hidden rounded-lg mb-6 bg-gray-800/20 relative">
                {/* Show loading state if image not loaded */}
                {!loadedImages.has(activeFilm.image) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800/40">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white/80 rounded-full animate-spin"></div>
                  </div>
                )}
                <img 
                  src={activeFilm.image} 
                  alt={activeFilm.title} 
                  className={`w-full h-full object-cover transition-opacity duration-150 ${
                    loadedImages.has(activeFilm.image) ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="eager"
                  decoding="async"
                  onLoad={() => {
                    setLoadedImages(prev => new Set([...prev, activeFilm.image]));
                  }}
                />
              </div>
              <p className="text-sm md:text-lg leading-relaxed text-center max-w-md opacity-90">
                {activeFilm.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Films;
