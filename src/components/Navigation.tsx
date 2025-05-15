import React from 'react';
import NavigationItem from './NavigationItem';
import { useCursor } from '../context/CursorContext';

const Navigation: React.FC = () => {
  const { isMobile } = useCursor();

  // Mobile navigation layout with improved visibility and larger text
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-black bg-opacity-80 z-20">
        <NavigationItem title="FILMS" href="/films" position="bottom-left" />
        <NavigationItem title="A PROPOS" href="/about" position="bottom-right" />
      </div>
    );
  }

  // Desktop navigation (unchanged)
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
