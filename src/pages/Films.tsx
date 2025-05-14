import React from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';
import HomeLink from '../components/HomeLink';

interface Film {
  title: string;
  year: string;
}

const Films: React.FC = () => {
  const { setHovered } = useCursor();
  
  const upcomingFilms: Film[] = [
    { title: "NUIT BLANCHE", year: "2025" }
  ];
  
  const pastFilms: Film[] = [
    { title: "QISHUI PAPITEDDYBEAR FEAT PENSE", year: "2024" }
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
  
  return (
    <div className="min-h-screen bg-black/90 flex items-center justify-center p-8 relative">
      <div className="absolute top-8 left-8 z-10">
        <HomeLink />
      </div>
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl w-full space-y-16"
      >
        <motion.section variants={itemVariants}>
          <h2 className="text-4xl font-mono mb-8 tracking-wider">PROCHAINES SORTIES</h2>
          <div className="space-y-6">
            {upcomingFilms.map((film, index) => (
              <motion.div
                key={index}
                className="cursor-pointer"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
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
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
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
    </div>
  );
};

export default Films;
