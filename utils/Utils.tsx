export function formatTimeMilliseconds(totalMilliseconds: number): string {
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  return formatTime(totalSeconds);
}

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const remainingSecondsRounded = Math.round(remainingSeconds);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSecondsRounded).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

type Interval = {
  start: number;
  end: number;
};

/**
 * Calculates total seconds covered by intervals within [rangeStart, rangeEnd)
 */
export function getSecondsInRange(
  intervals: Interval[],
  rangeStart: number,
  rangeEnd: number,
): number {
  let totalMillis = 0;

  for (const interval of intervals) {
    // Find overlap between interval and range
    const overlapStart = Math.max(interval.start, rangeStart);
    const overlapEnd = Math.min(interval.end, rangeEnd);

    // Only add if there is a valid overlap
    if (overlapStart < overlapEnd) {
      totalMillis += overlapEnd - overlapStart;
    }
  }

  return Math.floor(totalMillis / 1000);
}

export function getTodayRange(): { start: number; end: number } {
  const now = new Date();

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setHours(24, 0, 0, 0); // exclusive end (next midnight)

  return {
    start: start.getTime(),
    end: end.getTime(),
  };
}

export function toTimeString(ts: number){
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
};