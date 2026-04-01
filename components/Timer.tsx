import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Vibration } from "react-native";
import { formatTimeMilliseconds } from "../utils/Utils";
import { useStopWatch } from "../database/useStopWatch";

interface TimerProps {
  project: string;
  bankTime: (milliseconds: number) => Promise<void>;
}

const DURATIONS = {
  "5s": 5 * 1000,
  "5m": 5 * 60 * 1000,
  "15m": 15 * 60 * 1000,
  "30m": 30 * 60 * 1000,
  Infinity: null as number | null,
};

type DurationKey = keyof typeof DURATIONS;

const Timer: React.FC<TimerProps> = ({ project, bankTime }) => {
  const {
    start: startStopWatch,
    stop: stopStopWatch,
    reset: resetStopWatch,
    time: stopWatchTime,
    state: stopWatchState,
  } = useStopWatch(project);

  const [selectedDuration, setSelectedDuration] = useState<DurationKey>("15m");
  const [vibrated, setVibrated] = useState(false);

  const durationMs = DURATIONS[selectedDuration];
  const isInfinity = durationMs === null;

  const remainingTime = isInfinity
    ? stopWatchTime
    : Math.max(durationMs - stopWatchTime, 0);

  // Vibrate once when countdown reaches 0
  useEffect(() => {
    if (!isInfinity && remainingTime === 0 && stopWatchTime > 0 && !vibrated) {
      Vibration.vibrate(1000);
      setVibrated(true);
    }
    if (remainingTime > 0) {
      setVibrated(false); // reset vibrated when timer restarted
    }
  }, [remainingTime, isInfinity, stopWatchTime, vibrated]);

  const handleSelectDuration = (key: DurationKey) => {
    setSelectedDuration(key);
    resetStopWatch();
    setVibrated(false);
  };

  const handleStart = (): void => startStopWatch();
  const handleStop = (): void => stopStopWatch();

  const handleBankTime = async (): Promise<void> => {
    const elapsed = stopWatchTime;
    console.log(`Banking time: ${elapsed} ms`);
    await bankTime(elapsed / 1000);
    resetStopWatch();
    stopStopWatch();
    setVibrated(false);
  };

  const handleClear = async (): Promise<void> => {
    resetStopWatch();
    setVibrated(false);
  };

  return (
    <View style={styles.container}>
      {/* Duration Selector */}
      <View style={styles.durationContainer}>
        {(Object.keys(DURATIONS) as DurationKey[]).map((key) => (
          <Pressable
            key={key}
            onPress={() => handleSelectDuration(key)}
            style={[
              styles.durationButton,
              selectedDuration === key && styles.durationButtonActive,
            ]}
          >
            <Text
              style={[
                styles.durationText,
                selectedDuration === key && styles.durationTextActive,
              ]}
            >
              {key}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Main Timer Text */}
      <Text style={styles.timerText}>
        {remainingTime === 0 && !isInfinity
          ? "00:00"
          : formatTimeMilliseconds(remainingTime)}
      </Text>

      {/* Elapsed Time */}
      <Text style={styles.elapsedText}>
        {isInfinity && remainingTime === stopWatchTime
          ? "--:--"
          : formatTimeMilliseconds(stopWatchTime)}
      </Text>

      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleClear}
          style={[styles.button, styles.clearButton]}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </Pressable>

        {stopWatchState === "stopped" && (
          <Pressable
            onPress={handleStart}
            style={[styles.button, styles.startButton]}
          >
            <Text style={styles.buttonText}>Start</Text>
          </Pressable>
        )}

        {stopWatchState === "running" && (
          <Pressable
            onPress={handleStop}
            style={[styles.button, styles.stopButton]}
          >
            <Text style={styles.buttonText}>Pause</Text>
          </Pressable>
        )}

        <Pressable
          onPress={handleBankTime}
          style={[styles.button, styles.bankButton]}
        >
          <Text style={styles.buttonText}>Bank</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
    padding: 0,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#e6ffe6",
  },
  durationContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  durationButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#ccc",
    minWidth: 60,
    alignItems: "center",
  },
  durationButtonActive: {
    backgroundColor: "#007bff",
  },
  durationText: {
    color: "#333",
    fontWeight: "600",
  },
  durationTextActive: {
    color: "#fff",
  },
  timerText: {
    fontSize: 72,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#333",
    width: 300,
    textAlign: "center",
    fontFamily: "TimerFont",
    fontVariant: ["tabular-nums"],
    letterSpacing: -1,
  },
  elapsedText: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    paddingBottom: 15,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  startButton: {
    backgroundColor: "#28a745",
    minWidth: 80,
  },
  stopButton: {
    backgroundColor: "#dc3545",
    minWidth: 80,
  },
  bankButton: {
    backgroundColor: "#ffc107",
    minWidth: 80,
  },
  clearButton: {
    backgroundColor: "#6c757d",
    minWidth: 80,
  },
});

export default Timer;
