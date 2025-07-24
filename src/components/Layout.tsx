import React from 'react';
import Navigation from './Navigation';
import Logo from './Logo';
import { useCursor } from '../context/CursorContext';

const Layout: React.FC = () => {
  const { isMobile } = useCursor();

  return (
    <div className="relative h-full w-full">
      <Navigation />
      <div className={`h-full flex items-center justify-center ${isMobile ? 'pt-16 pb-24' : ''}`}>
        {/* Center the logo properly for both mobile and desktop */}
        <div className={`${isMobile ? 'flex items-center justify-center w-full' : ''}`}>
          <Logo />
        </div>
      </div>
    </div>
  );
};

export default Layout;
