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
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);
  
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
    <div className="about-page relative min-h-screen w-screen overflow-auto">
      <VideoBackground />
      
      {/* Fixed header with proper spacing - removed 3D logo */}
      <div className="fixed top-0 left-0 right-0 z-30 p-4 md:p-8 flex justify-start items-start">
        <HomeLink />
      </div>
      
      {/* Main content with proper padding to avoid header overlap and allow scrolling */}
      <div className="relative z-10 w-full pt-20 md:pt-16 px-4 md:px-6 pb-20 md:pb-12">
        <motion.div 
          className="w-full mx-auto min-h-screen md:min-h-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-6 md:mb-8 lg:mb-10"
            variants={itemVariants}
          >
            A PROPOS
          </motion.h1>
          
          <motion.div 
            className="text-base md:text-xl lg:text-xl xl:text-2xl 2xl:text-3xl leading-relaxed mb-8 md:mb-12 lg:mb-14 max-w-none lg:max-w-4xl xl:max-w-5xl"
            variants={itemVariants}
          >
            <p className="mb-6 lg:mb-8">
              Nous voulons offrir aux jeunes artistes talentueux les moyens nécessaires pour concrétiser leurs idées créatives. Nous croyons au potentiel de ceux qui nous entourent et nous engageons à leur fournir des conditions optimales pour explorer leurs visions.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-16 mt-6 md:mt-8 lg:mt-10"
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
                <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 2xl:w-40 2xl:h-40 mb-3 md:mb-4 lg:mb-5 rounded-full overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={`${member.firstName} ${member.lastName}`}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <h3 className="text-sm md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-normal mb-0">
                  {member.firstName}
                </h3>
                <h4 className="text-sm md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl font-bold mb-1 md:mb-2 lg:mb-2">
                  {member.lastName}
                </h4>
                <a 
                  href={`mailto:${member.email}`}
                  className="text-xs md:text-sm lg:text-sm xl:text-base 2xl:text-lg opacity-60 hover:opacity-100 transition-opacity"
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
