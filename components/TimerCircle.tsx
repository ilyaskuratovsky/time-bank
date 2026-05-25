import React, { useMemo } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
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

// Fixed coordinate system space for the SVG.
// The actual rendering size on screen will scale smoothly automatically.
const SVG_VIEWBOX_SIZE = 172;
const RADIUS = 74;
const STROKE_WIDTH = 7;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SVG_VIEWBOX_SIZE / 2;

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
      {/* Svg container takes 100% width/height of the wrapper. 
          viewBox acts as the internal map scaling perfectly to fit. */}
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${SVG_VIEWBOX_SIZE} ${SVG_VIEWBOX_SIZE}`}
        style={StyleSheet.absoluteFillObject}
      >
        {/* Background Track */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke="#d9d9d9"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />

        {/* Progress Bar */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke="#007bff"
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${CENTER}, ${CENTER}`}
        />
      </Svg>

      <View style={styles.content} pointerEvents="none">
        <Text style={styles.timerText}>
          {remainingTimeMs === 0 && !isInfinity
            ? "00:00"
            : formatTimeMilliseconds(remainingTimeMs)}
        </Text>

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
    flex: 1, 
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    aspectRatio: 1, // Forces the container to remain a perfect square
    width: "100%",  // Allows it to scale down nicely if container is narrow
  },
  content: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 36, 
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    fontFamily: "TimerFont",
    fontVariant: ["tabular-nums"],
    letterSpacing: -1,
  },
  elapsedText: {
    fontSize: 22, 
    color: "#7a8088",
    marginTop: 6,
    fontFamily: "TimerFont",
    fontVariant: ["tabular-nums"],
  },
});