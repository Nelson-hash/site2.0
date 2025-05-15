import React, { useState } from 'react';
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
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  // Handle film selection for mobile
  const handleFilmSelect = (film: Film) => {
    setActiveFilm(film);
    
    // On mobile, briefly show hover effect on tap
    if (isMobile) {
      setHovered(true);
      setTimeout(() => setHovered(false), 300);
    }
  };
  
  return (
    <motion.div
      className={`min-h-screen ${isMobile ? 'pb-20' : ''} flex flex-col md:flex-row items-center justify-center p-4 md:p-8 relative`}
      animate={{
        backgroundColor: activeFilm ? activeFilm.theme.background : "#000000",
        color: activeFilm ? activeFilm.theme.text : "#ffffff",
        transition: { duration: 0.6 }
      }}
    >
      <div className="absolute top-8 left-8 z-10">
        <HomeLink />
      </div>
      
      <div className="w-full max-w-6xl flex flex-col md:flex-row">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full md:w-1/2 space-y-8 md:space-y-16"
        >
          <motion.section variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-mono mb-4 md:mb-8 tracking-wider">PROCHAINES SORTIES</h2>
            <div className="space-y-4 md:space-y-6">
              {upcomingFilms.map((film, index) => (
                <motion.div
                  key={index}
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    !isMobile && setHovered(true);
                    !isMobile && setActiveFilm(film);
                  }}
                  onMouseLeave={() => {
                    !isMobile && setHovered(false);
                    !isMobile && setActiveFilm(null);
                  }}
                  onClick={() => handleFilmSelect(film)}
                  whileHover={{ x: isMobile ? 0 : 20 }}
                  whileTap={isMobile ? { scale: 0.95 } : {}}
                >
                  <h3 className="text-xl md:text-2xl font-light tracking-wide">
                    {film.title} 
                    <motion.span
                      animate={{
                        color: activeFilm ? activeFilm.theme.accent : "#aaaaaa"
                      }}
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
            <h2 className="text-3xl md:text-4xl font-mono mb-4 md:mb-8 tracking-wider">REVOYEZ</h2>
            <div className="space-y-4 md:space-y-6">
              {pastFilms.map((film, index) => (
                <motion.div
                  key={index}
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    !isMobile && setHovered(true);
                    !isMobile && setActiveFilm(film);
                  }}
                  onMouseLeave={() => {
                    !isMobile && setHovered(false);
                    !isMobile && setActiveFilm(null);
                  }}
                  onClick={() => {
                    handleFilmSelect(film);
                    // If there's a link and we're on mobile, open it
                    if (isMobile && film.link) {
                      window.open(film.link, '_blank');
                    }
                  }}
                  whileHover={{ x: isMobile ? 0 : 20 }}
                  whileTap={isMobile ? { scale: 0.95 } : {}}
                >
                  {film.link && !isMobile ? (
                    <a href={film.link} target="_blank" rel="noopener noreferrer">
                      <h3 className="text-xl md:text-2xl font-light tracking-wide">
                        {film.title} 
                        <motion.span
                          animate={{
                            color: activeFilm ? activeFilm.theme.accent : "#aaaaaa"
                          }} 
                          className="ml-4"
                        >
                          {film.year}
                        </motion.span>
                      </h3>
                    </a>
                  ) : (
                    <h3 className="text-xl md:text-2xl font-light tracking-wide">
                      {film.title} 
                      <motion.span
                        animate={{
                          color: activeFilm ? activeFilm.theme.accent : "#aaaaaa"
                        }} 
                        className="ml-4"
                      >
                        {film.year}
                      </motion.span>
                    </h3>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        </motion.div>

        {/* Film preview section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative mt-8 md:mt-0">
          <AnimatePresence>
            {activeFilm && (
              <motion.div 
                key={activeFilm.title}
                className="absolute inset-0 flex flex-col items-center"
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="w-full aspect-video overflow-hidden rounded-lg mb-4">
                  <img 
                    src={activeFilm.image} 
                    alt={activeFilm.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-base md:text-lg leading-relaxed">
                  {activeFilm.description}
                </p>
                {isMobile && activeFilm.link && (
                  <motion.a 
                    href={activeFilm.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 py-2 px-4 bg-black bg-opacity-20 rounded-md"
                    whileTap={{ scale: 0.95 }}
                  >
                    Voir la vidéo
                  </motion.a>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Films;
