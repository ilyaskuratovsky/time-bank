import { useSQLiteContext, type SQLiteDatabase } from "expo-sqlite";
import { useCallback, useState, useEffect } from "react";
import { BankedTimes, StopWatch, StopWatchData, StopWatches } from "./Types";

export function useStopWatchDatabase() {
  const db = useSQLiteContext();

  const update = async (
    key: string,
    state: "running" | "stopped",
    accumulatedMillis: number,
    startedAtMillis: number | null,
  ): Promise<void> => {
    console.log(`useStopWatchDatabase: update, key: ${key}, state: ${state}, accumulatedMillis: ${accumulatedMillis}, startedAtMillis: ${startedAtMillis}`);
    await db.runAsync(
      `INSERT INTO stop_watches (id, state, startedAtMillis, accumulatedMillis)
   VALUES (?, ?, ?, ?)
   ON CONFLICT(id) DO UPDATE SET
     state = excluded.state,
     startedAtMillis = excluded.startedAtMillis,
     accumulatedMillis = excluded.accumulatedMillis`,
      [key, state, startedAtMillis, accumulatedMillis],
    );
  };

  const get = async (id: string): Promise<StopWatchData | null> => {
    const result = await db.getFirstAsync<StopWatchData>(
      `SELECT state, startedAtMillis, accumulatedMillis FROM stop_watches WHERE id=?`,
      [id],
    );
    return result;
  };

  return { get, update };
}
