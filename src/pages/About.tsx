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
  image: string;
}

const About = () => {
  const { setHovered, isMobile } = useCursor();
  
  // Reset scroll position when component mounts
  useEffect(() => {
    if (isMobile) {
      window.scrollTo(0, 0);
    }
  }, [isMobile]);
  
  const teamMembers: TeamMember[] = [
    {
      firstName: "Gabriel",
      lastName: "HUSSEIN",
      role: "",
      email: "gabriel@horusprod.com",
      image: "/images/team/gabriel.jpg",
    },
    {
      firstName: "Matias",
      lastName: "THOMAS",
      role: "",
      email: "matias@horusprod.com",
      image: "/images/team/matias.jpg",
    },
    {
      firstName: "Pierre",
      lastName: "MOSKVINE",
      role: "",
      email: "pierre@horusprod.com",
      image: "/images/team/pierre.jpg",
    },
    {
      firstName: "Nelson",
      lastName: "REMY",
      role: "",
      email: "nelson@horusprod.com",
      image: "/images/team/nelson.jpg",
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
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Handle touch events for mobile
  const handleTouch = () => {
    if (isMobile) {
      setHovered(true);
      setTimeout(() => setHovered(false), 300);
    }
  };

  return (
    <div className="relative min-h-screen w-screen overflow-auto">
      <VideoBackground />
      
      {/* Fixed header with proper spacing */}
      <div className="fixed top-0 left-0 right-0 z-30 p-4 md:p-8">
        <HomeLink />
      </div>
      
      {/* Main content with proper padding to avoid header overlap */}
      <div className="relative z-10 w-full pt-20 md:pt-16 px-4 md:px-6 pb-8 md:pb-12">
        <motion.div 
          className="max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 md:mb-8"
            variants={itemVariants}
          >
            A PROPOS
          </motion.h1>
          
          <motion.div 
            className="text-base md:text-xl leading-relaxed mb-8 md:mb-12 max-w-3xl"
            variants={itemVariants}
          >
            <p className="mb-6">
              Nous voulons offrir aux jeunes artistes talentueux les moyens nécessaires pour concrétiser leurs idées créatives. Nous croyons au potentiel de ceux qui nous entourent et nous engageons à leur fournir des conditions optimales pour explorer leurs visions.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-6 md:mt-8"
            variants={itemVariants}
          >
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                className="flex flex-col items-center text-center"
                onMouseEnter={() => !isMobile && setHovered(true)}
                onMouseLeave={() => !isMobile && setHovered(false)}
                onTouchStart={handleTouch}
                whileHover={{ y: isMobile ? 0 : -5 }}
                whileTap={isMobile ? { scale: 0.95 } : {}}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 mb-3 md:mb-4 rounded-full overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={`${member.firstName} ${member.lastName}`}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <h3 className="text-sm md:text-lg font-normal mb-0">
                  {member.firstName}
                </h3>
                <h4 className="text-sm md:text-lg font-bold mb-1 md:mb-2">
                  {member.lastName}
                </h4>
                <a 
                  href={`mailto:${member.email}`}
                  className="text-xs opacity-60 hover:opacity-100 transition-opacity"
                  onMouseEnter={() => !isMobile && setHovered(true)}
                  onMouseLeave={() => !isMobile && setHovered(false)}
                  onTouchStart={handleTouch}
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
