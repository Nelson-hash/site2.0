import React, { useEffect } from 'react';
import Navigation from './Navigation';
import Logo from './Logo';
import { useCursor } from '../context/CursorContext';
import { useNavigate } from 'react-router-dom';

const Layout: React.FC = () => {
  const { isMobile } = useCursor();
  const navigate = useNavigate();

  // Reset scroll position and ensure proper layout when component mounts
  useEffect(() => {
    if (isMobile) {
      // Force scroll to top and reset any scroll-related state
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }, [isMobile]);

  // Add scroll listener for mobile navigation
  useEffect(() => {
    if (!isMobile) return;

    let isNavigating = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (isNavigating) return;

      const scrollY = window.scrollY;
      const threshold = 100; // Adjust this value to change sensitivity

      // Clear any existing timeout
      clearTimeout(scrollTimeout);

      // Set a timeout to prevent too frequent navigation attempts
      scrollTimeout = setTimeout(() => {
        if (scrollY > threshold && !isNavigating) {
          isNavigating = true;
          
          // Smooth scroll animation before navigation
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          });

          // Navigate after animation completes
          setTimeout(() => {
            navigate('/films');
          }, 500); // Adjust timing to match scroll animation
        }
      }, 150); // Debounce scroll events
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isMobile, navigate]);

  if (isMobile) {
    return (
      <div className="relative w-full">
        <Navigation />
        {/* Fixed positioning for mobile to prevent scroll issues */}
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <Logo />
        </div>
        {/* Add some height to enable scrolling */}
        <div className="h-[200vh]" />
      </div>
    );
  }

  // Desktop layout (unchanged)
  return (
    <div className="relative h-full w-full">
      <Navigation />
      <div className="h-full flex items-center justify-center">
        <Logo />
      </div>
    </div>
  );
};

export default Layout;
