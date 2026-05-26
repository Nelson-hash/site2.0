import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import Logo from './Logo';
import { useCursor } from '../context/CursorContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Layout: React.FC = () => {
  const { isMobile } = useCursor();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Reset scroll position on mount
  useEffect(() => {
    if (isMobile) {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }, [isMobile]);

  // Mobile Swipe/Scroll Navigation Logic
  useEffect(() => {
    if (!isMobile) return;

    let isNavigating = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (isNavigating) return;

      const scrollY = window.scrollY;
      const threshold = 100; 

      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        if (scrollY > threshold && !isNavigating) {
          isNavigating = true;
          
          // Smooth scroll down effect
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          });

          // Navigate after animation
          setTimeout(() => {
            navigate('/films');
          }, 500); 
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isMobile, navigate]);

  if (isMobile) {
    return (
      <div className="relative w-full text-white">
        <Navigation onMenuToggle={setIsMenuOpen} />
        
        {/* Fixed Center Logo */}
        <div className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none">
          <motion.div 
            className="pointer-events-auto"
            animate={{ opacity: isMenuOpen ? 0 : 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Logo />
          </motion.div>
        </div>
        
        {/* Scrollable Area */}
        <div className="h-[150vh]" />
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="relative h-full w-full text-white">
      <Navigation onMenuToggle={setIsMenuOpen} />
      <div className="h-full flex items-center justify-center">
        {/* Optional: Add animation here too if you ever want desktop to fade */}
        <Logo />
      </div>
    </div>
  );
};

export default Layout;
