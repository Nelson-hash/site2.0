import React, { createContext, useContext, useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

interface CursorContextType {
  isHovered: boolean;
  setHovered: (value: boolean) => void;
  isMobile: boolean;
}

const CursorContext = createContext<CursorContextType>({
  isHovered: false,
  setHovered: () => {},
  isMobile: false,
});

export const useCursor = () => useContext(CursorContext);

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHovered, setHovered] = useState(false);
  const isMobile = useIsMobile();

  // Disable hover effects on mobile
  useEffect(() => {
    if (isMobile) {
      // Force cursor to non-hovered state on mobile
      setHovered(false);
    }
  }, [isMobile]);

  return (
    <CursorContext.Provider value={{ isHovered, setHovered, isMobile }}>
      {children}
    </CursorContext.Provider>
  );
};
