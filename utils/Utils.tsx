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
