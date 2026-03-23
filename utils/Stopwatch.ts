import logger from "../utils/Logger";

export class Stopwatch {
  private startedAt: number | null = null;
  private accumulatedMs: number = 0;

  constructor() {
    logger.logMessage(`Stopwatch initialized`);
  }
  /**
   * Starts or resumes the timer
   */
  start() {
    logger.logMessage(`Stopwatch.start() called`);
    if (this.startedAt !== null) return; // already running
    this.startedAt = performance.now();
  }

  /**
   * Resets the timer to 0 and stops it
   */
  reset() {
    logger.logMessage(`Stopwatch.reset() called`);

    this.startedAt = null;
    this.accumulatedMs = 0;
  }

  /**
   * Returns elapsed time in milliseconds
   * (safe against backgrounding + clock changes)
   */
  timeElapsedMilliseconds(): number {
    if (this.startedAt === null) {
      return this.accumulatedMs;
    }

    return this.accumulatedMs + (performance.now() - this.startedAt);
  }

  /**
   * Returns elapsed time in milliseconds
   * (safe against backgrounding + clock changes)
   */
  timeElapsedSeconds(): number {
    return this.timeElapsedMilliseconds() / 1000;
  }

  /**
   * Optional: pause support (useful extension)
   */
  pause() {
    logger.logMessage(`Stopwatch.pause() called`);
    if (this.startedAt === null) return;

    this.accumulatedMs += performance.now() - this.startedAt;
    this.startedAt = null;
  }

  /**
   * Optional: whether timer is currently running
   */
  isRunning(): boolean {
    return this.startedAt !== null;
  }
}
