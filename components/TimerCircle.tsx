import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { formatTimeMilliseconds } from "../utils/Utils";

interface TimerCircleProps {
  remainingTimeMs: number;
  elapsedTimeMs: number;
  durationMs: number | null;
  isInfinity: boolean;
}

const SIZE = 164;
const STROKE_WIDTH = 11;
const RADIUS = 75;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const TimerCircle: React.FC<TimerCircleProps> = ({
  remainingTimeMs,
  elapsedTimeMs,
  durationMs,
  isInfinity,
}) => {
  const progress = useMemo(() => {
    if (isInfinity || durationMs == null || durationMs <= 0) {
      return 0;
    }
    return Math.min(Math.max(elapsedTimeMs / durationMs, 0), 1);
  }, [elapsedTimeMs, durationMs, isInfinity]);

  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View style={styles.wrapper}>
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

      <View style={styles.content}>
        <Text style={styles.timerText}>
          {remainingTimeMs === 0 && !isInfinity
            ? "00:00"
            : formatTimeMilliseconds(remainingTimeMs)}
        </Text>

        <Text style={styles.elapsedText}>
          {isInfinity ? "--:--" : formatTimeMilliseconds(elapsedTimeMs)}
        </Text>
      </View>
    </View>
  );
};

export default React.memo(TimerCircle);

const styles = StyleSheet.create({
  wrapper: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    position: "relative",
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
    width: 220,
    textAlign: "center",
    fontFamily: "TimerFont",
    fontVariant: ["tabular-nums"],
    letterSpacing: -1,
  },
  elapsedText: {
    fontSize: 18,
    color: "#555",
    marginTop: 8,
  },
});