import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Pressable,
  Vibration,
  AppState,
} from "react-native";
import { formatTimeMilliseconds } from "../utils/Utils";
import { useStopWatch } from "../database/useStopWatch";
import * as Notifications from "expo-notifications";
import nullthrows from "../utils/nullthrows";

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
  const notificationIdRef = useRef<string | null>(null);

  const durationMs = DURATIONS[selectedDuration];
  const isInfinity = durationMs === null;

  const remainingTime = isInfinity
    ? stopWatchTime
    : Math.max(durationMs - (stopWatchTime ?? 0), 0);
  const [timerWaitingToFinish, setTimerWaitingToFinish] =
    useState<boolean>(false);
  // Vibrate once when countdown reaches 0
  const prevRef = useRef<number | null>(null);

  useEffect(() => {
    if (!timerWaitingToFinish) {
      return;
    }
    const checkTimer = async () => {
      if (remainingTime == null) {
        return;
      }
      if (Math.ceil((remainingTime ?? 0)/1000) != Math.ceil((prevRef.current ?? 0)/1000)) {
        console.log("remainingTime:" + remainingTime);
      }
      if (
        !isInfinity &&
        prevRef.current !== null &&
        prevRef.current > 0 &&
        remainingTime <= 0
      ) {
        setTimerWaitingToFinish(false);
        //console.log("fire timer finished here, remainingTime: " + remainingTime + ", stopWatchTime: " + stopWatchTime);
        await cancelTimerNotification(); // ✅ ADD THIS
        await onTimerFinished();
      }
      prevRef.current = remainingTime;
    };
    checkTimer();
  }, [remainingTime, isInfinity]);

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      appState.current = nextState;
    });

    return () => sub.remove();
  }, []);

  const onTimerFinished = async () => {
    if (appState.current === "active") {
      console.log("timer done, vibrating");
      Vibration.vibrate(2000);
      return;
    }
  };

  const handleSelectDuration = async (key: DurationKey) => {
    setSelectedDuration(key);
    resetStopWatch();
    setTimerWaitingToFinish(false);
    await cancelTimerNotification();
  };

  const cancelTimerNotification = async () => {
    if (notificationIdRef.current) {
      await Notifications.cancelScheduledNotificationAsync(
        notificationIdRef.current,
      );
      notificationIdRef.current = null;
    }
  };

  const scheduleTimerNotification = async (time: number) => {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "xTimer done",
        body: "Your timer finished",
        sound: "alarm_1.caf",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(1, Math.ceil(time / 1000)),
      },
    });
    notificationIdRef.current = id;
  };

  const handleStart = async (): Promise<void> => {
    console.log("handle start");
    startStopWatch();
    await cancelTimerNotification();
    if (!isInfinity) {
      const hasPermission = await checkNotificationPermissions();
      if (hasPermission) {
        await scheduleTimerNotification(nullthrows(remainingTime));
      }
      setTimerWaitingToFinish(true);
    }
  };
  const handleStop = async (): Promise<void> => {
    console.log("handle stop");
    stopStopWatch();
    setTimerWaitingToFinish(false);
    await cancelTimerNotification();
  };

  const handleBankTime = async (): Promise<void> => {
    console.log("handle bank time");
    if (stopWatchTime != null) {
      const elapsed = stopWatchTime;
      console.log(`Banking time: ${elapsed} ms`);
      await cancelTimerNotification();
      await bankTime(elapsed / 1000);
      setTimerWaitingToFinish(false);
      resetStopWatch();
    }
  };

  const handleClear = async (): Promise<void> => {
    resetStopWatch();
    setTimerWaitingToFinish(false);
    await cancelTimerNotification();
  };

  const checkNotificationPermissions = async (): Promise<boolean> => {
    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    console.log("existing permission:", existing);

    if (status !== "granted") {
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
      console.log("requested permission:", requested);
    }

    if (status !== "granted") {
      console.log("Notifications permission not granted");
      return false;
    }
    return true;
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
          : formatTimeMilliseconds(remainingTime ?? 0)}
      </Text>

      {/* Elapsed Time */}
      <Text style={styles.elapsedText}>
        {isInfinity && remainingTime === stopWatchTime
          ? "--:--"
          : formatTimeMilliseconds(stopWatchTime ?? 0)}
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
