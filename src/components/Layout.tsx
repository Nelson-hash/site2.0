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

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isMobile) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;

    let isNavigating = false;
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      if (isNavigating || isMenuOpen) return;

      const scrollY = window.scrollY;
      const threshold = 90;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (scrollY > threshold && !isNavigating) {
          isNavigating = true;
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          });
          setTimeout(() => {
            navigate('/films');
          }, 450);
        }
      }, 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isMobile, isMenuOpen, navigate]);

  if (isMobile) {
    return (
      <div className="relative w-full text-white">
        <Navigation onMenuToggle={setIsMenuOpen} />
        
        {/* Logo centré */}
        <div className="fixed inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <motion.div 
            className="pointer-events-auto"
            animate={{ opacity: isMenuOpen ? 0 : 1, scale: isMenuOpen ? 0.95 : 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Logo />
          </motion.div>

          {/* Indicateur discret sur mobile */}
          <motion.div
            animate={{ opacity: isMenuOpen ? 0 : 0.45, y: [0, 6, 0] }}
            transition={{ y: { repeat: Infinity, duration: 2.2, ease: "easeInOut" }, opacity: { duration: 0.3 } }}
            className="absolute bottom-20 text-[10px] tracking-[0.25em] uppercase font-light pointer-events-none"
          >
            Glisser vers le haut ↑
          </motion.div>
        </div>
        
        {/* Zone de défilement pour déclencher la transition */}
        <div className="h-[140vh]" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full text-white">
      <Navigation onMenuToggle={setIsMenuOpen} />
      <div className="h-full flex items-center justify-center">
        <motion.div
          animate={{ opacity: isMenuOpen ? 0.2 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Logo />
        </motion.div>
      </div>
    </div>
  );
};

export default Layout;
