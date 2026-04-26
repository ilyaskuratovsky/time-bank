import React, { useMemo } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { formatTimeMilliseconds } from "../utils/Utils";

interface TimerCircleProps {
  remainingTimeMs: number;
  elapsedTimeMs: number;
  durationMs: number | null;
  isInfinity: boolean;
  state: "running" | "stopped";
  onStart: () => Promise<void>;
  onStop: () => Promise<void>;
}

const SIZE = 200;
const STROKE_WIDTH = 9;
const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const TimerCircle: React.FC<TimerCircleProps> = ({
  remainingTimeMs,
  elapsedTimeMs,
  durationMs,
  isInfinity,
  state,
  onStart,
  onStop,
}) => {
  const progress = useMemo(() => {
    if (isInfinity || durationMs == null || durationMs <= 0) {
      return 0;
    }

    return Math.min(Math.max(elapsedTimeMs / durationMs, 0), 1);
  }, [elapsedTimeMs, durationMs, isInfinity]);

  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const handlePress = async () => {
    if (state === "running") {
      await onStop();
    } else {
      await onStart();
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.wrapper}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="#d9d9d9"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />

        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="#007bff"
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>

      <View style={styles.content} pointerEvents="none">
        <Text style={styles.timerText}>
          {remainingTimeMs === 0 && !isInfinity
            ? "00:00"
            : formatTimeMilliseconds(remainingTimeMs)}
        </Text>

        <View style={styles.controlButton}>
          <Ionicons
            name={state === "running" ? "pause" : "play"}
            size={16}
            color="#fff"
          />
        </View>
        <Text style={styles.elapsedText}>
          {formatTimeMilliseconds(elapsedTimeMs)}
        </Text>

      </View>
    </Pressable>
  );
};

export default React.memo(TimerCircle);

const styles = StyleSheet.create({
  wrapper: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 0,
    position: "relative",
  },
  content: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    fontFamily: "TimerFont",
    fontVariant: ["tabular-nums"],
    letterSpacing: -1,
  },
  elapsedText: {
    fontSize: 16,
    color: "#7a8088",
    marginTop: 6,
    fontFamily: "TimerFont",
    fontVariant: ["tabular-nums"],
  },
  controlButton: {
    marginTop: 4,
    width: 30,
    height: 30,
    borderRadius: 24,
    backgroundColor: "#28a745",
    alignItems: "center",
    justifyContent: "center",
  },
});