import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { formatTimeMilliseconds } from "../utils/Utils";
import { useFonts, RobotoMono_500Medium } from "@expo-google-fonts/roboto-mono";
import { Stopwatch } from "../utils/Stopwatch";

import logger from "../utils/Logger";
import nullthrows from "../utils/nullthrows";
import { useDatabaseContext } from "../database/DatabaseContext";
import { useStopWatchDatabase } from "../database/useStopWatchDatabase";
import { useStopWatch } from "../database/useStopWatch";

interface TimerProps {
  bankTime: (milliseconds: number) => Promise<void>;
}

const Timer: React.FC<TimerProps> = ({ bankTime }) => {
  const {
    start: startStopWatch,
    stop: stopStopWatch,
    reset: resetStopWatch,
    time: stopWatchTime,
    state: stopWatchState,
  } = useStopWatch("_");
  const reset = (x: string) => {};

  const handleStart = (): void => {
    startStopWatch();
  };

  const handleStop = (): void => {
    stopStopWatch();
  };

  const handleBankTime = async (): Promise<void> => {
    resetStopWatch();
    console.log(`Banking time: ${stopWatchTime} ms`);
    await bankTime(stopWatchTime / 1000);
    handleStop();
  };

  const handleClear = async (): Promise<void> => {
    resetStopWatch();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>
        {formatTimeMilliseconds(stopWatchTime)}
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
