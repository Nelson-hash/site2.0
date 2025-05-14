import React, { createContext, useContext, useState } from 'react';

interface CursorContextType {
  isHovered: boolean;
  setHovered: (value: boolean) => void;
}

const CursorContext = createContext<CursorContextType>({
  isHovered: false,
  setHovered: () => {},
});

export const useCursor = () => useContext(CursorContext);

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHovered, setHovered] = useState(false);

  return (
    <CursorContext.Provider value={{ isHovered, setHovered }}>
      {children}
    </CursorContext.Provider>
  );
};