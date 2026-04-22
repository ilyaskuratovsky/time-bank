import React, { useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type TimeInput = string | number | Date;

export type TimeInterval = {
  start: TimeInput;
  end: TimeInput;
  color?: string;
  label?: string;
};

type Props = {
  intervals: TimeInterval[];
  height?: number;
  showHourLabels?: boolean;
  maxLabels?: number;
  trackColor?: string;
  tickColor?: string;
  labelColor?: string;
  style?: ViewStyle;
  roundness?: number;
};

const MINUTES_IN_DAY = 24 * 60;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function toMinutes(input: TimeInput): number {
  if (typeof input === "number") {
    return ((input % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  }

  if (input instanceof Date) {
    return input.getHours() * 60 + input.getMinutes();
  }

  const match = input.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) {
    throw new Error(
      `Invalid time "${input}". Use "HH:mm", "HH:mm:ss", minutes since midnight, or Date.`
    );
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error(`Invalid time "${input}".`);
  }

  return hours * 60 + minutes;
}

function formatHourLabel(hour: number) {
  if (hour === 0 || hour === 24) return "12a";
  if (hour < 12) return `${hour}a`;
  if (hour === 12) return "12p";
  return `${hour - 12}p`;
}

function getEvenlySpacedHours(maxLabels: number) {
  if (maxLabels <= 1) return [0];

  const step = 24 / (maxLabels - 1);

  return Array.from({ length: maxLabels }, (_, i) => {
    const value = Math.round(i * step);
    return i === maxLabels - 1 ? 24 : value;
  });
}

type NormalizedSegment = {
  startMin: number;
  endMin: number;
  color: string;
  label?: string;
};

function normalizeIntervals(intervals: TimeInterval[]): NormalizedSegment[] {
  const segments: NormalizedSegment[] = [];

  for (const interval of intervals) {
    const startMin = toMinutes(interval.start);
    const endMin = toMinutes(interval.end);
    const color = interval.color ?? "#4A90E2";

    if (startMin === endMin) continue;

    if (endMin < startMin) {
      segments.push({
        startMin,
        endMin: MINUTES_IN_DAY,
        color,
        label: interval.label,
      });
      segments.push({
        startMin: 0,
        endMin,
        color,
        label: interval.label,
      });
    } else {
      segments.push({
        startMin,
        endMin,
        color,
        label: interval.label,
      });
    }
  }

  return segments.sort((a, b) => a.startMin - b.startMin);
}

export const DayIntervalsTimeline: React.FC<Props> = ({
  intervals,
  height = 16,
  showHourLabels = true,
  maxLabels = 4,
  trackColor = "#E8EDF3",
  tickColor = "#C7D0DA",
  labelColor = "#6B7280",
  style,
  roundness = 999,
}) => {
  const [trackWidth, setTrackWidth] = useState(0);

  const segments = useMemo(() => normalizeIntervals(intervals), [intervals]);

  const labelHours = useMemo(
    () => getEvenlySpacedHours(Math.max(1, Math.min(maxLabels, 4))),
    [maxLabels]
  );

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: trackColor,
            borderRadius: roundness,
          },
        ]}
        onLayout={handleTrackLayout}
      >
        {trackWidth > 0 &&
          segments.map((segment, index) => {
            const left = (segment.startMin / MINUTES_IN_DAY) * trackWidth;
            const width =
              ((segment.endMin - segment.startMin) / MINUTES_IN_DAY) *
              trackWidth;

            return (
              <View
                key={`${segment.startMin}-${segment.endMin}-${index}`}
                style={[
                  styles.segment,
                  {
                    left: clamp(left, 0, trackWidth),
                    width: clamp(width, 0, trackWidth),
                    height,
                    backgroundColor: segment.color,
                    borderRadius: roundness,
                  },
                ]}
              />
            );
          })}

        {trackWidth > 0 &&
          labelHours.map((hour, i) => {
            const x = (hour / 24) * trackWidth;

            return (
              <View
                key={`tick-${hour}-${i}`}
                style={[
                  styles.tick,
                  {
                    left: clamp(x - 0.5, 0, trackWidth),
                    backgroundColor: tickColor,
                    height: height + 8,
                  },
                ]}
              />
            );
          })}
      </View>

      {showHourLabels && trackWidth > 0 && (
        <View style={styles.labelsRow}>
          {labelHours.map((hour, i) => {
            const leftPct = (hour / 24) * 100;

            return (
              <View
                key={`label-${hour}-${i}`}
                style={[
                  styles.labelWrap,
                  {
                    left: `${leftPct}%`,
                  },
                ]}
              >
                <Text style={[styles.label, { color: labelColor }]}>
                  {formatHourLabel(hour)}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  track: {
    position: "relative",
    width: "100%",
    overflow: "visible",
  },
  segment: {
    position: "absolute",
    top: 0,
  },
  tick: {
    position: "absolute",
    top: -4,
    width: 1,
  },
  labelsRow: {
    position: "relative",
    height: 24,
    marginTop: 8,
  },
  labelWrap: {
    position: "absolute",
    transform: [{ translateX: -12 }],
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
  },
});