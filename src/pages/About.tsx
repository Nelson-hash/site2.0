import React from 'react';
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
  const { setHovered } = useCursor();
  
  const teamMembers: TeamMember[] = [
    {
      firstName: "Gabriel",
      lastName: "HUSSEIN",
      role: "Réalisateur",
      email: "gabriel@horusprod.com",
      image: "/images/team/gabriel.jpg",
    },
    {
      firstName: "Matias",
      lastName: "THOMAS",
      role: "Directeur de la photographie",
      email: "matias@horusprod.com",
      image: "/images/team/matias.jpg",
    },
    {
      firstName: "Pierre",
      lastName: "MOSKVINE",
      role: "Producteur",
      email: "pierre@horusprod.com",
      image: "/images/team/pierre.jpg",
    },
    {
      firstName: "Nelson",
      lastName: "REMY",
      role: "Sound designer",
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

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <VideoBackground />
      
      <div className="absolute top-8 left-8">
        <HomeLink />
      </div>
      
      <div className="relative z-10 container mx-auto px-6 py-24">
        <motion.div 
          className="max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-6xl font-bold mb-12"
            variants={itemVariants}
          >
            A PROPOS
          </motion.h1>
          
          <motion.div 
            className="text-xl leading-relaxed mb-16 max-w-3xl"
            variants={itemVariants}
          >
            <p className="mb-6">
              Nous voulons offrir aux jeunes artistes talentueux les moyens nécessaires pour concrétiser leurs idées créatives. Nous croyons au potentiel de ceux qui nous entourent et nous engageons à leur fournir des conditions optimales pour explorer leurs visions.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
            variants={itemVariants}
          >
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index}
                className="flex flex-col items-center text-center"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                whileHover={{ y: -10 }}
              >
                <div className="w-48 h-48 mb-6 rounded-full overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={`${member.firstName} ${member.lastName}`}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <h3 className="text-2xl mb-1">
                  {member.firstName}
                </h3>
                <h3 className="text-2xl mb-3 font-bold">
                  {member.lastName}
                </h3>
                <p className="text-lg mb-2 opacity-80">
                  {member.role}
                </p>
                <a 
                  href={`mailto:${member.email}`}
                  className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
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
