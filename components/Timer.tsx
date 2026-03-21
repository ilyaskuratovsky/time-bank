import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { formatTimeMilliseconds } from "../utils/Utils";
import { useFonts, RobotoMono_500Medium } from "@expo-google-fonts/roboto-mono";
import { Stopwatch } from "../utils/Stopwatch";
interface TimerProps {
  bankTime: (milliseconds: number) => Promise<void>;
}

const Timer: React.FC<TimerProps> = ({ bankTime }) => {
  const [milliseconds, setMilliseconds] = useState(0);
  const [status, setStatus] = useState<"stopped" | "running">("stopped"); // Status can only be 'stopped' or 'running'
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stopwatch = useRef<Stopwatch>(new Stopwatch()); // Initialize with 59 minutes

  const handleStart = (): void => {
    stopwatch.current.start();
    setStatus("running");
  };

  const handleStop = (): void => {
    stopwatch.current.pause();
    setStatus("stopped");
  };

  const handleBankTime = async (): Promise<void> => {
    await bankTime(stopwatch.current.timeElapsedSeconds() ?? 0);
    stopwatch.current.reset();
    handleStop();
  };

  const handleClear = (): void => {
    stopwatch.current.reset();
    setStatus("stopped");
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setMilliseconds(() => stopwatch.current.timeElapsedMilliseconds());
    }, 10);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>
        {formatTimeMilliseconds(milliseconds)}
      </Text>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleClear}
          style={[styles.button, styles.clearButton]}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </Pressable>
        {status === "stopped" && (
          <Pressable
            onPress={handleStart}
            style={[styles.button, styles.startButton]}
          >
            <Text style={styles.buttonText}>Start</Text>
          </Pressable>
        )}
        {status === "running" && (
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
  timerText: {
    fontSize: 72,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#333",
    width: 300,
    textAlign: "center",
    fontFamily: "TimerFont", // Using the name we defined in useFonts
    fontVariant: ["tabular-nums"], // Ensures digits don't jump around
    letterSpacing: -1,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    paddingBottom: 15,
  },
  leftSpacer: {
    flex: 1,
  },
  centerAlignedButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 5,
    gap: 10,
    backgroundColor: "blue",
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
  rightButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  clearButton: {
    backgroundColor: "#6c757d",
    minWidth: 80,
  },
});

export default Timer;
