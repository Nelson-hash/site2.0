import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCursor } from '../context/CursorContext';
import HomeLink from '../components/HomeLink';

interface Film {
  title: string;
  year: string;
  image: string;
  description: string;
  theme: {
    background: string;
    text: string;
    accent: string;
  };
}

const Films: React.FC = () => {
  const { setHovered } = useCursor();
  const [activeFilm, setActiveFilm] = useState<Film | null>(null);
  
  const upcomingFilms: Film[] = [
    { 
      title: "NUIT BLANCHE", 
      year: "2025",
      image: "/images/films/nuit-blanche.jpg",
      description: "Film en montage...",
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
      description: "...",
      theme: {
        background: "#800000",
        text: "#ffffff",
        accent: "#ff9999"
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
  
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-8 relative"
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
          className="w-full md:w-1/2 space-y-16"
        >
          <motion.section variants={itemVariants}>
            <h2 className="text-4xl font-mono mb-8 tracking-wider">PROCHAINES SORTIES</h2>
            <div className="space-y-6">
              {upcomingFilms.map((film, index) => (
                <motion.div
                  key={index}
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    setHovered(true);
                    setActiveFilm(film);
                  }}
                  onMouseLeave={() => {
                    setHovered(false);
                    setActiveFilm(null);
                  }}
                  whileHover={{ x: 20 }}
                >
                  <h3 className="text-2xl font-light tracking-wide">
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
            <h2 className="text-4xl font-mono mb-8 tracking-wider">REVOYEZ</h2>
            <div className="space-y-6">
              {pastFilms.map((film, index) => (
                <motion.div
                  key={index}
                  className="cursor-pointer"
                  onMouseEnter={() => {
                    setHovered(true);
                    setActiveFilm(film);
                  }}
                  onMouseLeave={() => {
                    setHovered(false);
                    setActiveFilm(null);
                  }}
                  whileHover={{ x: 20 }}
                >
                  <h3 className="text-2xl font-light tracking-wide">
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
        </motion.div>

        {/* Film preview section */}
        <div className="w-full md:w-1/2 h-80 md:h-auto relative mt-12 md:mt-0">
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
                <p className="text-lg leading-relaxed">
                  {activeFilm.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Films;
