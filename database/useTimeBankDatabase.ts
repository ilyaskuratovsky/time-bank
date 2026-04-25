import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";

export type Interval = {
  start: number;
  end: number;
};

export type ManualRecord = {
  ts: number;
  seconds: number; // positive = added, negative = removed
};

export type ProjectIntervals = Record<string, Interval[]>;
export type ProjectManualRecords = Record<string, ManualRecord[]>;

export function useTimeBankDatabase() {
  const db = useSQLiteContext();

  const [intervalsByProject, setIntervalsByProject] =
    useState<ProjectIntervals>({});

  const [manualRecordsByProject, setManualRecordsByProject] =
    useState<ProjectManualRecords>({});

  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      const result = await db.getAllAsync<{
        key: string;
        intervals: string | null;
        manualRecords: string | null;
      }>("SELECT key, intervals, manualRecords FROM banked_time");

      const intervalsMapped: ProjectIntervals = {};
      const manualMapped: ProjectManualRecords = {};

      for (const row of result) {
        intervalsMapped[row.key] = row.intervals
          ? JSON.parse(row.intervals)
          : [];

        manualMapped[row.key] = row.manualRecords
          ? JSON.parse(row.manualRecords)
          : [];
      }

      setIntervalsByProject(intervalsMapped);
      setManualRecordsByProject(manualMapped);
    } catch (e) {
      console.error("Failed to load time bank data", e);
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  useEffect(() => {
    reload();
  }, [reload]);

  const set = async (
    key: string,
    intervals: Interval[],
    manualRecords: ManualRecord[] = manualRecordsByProject[key] ?? [],
  ): Promise<void> => {
    await db.runAsync(
      `INSERT INTO banked_time (key, intervals, manualRecords)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET
         intervals = excluded.intervals,
         manualRecords = excluded.manualRecords`,
      [key, JSON.stringify(intervals), JSON.stringify(manualRecords)],
    );

    await reload();
  };

  const setManualRecords = async (
    key: string,
    manualRecords: ManualRecord[],
  ): Promise<void> => {
    await set(key, intervalsByProject[key] ?? [], manualRecords);
  };

  const addInterval = async (key: string, interval: Interval): Promise<void> => {
    await set(key, [...(intervalsByProject[key] ?? []), interval]);
  };

  const addIntervals = async (
    key: string,
    intervals: Interval[],
  ): Promise<void> => {
    await set(key, [...(intervalsByProject[key] ?? []), ...intervals]);
  };

  const addManualRecord = async (
    key: string,
    ts: number,
    seconds: number
  ): Promise<void> => {
    await setManualRecords(key, [
      ...(manualRecordsByProject[key] ?? []),
      { ts, seconds },
    ]);
  };

  const remove = async (key: string): Promise<void> => {
    await db.runAsync("DELETE FROM banked_time WHERE key = ?", [key]);
    await reload();
  };

  const getIntervals = useCallback(
    (key: string): Interval[] => intervalsByProject[key] ?? [],
    [intervalsByProject],
  );

  const getManualRecords = useCallback(
    (key: string): ManualRecord[] => manualRecordsByProject[key] ?? [],
    [manualRecordsByProject],
  );

  const getIntervalSeconds = useCallback(
    (key: string): number => {
      return Math.floor(
        getIntervals(key).reduce(
          (total, interval) => total + (interval.end - interval.start),
          0,
        ) / 1000,
      );
    },
    [getIntervals],
  );

  const getManualSeconds = useCallback(
    (key: string): number => {
      return getManualRecords(key).reduce(
        (total, record) => total + record.seconds,
        0,
      );
    },
    [getManualRecords],
  );

  const getTotalSeconds = useCallback(
    (key: string): number => {
      return getIntervalSeconds(key) + getManualSeconds(key);
    },
    [getIntervalSeconds, getManualSeconds],
  );

  return {
    intervalsByProject,
    manualRecordsByProject,
    isLoading,
    reload,

    set,
    setManualRecords,

    addInterval,
    addIntervals,
    addManualRecord,

    getIntervals,
    getManualRecords,
    getIntervalSeconds,
    getManualSeconds,
    getTotalSeconds,

    remove,
  };
}