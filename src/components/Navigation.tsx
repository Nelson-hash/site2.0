import React from 'react';
import NavigationItem from './NavigationItem';

const Navigation: React.FC = () => {
  return (
    <div className="absolute inset-0 p-6 md:p-10">
      <div className="relative h-full w-full">
        <div className="absolute top-0 left-0">
          <NavigationItem title="FILMS" href="/films" position="top-left" />
        </div>
        <div className="absolute bottom-0 right-0">
          <NavigationItem title="A PROPOS" href="/about" position="bottom-right" />
        </div>
      </div>
    </div>
  );
};

export default Navigation;