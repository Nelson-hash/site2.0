import React from 'react';
import Navigation from './Navigation';
import Logo from './Logo';

const Layout: React.FC = () => {
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