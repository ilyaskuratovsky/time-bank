import { useCallback, useEffect, useRef, useState } from "react";
import { StopWatchData } from "./Types";
import { useStopWatchDatabase } from "./useStopWatchDatabase";

const store = new Map<string, StopWatchData>();

function getOrCreateStopWatch(id: string): StopWatchData {
  let existing = store.get(id);
  if (existing) return existing;

  existing = {
    accumulatedMillis: 0,
    startedAtMillis: null,
    state: "stopped",
    intervals: [],
  };

  store.set(id, existing);
  return existing;
}

function getElapsedMillis(stopWatch: StopWatchData): number {
  if (stopWatch.state !== "running" || stopWatch.startedAtMillis == null) {
    return stopWatch.accumulatedMillis;
  }

  return stopWatch.accumulatedMillis + (Date.now() - stopWatch.startedAtMillis);
}

export function useStopWatch(id: string): {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  reset: () => Promise<void>;
  time: number;
  state: "running" | "stopped";
  intervals: { start: number; end: number }[];
  isLoaded: boolean;
} {
  const { get: getDatabase, update: updateDatabase } = useStopWatchDatabase();

  const [, setTick] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rerender = useCallback(() => {
    setTick((x) => x + 1);
  }, []);

  const clearScheduledTick = useCallback(() => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const scheduleNextTick = useCallback(() => {
    clearScheduledTick();

    const stopWatch = getOrCreateStopWatch(id);
    if (stopWatch.state !== "running") return;

    const elapsed = getElapsedMillis(stopWatch);
    const remainder = elapsed % 1000;
    const delay = remainder === 0 ? 1000 : 1000 - remainder;

    timeoutRef.current = setTimeout(() => {
      rerender();
      scheduleNextTick();
    }, delay);
  }, [clearScheduledTick, id, rerender]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const dbValue = await getDatabase(id);
      if (cancelled) return;

      const stopWatch = getOrCreateStopWatch(id);

      if (dbValue) {
        stopWatch.accumulatedMillis = dbValue.accumulatedMillis;
        stopWatch.startedAtMillis = dbValue.startedAtMillis;
        stopWatch.state = dbValue.state;
        stopWatch.intervals = dbValue.intervals ?? [];
      }

      if (stopWatch.state === "running") {
        scheduleNextTick();
      }

      setIsLoaded(true);
      rerender();
    }

    load();

    return () => {
      cancelled = true;
      clearScheduledTick();
    };
  }, [clearScheduledTick, getDatabase, id, rerender, scheduleNextTick]);

  const start = useCallback(async () => {
    const stopWatch = getOrCreateStopWatch(id);
    if (stopWatch.state === "running") return;

    const now = Date.now();

    stopWatch.state = "running";
    stopWatch.startedAtMillis = now;

    await updateDatabase(
      id,
      stopWatch.state,
      stopWatch.accumulatedMillis,
      stopWatch.startedAtMillis,
      stopWatch.intervals,
    );

    rerender();
    scheduleNextTick();
  }, [id, rerender, scheduleNextTick, updateDatabase]);

  const stop = useCallback(async () => {
    const stopWatch = getOrCreateStopWatch(id);

    if (stopWatch.state !== "running" || stopWatch.startedAtMillis == null) {
      return;
    }

    const now = Date.now();

    stopWatch.accumulatedMillis += now - stopWatch.startedAtMillis;

    stopWatch.intervals.push({
      start: stopWatch.startedAtMillis,
      end: now,
    });

    stopWatch.startedAtMillis = null;
    stopWatch.state = "stopped";

    await updateDatabase(
      id,
      stopWatch.state,
      stopWatch.accumulatedMillis,
      stopWatch.startedAtMillis,
      stopWatch.intervals,
    );

    clearScheduledTick();
    rerender();
  }, [clearScheduledTick, id, rerender, updateDatabase]);

  const reset = useCallback(async () => {
    const stopWatch = getOrCreateStopWatch(id);

    stopWatch.accumulatedMillis = 0;
    stopWatch.startedAtMillis = null;
    stopWatch.state = "stopped";
    stopWatch.intervals = [];

    await updateDatabase(
      id,
      stopWatch.state,
      stopWatch.accumulatedMillis,
      stopWatch.startedAtMillis,
      stopWatch.intervals,
    );

    clearScheduledTick();
    rerender();
  }, [clearScheduledTick, id, rerender, updateDatabase]);

  const stopWatch = getOrCreateStopWatch(id);
  const time = getElapsedMillis(stopWatch);
  const state = stopWatch.state;
  const intervals = stopWatch.intervals;

  return { start, stop, reset, state, time, intervals, isLoaded };
}