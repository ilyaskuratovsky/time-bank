import { useSQLiteContext, type SQLiteDatabase } from "expo-sqlite";
import { useCallback, useState, useEffect } from "react";
import { BankedTimes, StopWatch, StopWatchData, StopWatches, StopWatchInterval, StopWatchDataRow } from "./Types";

export function useStopWatchDatabase() {
  const db = useSQLiteContext();

  const update = async (
    key: string,
    state: "running" | "stopped",
    accumulatedMillis: number,
    startedAtMillis: number | null,
    intervals: StopWatchInterval[],
  ): Promise<void> => {
    await db.runAsync(
      `INSERT INTO stop_watches (
        id,
        state,
        startedAtMillis,
        accumulatedMillis,
        intervals
      )
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        state = excluded.state,
        startedAtMillis = excluded.startedAtMillis,
        accumulatedMillis = excluded.accumulatedMillis,
        intervals = excluded.intervals`,
      [
        key,
        state,
        startedAtMillis,
        accumulatedMillis,
        JSON.stringify(intervals),
      ],
    );
  };

  const get = async (id: string): Promise<StopWatchData | null> => {
    const result = await db.getFirstAsync<StopWatchDataRow>(
      `SELECT state, startedAtMillis, accumulatedMillis, intervals
       FROM stop_watches
       WHERE id = ?`,
      [id],
    );

    if (!result) return null;

    return {
      ...result,
      intervals: result.intervals ? JSON.parse(result.intervals) : [],
    };
  };

  return { get, update };
}