import { useSQLiteContext, type SQLiteDatabase } from "expo-sqlite";
import { useCallback, useState, useEffect } from "react";
import { BankedTimes } from "./Types";
interface UseBankedTimesOptions {}

export function useTimeBankDatabase(options?: UseBankedTimesOptions) {
  const db = useSQLiteContext();
  const [bankedTimes, setBankedTimes] = useState<BankedTimes>({});
  const [isLoading, setIsLoading] = useState(true); // Track initial load

  const reload = useCallback(async () => {
    try {
      const result = await db.getAllAsync<{ key: string; value: number }>(
        "SELECT key, value FROM banked_time",
      );

      const mapped = result.reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {} as BankedTimes);

      setBankedTimes(mapped);
    } catch (e) {
      console.error("Failed to load banked times", e);
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  useEffect(() => {
    reload();
  }, [reload]);

  const add = async (key: string, value: number): Promise<void> => {
    await db.runAsync(
      `INSERT INTO banked_time (key, value) 
       VALUES (?, ?) 
       ON CONFLICT(key) 
       DO UPDATE SET value = value + excluded.value`,
      [key, value],
    );
    await reload();
  };

  const set = async (key: string, value: number): Promise<void> => {
    // Ensure the key exists; if not, insert it. If it exists, update it.
    console.log(`Setting banked time for ${key} to ${value}`);
    await db.runAsync(
      `INSERT INTO banked_time (key, value) 
       VALUES (?, ?) 
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      [key, value],
    );
    await reload();
  };

  const remove = async (key: string): Promise<void> => {
    await db.runAsync("DELETE FROM banked_time WHERE key = ?", [key]);
    await reload();
  };

  const get = useCallback(
    (key: string): number => {
      return bankedTimes[key] ?? 0;
    },
    [bankedTimes],
  );

  return { bankedTimes, reload, add, set, get, remove };
}
