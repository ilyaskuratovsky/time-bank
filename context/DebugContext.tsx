import React, { createContext, useContext, useState, ReactNode } from "react";

type DebugContextType = {
  isDebugMode: boolean;
  toggleDebugMode: () => void;
};

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export const DebugProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDebugMode, setIsDebugMode] = useState(false);

  const toggleDebugMode = () => setIsDebugMode((prev) => !prev);

  return (
    <DebugContext.Provider value={{ isDebugMode, toggleDebugMode }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error("useDebug must be used within a DebugProvider");
  }
  return context;
};