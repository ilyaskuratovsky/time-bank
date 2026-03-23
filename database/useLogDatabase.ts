import { useSQLiteContext, type SQLiteDatabase } from "expo-sqlite";
import { useCallback, useState, useEffect } from "react";
import { LogItem } from "./Types";

export function useLogDatabase() {
  const db = useSQLiteContext();
  const [log, setLog] = useState<Array<LogItem>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const reload = useCallback(async () => {
    try {
      const result = await db.getAllAsync<{ ts: number; value: string }>(
        "SELECT ts, value FROM log",
      );

      setLog(result);
    } catch (e) {
      console.error("Failed to load log items", e);
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  useEffect(() => {
    reload();
  }, [reload]);

  const add = async (ts: number, value: string): Promise<void> => {
    await db.runAsync(
      `INSERT INTO log (ts, value) 
       VALUES (?, ?)`,
      [ts, value],
    );
    await reload();
  };

  return { log, reload, add };
}
