// types.ts
export interface BankedTimes {
  [key: string]: number;
}

export interface StopWatches {
  [key: string]: StopWatch;
}

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
