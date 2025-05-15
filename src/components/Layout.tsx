import React from 'react';
import Navigation from './Navigation';
import Logo from './Logo';
import { useCursor } from '../context/CursorContext';

const Layout: React.FC = () => {
  const { isMobile } = useCursor();

  return (
    <div className="relative h-full w-full">
      <Navigation />
      <div className={`h-full flex items-center justify-center ${isMobile ? 'mt-0' : ''}`}>
        {/* Add explicit centering for mobile */}
        <div className={`${isMobile ? 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : ''}`}>
          <Logo />
        </div>
      </div>
    </div>
  );
};

export default Layout;
