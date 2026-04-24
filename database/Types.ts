// types.ts
export interface BankedTimes {
  [key: string]: number;
}

export interface StopWatches {
  [key: string]: StopWatch;
}

export type StopWatchInterval = {
  start: number;
  end: number;
};

export type StopWatchDataRow = {
  state: "running" | "stopped";
  startedAtMillis: number | null;
  accumulatedMillis: number;
  intervals: string | null;
};

export type StopWatchData = {
  accumulatedMillis: number;
  startedAtMillis: number | null;
  state: "running" | "stopped";
  intervals: StopWatchInterval[];
};

export interface StopWatch {
  id: string;
  currentStartTimestampMillis: number | null;
  accumulatedMillis: number | null;
  state: "running" | "stopped";
}

export interface LogItem {
  ts: number;
  value: string;
}
