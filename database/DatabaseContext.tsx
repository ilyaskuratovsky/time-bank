import React, { createContext, useContext, ReactNode } from "react";
import {
  useTimeBankDatabase,
  Interval,
  ManualRecord,
  ProjectIntervals,
  ProjectManualRecords,
} from "./useTimeBankDatabase";
import { useLogDatabase } from "./useLogDatabase";

interface DatabaseContextType {
  timeBankDatabase: {
    intervalsByProject: ProjectIntervals;
    manualRecordsByProject: ProjectManualRecords;
    isLoading: boolean;

    reload: () => Promise<void>;

    set: (
      key: string,
      intervals: Interval[],
      manualRecords?: ManualRecord[],
    ) => Promise<void>;

    setManualRecords: (
      key: string,
      manualRecords: ManualRecord[],
    ) => Promise<void>;

    addInterval: (key: string, interval: Interval) => Promise<void>;
    addIntervals: (key: string, intervals: Interval[]) => Promise<void>;

    addManualRecord: (
      key: string,
      timestamp: number,
      seconds: number
    ) => Promise<void>;

    getIntervals: (key: string) => Interval[];
    getManualRecords: (key: string) => ManualRecord[];

    getIntervalSeconds: (key: string) => number;
    getManualSeconds: (key: string) => number;
    getTotalSeconds: (key: string) => number;

    remove: (key: string) => Promise<void>;
  };

  logDatabase: {
    log: Array<{ ts: number; value: string }>;
    add: (ts: number, value: string) => Promise<void>;
    reload: () => Promise<void>;
  };
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined,
);

export const DatabaseContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const timeBankDatabase = useTimeBankDatabase();
  const logDatabase = useLogDatabase();

  return (
    <DatabaseContext.Provider value={{ timeBankDatabase, logDatabase }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabaseContext = () => {
  const context = useContext(DatabaseContext);

  if (!context) {
    throw new Error(
      "useDatabaseContext must be used within a DatabaseContextProvider",
    );
  }

  return context;
};