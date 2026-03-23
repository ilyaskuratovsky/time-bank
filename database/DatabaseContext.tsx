import React, { createContext, useContext, ReactNode } from "react";
import { useTimeBankDatabase } from "./useTimeBankDatabase"; // Path to your hook
import { BankedTimes } from "./Types";
import { useLogDatabase } from "./useLogDatabase";
import { useStopWatchDatabase } from "./useStopWatchDatabase";

// Define the shape of our Context
interface DatabaseContextType {
  timeBankDatabase: {
    bankedTimes: BankedTimes;
    add: (key: string, value: number) => Promise<void>;
    set: (key: string, value: number) => Promise<void>;
    remove: (key: string) => Promise<void>;
    reload: () => Promise<void>;
    get: (key: string) => number;
  };
  logDatabase: {
    log: Array<{ ts: number; value: string }>;
    add: (ts: number, value: string) => Promise<void>;
    reload: () => Promise<void>;
  };
  stopWatchDatabase: {
    start: (key: string) => Promise<void>;
    pause: (id: string) => Promise<void>;
    reset: (id: string) => Promise<void>;
    getTime: (id: string) => Promise<number>;
  };
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined,
);

export const DatabaseContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Use your existing hook logic here
  const timeBankDatabase = useTimeBankDatabase();
  // Use your existing hook logic here
  const logDatabase = useLogDatabase();
  const stopWatchDatabase = useStopWatchDatabase();

  return (
    <DatabaseContext.Provider
      value={{ timeBankDatabase, logDatabase, stopWatchDatabase }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

// Custom hook to consume the context easily
export const useDatabaseContext = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useBankedTimes must be used within a BankedTimesProvider");
  }
  return context;
};
