import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HomeLink from '../components/HomeLink';
import { useCursor } from '../context/CursorContext';

interface TeamMember {
  firstName: string;
  lastName: string;
  email: string;
}

const teamMembers: TeamMember[] = [
  { firstName: "Gabriel", lastName: "HUSSEIN", email: "gabriel@horusprod.com" },
  { firstName: "Matias", lastName: "THOMAS", email: "matias@horusprod.com" },
  { firstName: "Nelson", lastName: "REMY", email: "nelson@horusprod.com" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const About: React.FC = () => {
  const { setHovered, isMobile } = useCursor();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  }, []);

  const handleBack = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      navigate('/');
    }, 600);
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBack]);

  return (
    <motion.div 
      className="about-page relative min-h-screen w-full overflow-x-hidden text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* HEADER FIXE */}
      <div className="fixed top-0 left-0 right-0 z-30 px-5 py-4 md:p-8 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
          <HomeLink />
        </div>
        <AnimatePresence>
          <motion.button
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            onClick={handleBack}
            className="pointer-events-auto text-xs md:text-base font-light tracking-widest uppercase hover:opacity-60 transition-opacity text-white"
          >
            Retour / Back
          </motion.button>
        </AnimatePresence>
      </div>
      
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-6 md:px-12 py-24 md:py-32">
        <motion.div 
          className="w-full max-w-4xl text-center flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-3xl sm:text-5xl md:text-7xl font-light tracking-widest uppercase mb-8 md:mb-12 border-b border-white/20 pb-4 inline-block">
            À PROPOS
          </motion.h1>
          
          <motion.div variants={itemVariants} className="text-sm sm:text-base md:text-lg leading-relaxed opacity-90 mb-14 md:mb-24 max-w-2xl font-light">
            <p>
              Nous voulons offrir à des jeunes artistes talentueux les moyens nécessaires pour concrétiser leurs idées. Nous nous engageons à vous fournir les conditions optimales pour exprimer votre vision.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="w-full flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center gap-2 group cursor-default"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-lg md:text-xl tracking-wide">
                  <span className="font-light opacity-90">{member.firstName}</span>{' '}
                  <span className="font-bold">{member.lastName}</span>
                </h2>
                <a
                  href={`mailto:${member.email}`}
                  className="text-xs md:text-sm opacity-60 hover:opacity-100 transition-opacity tracking-wider uppercase border-b border-white/20 hover:border-white pb-0.5"
                  onMouseEnter={() => !isMobile && setHovered(true)}
                  onMouseLeave={() => !isMobile && setHovered(false)}
                >
                  {member.email}
                </a>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;
