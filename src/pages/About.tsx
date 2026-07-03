import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HomeLink from '../components/HomeLink';
import { useCursor } from '../context/CursorContext';

interface TeamMember {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
}

const About = () => {
  const { setHovered, isMobile } = useCursor();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false); // État pour l'animation de sortie
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const teamMembers: TeamMember[] = [
    { firstName: "Gabriel", lastName: "HUSSEIN", role: "", email: "gabriel@horusprod.com" },
    { firstName: "Matias", lastName: "THOMAS", role: "", email: "matias@horusprod.com" },
    { firstName: "Nelson", lastName: "REMY", role: "", email: "nelson@horusprod.com" }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // SOLUTION SORTIE BRUSQUE : On intercepte le clic, on lance le fondu, on navigue 600ms plus tard
  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate('/');
    }, 600);
  };

  return (
    <motion.div 
      className="about-page relative min-h-screen w-full overflow-x-hidden text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="fixed top-0 left-0 right-0 z-30 p-4 md:p-8 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <HomeLink />
        </div>
        <AnimatePresence>
          <motion.button
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            onClick={handleBack}
            className="pointer-events-auto text-sm md:text-base font-light tracking-widest uppercase hover:opacity-60 transition-opacity text-white"
          >
            Retour / Back
          </motion.button>
        </AnimatePresence>
      </div>
      
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-6 md:px-12 py-32">
        <motion.div 
          className="w-full max-w-4xl text-center flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-light tracking-wide mb-8 md:mb-12 border-b border-white/20 pb-4 inline-block">
            A PROPOS
          </motion.h2>
          
          <motion.div variants={itemVariants} className="text-sm md:text-lg leading-relaxed opacity-90 mb-16 md:mb-24 max-w-2xl font-light">
            <p>Nous voulons offrir à des jeunes artistes talentueux les moyens nécessaires pour concrétiser leurs idées. Nous nous engageons à vous fournir les conditions optimales pour exprimer votre vision.</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="w-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
            {teamMembers.map((member, index) => (
              <motion.div key={index} className="flex flex-col items-center gap-2 group cursor-default" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <h3 className="text-lg md:text-xl tracking-wide"><span className="font-light opacity-90">{member.firstName}</span> <span className="font-bold">{member.lastName}</span></h3>
                <a href={`mailto:${member.email}`} className="text-xs md:text-sm opacity-50 hover:opacity-100 transition-opacity tracking-wider uppercase border-b border-transparent hover:border-white/50 pb-0.5" onMouseEnter={() => !isMobile && setHovered(true)} onMouseLeave={() => !isMobile && setHovered(false)}>{member.email}</a>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HomeLink from '../components/HomeLink';
import { useCursor } from '../context/CursorContext';
import VideoBackground from '../components/VideoBackground';

interface TeamMember {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
}

const About = () => {
  const { setHovered, isMobile } = useCursor();
  const navigate = useNavigate(); // Ajout du hook de navigation
  
  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const teamMembers: TeamMember[] = [
    {
      firstName: "Gabriel",
      lastName: "HUSSEIN",
      role: "",
      email: "gabriel@horusprod.com",
    },
    {
      firstName: "Matias",
      lastName: "THOMAS",
      role: "",
      email: "matias@horusprod.com",
    },
    {
      firstName: "Nelson",
      lastName: "REMY",
      role: "",
      email: "nelson@horusprod.com",
    }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="about-page relative min-h-screen w-full overflow-x-hidden text-white">
      <VideoBackground />
      
      {/* Header modifié avec le bouton Retour */}
      <div className="fixed top-0 left-0 right-0 z-30 p-4 md:p-8 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <HomeLink />
        </div>
        <AnimatePresence>
          <motion.button
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 20 }}
            onClick={() => navigate('/')}
            className="pointer-events-auto text-sm md:text-base font-light tracking-widest uppercase hover:opacity-60 transition-opacity text-white"
          >
            Retour / Back
          </motion.button>
        </AnimatePresence>
      </div>
      
      {/* Main Content - Centered Layout */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-6 md:px-12 py-32">
        <motion.div 
          className="w-full max-w-4xl text-center flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* TITLE */}
          <motion.h2 
            className="text-5xl md:text-7xl font-light tracking-wide mb-8 md:mb-12 border-b border-white/20 pb-4 inline-block"
            variants={itemVariants}
          >
            A PROPOS
          </motion.h2>
          
          {/* DESCRIPTION */}
          <motion.div 
            className="text-sm md:text-lg leading-relaxed opacity-90 mb-16 md:mb-24 max-w-2xl font-light"
            variants={itemVariants}
          >
            <p>
              Nous voulons offrir à des jeunes artistes talentueux les moyens nécessaires pour concrétiser leurs idées. Nous nous engageons à vous fournir les conditions optimales pour exprimer votre vision.
            </p>
          </motion.div>
          
          {/* TEAM MEMBERS */}
          <motion.div 
            className="w-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24"
            variants={itemVariants}
          >
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                className="flex flex-col items-center gap-2 group cursor-default"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg md:text-xl tracking-wide">
                  <span className="font-light opacity-90">{member.firstName}</span>{' '}
                  <span className="font-bold">{member.lastName}</span>
                </h3>
                
                <a 
                  href={`mailto:${member.email}`}
                  className="text-xs md:text-sm opacity-50 hover:opacity-100 transition-opacity tracking-wider uppercase border-b border-transparent hover:border-white/50 pb-0.5"
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
    </div>
  );
};

export default About;
