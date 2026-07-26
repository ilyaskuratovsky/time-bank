import { getSecondsInRange } from "../utils/Utils"; // Assuming getSecondsInRange is needed

interface TimeInterval {
  start: number;
  end: number;
}

interface ManualRecord {
  ts: number;
  seconds: number;
}

export function calculateTime(
  allIntervals: TimeInterval[],
  allManualRecords: ManualRecord[],
  todayStartTs: number,
  todayEndTs: number,
): number {
  let baseTime = 0;
  let effectiveStartTimeForIntervals = todayStartTs;

  // 1. Filter manual records for the current day and sort by timestamp to find the latest.
  const relevantManualRecords = allManualRecords
    .filter((record) => record.ts >= todayStartTs && record.ts < todayEndTs)
    .sort((a, b) => a.ts - b.ts);

  // 2. If a manual record exists for today, its value becomes the base,
  //    and we only consider intervals starting after its timestamp.
  const latestManualRecord = relevantManualRecords.length > 0
    ? relevantManualRecords[relevantManualRecords.length - 1]
    : null;

  if (latestManualRecord) {
    baseTime = latestManualRecord.seconds; // This is the total set at the time of the manual record
    effectiveStartTimeForIntervals = latestManualRecord.ts; // Subsequent intervals add to this
  }

  // 3. Add intervals that occurred after the effective start time (which is either
  //    the start of today or the timestamp of the latest manual override).
  const intervalSecondsToAdd = allIntervals
    .filter(
      (interval) =>
        interval.start >= effectiveStartTimeForIntervals &&
        interval.end <= todayEndTs // Ensure intervals are within today
    )
    .reduce((total, interval) => {
      return total + (interval.end - interval.start) / 1000;
    }, 0);

  return baseTime + intervalSecondsToAdd;
}
