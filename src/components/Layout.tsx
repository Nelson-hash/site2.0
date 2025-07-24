import React, { useEffect } from 'react';
import Navigation from './Navigation';
import Logo from './Logo';
import { useCursor } from '../context/CursorContext';

const Layout: React.FC = () => {
  const { isMobile } = useCursor();

  // Reset scroll position and ensure proper layout when component mounts
  useEffect(() => {
    if (isMobile) {
      // Force scroll to top and reset any scroll-related state
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="relative w-full">
        <Navigation />
        {/* Fixed positioning for mobile to prevent scroll issues */}
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <Logo />
        </div>
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
