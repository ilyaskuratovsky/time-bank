import { useSQLiteContext, type SQLiteDatabase } from "expo-sqlite";
import { useCallback, useState, useEffect } from "react";
import { BankedTimes, StopWatch, StopWatches } from "./Types";

export function useStopWatchDatabase() {
  const db = useSQLiteContext();
  const [stopWatches, setStopWatches] = useState<StopWatches>({});
  const [isLoading, setIsLoading] = useState(true); // Track initial load

  const reload = useCallback(async () => {
    try {
      const result = await db.getAllAsync<StopWatch>(
        "SELECT id, accumulatedMillis, currentStartTimestampMillis, state FROM stop_watches",
      );

      const mapped = result.reduce(
        (
          acc,
          { id, accumulatedMillis, currentStartTimestampMillis, state },
        ) => {
          acc[id] = {
            id: id,
            accumulatedMillis: accumulatedMillis,
            currentStartTimestampMillis: currentStartTimestampMillis,
            state: state as "running" | "stopped",
          };
          return acc;
        },
        {} as StopWatches,
      );

      setStopWatches(mapped);
      console.log("Loaded stop watches from database:", mapped);
    } catch (e) {
      console.error("Failed to load banked times", e);
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  useEffect(() => {
    reload();
  }, [reload]);

  const start = async (key: string): Promise<void> => {
    console.log(`start`);
    await db.runAsync(
      `INSERT INTO stop_watches (id, state, accumulatedMillis, currentStartTimestampMillis) 
       VALUES (?, ?, ?, ?) 
       ON CONFLICT(id) DO UPDATE SET state = ?, currentStartTimestampMillis = ?`,
      [key, "running", 0, Date.now(), "running", Date.now()],
    );
    await reload();
  };

  const pause = async (id: string): Promise<void> => {
    console.log(`pause`);
    const now = Date.now();
    await db.runAsync(
      `UPDATE stop_watches 
   SET 
     state = ?, 
     accumulatedMillis = CASE 
       WHEN currentStartTimestampMillis IS NOT NULL 
       THEN accumulatedMillis + (? - currentStartTimestampMillis)
       ELSE accumulatedMillis
     END,
     currentStartTimestampMillis = NULL
   WHERE id = ?`,
      ["stopped", now, id],
    );
    await reload();
  };

  const reset = async (id: string): Promise<void> => {
    console.log(`reset`);

    await db.runAsync(
      `UPDATE stop_watches SET state = 'stopped', accumulatedMillis = 0 WHERE id=?`,
      [id],
    );
    await reload();
  };

  const getTime = async (id: string): Promise<number> => {
    const result = await db.getFirstAsync<StopWatch>(
      `SELECT state, accumulatedMillis, currentStartTimestampMillis FROM stop_watches WHERE id=?`,
      [id],
    );
    if (result != null) {
      const now = Date.now();
      if (result.state === "running") {
        const time =
          (result.accumulatedMillis ?? 0) +
          (result.currentStartTimestampMillis
            ? now - result.currentStartTimestampMillis
            : 0);
        //log(`getTime: ${time} ms`);
        return time;
      } else if (result.state === "stopped") {
        //console.log(`getTime: ${result.accumulatedMillis} ms`);
        return result.accumulatedMillis ?? 0;
      }
    }
    //console.log(`getTime: 0`);
    return 0;
  };
  return { start, pause, reset, getTime };
}
