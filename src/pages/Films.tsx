import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCursor } from '../context/CursorContext';
import HomeLink from '../components/HomeLink';

interface Film {
  title: string;
  year: string;
  image: string;
  description: string;
}

const Films: React.FC = () => {
  const { setHovered } = useCursor();
  const [hoveredFilm, setHoveredFilm] = useState<Film | null>(null);
  
  const upcomingFilms: Film[] = [
    { 
      title: "NUIT BLANCHE", 
      year: "2025",
      image: "/images/films/nuit-blanche.jpg",
      description: "Court-métrage en montage"
  ];
  
  const pastFilms: Film[] = [
    { 
      title: "QISHUI PAPITEDDYBEAR FEAT PENSE", 
      year: "2024",
      image: "/images/films/qishui.jpg",
      description: "..."
    },
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
    <div className="min-h-screen bg-black/90 flex items-center justify-center p-8 relative">
      <div className="absolute top-8 left-8 z-10">
        <HomeLink />
      </div>
      
      <div className="w-full max-w-6xl flex">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-1/2 space-y-16"
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
                    setHoveredFilm(film);
                  }}
                  onMouseLeave={() => {
                    setHovered(false);
                    setHoveredFilm(null);
                  }}
                  whileHover={{ x: 20 }}
                >
                  <h3 className="text-2xl font-light tracking-wide">
                    {film.title} <span className="text-gray-500 ml-4">{film.year}</span>
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
                    setHoveredFilm(film);
                  }}
                  onMouseLeave={() => {
                    setHovered(false);
                    setHoveredFilm(null);
                  }}
                  whileHover={{ x: 20 }}
                >
                  <h3 className="text-2xl font-light tracking-wide">
                    {film.title} <span className="text-gray-500 ml-4">{film.year}</span>
                  </h3>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </motion.div>

        {/* Film preview section */}
        <div className="w-1/2 relative">
          <AnimatePresence>
            {hoveredFilm && (
              <motion.div 
                key={hoveredFilm.title}
                className="absolute inset-0 flex flex-col items-center"
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="w-full aspect-video overflow-hidden rounded-lg mb-4">
                  <img 
                    src={hoveredFilm.image} 
                    alt={hoveredFilm.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                  {hoveredFilm.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Films;
