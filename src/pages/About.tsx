import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
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
    <div className="about-page relative min-h-screen w-screen overflow-hidden text-white">
      <VideoBackground />
      
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-30 p-4 md:p-8 flex justify-start items-start">
        <HomeLink />
      </div>
      
      {/* Main Content - Centered Layout */}
      <div className="relative z-10 w-full h-screen flex flex-col items-center justify-center px-6 md:px-12">
        <motion.div 
          className="w-full max-w-4xl text-center flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* TITLE: Matches Films page style (Light + Wide Tracking) */}
          <motion.h2 
            className="text-2xl md:text-4xl font-light tracking-wide mb-8 md:mb-12 border-b border-white/20 pb-4 inline-block"
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
              Nous voulons offrir aux jeunes artistes talentueux les moyens nécessaires pour concrétiser leurs idées créatives. Nous croyons au potentiel de ceux qui nous entourent et nous engageons à leur fournir des conditions optimales pour explorer leurs visions.
            </p>
          </motion.div>
          
          {/* TEAM MEMBERS: Clean Row Layout */}
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
                {/* Name Styling: Regular First, Bold Last */}
                <h3 className="text-lg md:text-xl tracking-wide">
                  <span className="font-light opacity-90">{member.firstName}</span>{' '}
                  <span className="font-bold">{member.lastName}</span>
                </h3>
                
                {/* Email: Subtle with hover effect */}
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
