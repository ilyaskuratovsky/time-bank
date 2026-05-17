import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';

// Define the shape of our enriched context value
type TodayContextType = {
  today: Date;    // The normalized logical Date object
  startTs: number; // Unix timestamp for 3:00:00.000 AM of this logical day
  endTs: number;   // Unix timestamp for 2:59:59.999 AM the next day (end of this logical day)
};

const TodayContext = createContext<TodayContextType | undefined>(undefined);

const ROLLOVER_HOUR = 3;

/**
 * Calculates the logical day and its absolute timestamp boundaries based on the current time.
 */
const getLogicalDayData = (): TodayContextType => {
  const now = new Date();
  let logicalDate: Date;

  if (now.getHours() < ROLLOVER_HOUR) {
    // If it's between midnight and 3:00 AM, the logical day is yesterday
    logicalDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  } else {
    logicalDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  // 1. Calculate startTs: 3:00 AM of the logical day
  const start = new Date(logicalDate.getFullYear(), logicalDate.getMonth(), logicalDate.getDate(), ROLLOVER_HOUR, 0, 0, 0);
  
  // 2. Calculate endTs: 2:59:59.999 AM of the following calendar day
  const end = new Date(start.getTime());
  end.setDate(end.getDate() + 1);
  end.setMilliseconds(end.getMilliseconds() - 1);

  return {
    today: logicalDate,
    startTs: start.getTime(),
    endTs: end.getTime(),
  };
};

export const TodayProvider = ({ children }: { children: ReactNode }) => {
  // Store the entire data object in state
  const [dayData, setDayData] = useState<TodayContextType>(getLogicalDayData());

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    const updateAtNextRollover = () => {
      const now = new Date();
      // Target is the next upcoming absolute 3:00 AM
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), ROLLOVER_HOUR, 0, 0, 0);
      
      if (now >= target) {
        target.setDate(target.getDate() + 1);
      }

      const msUntilRollover = target.getTime() - now.getTime();

      timerId = setTimeout(() => {
        setDayData(getLogicalDayData());
        updateAtNextRollover();
      }, msUntilRollover);
    };

    updateAtNextRollover();

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        setDayData(getLogicalDayData());
        clearTimeout(timerId);
        updateAtNextRollover();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      clearTimeout(timerId);
      subscription.remove();
    };
  }, []);

  return (
    <TodayContext.Provider value={dayData}>
      {children}
    </TodayContext.Provider>
  );
};

export const useToday = () => {
  const context = useContext(TodayContext);
  if (!context) throw new Error('useToday must be used within a TodayProvider');
  return context;
};