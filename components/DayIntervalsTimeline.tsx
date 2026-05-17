import React, { useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  ScrollView,
} from "react-native";
import { mapIntervalsToReadableTime } from "../utils/Utils";
import { useDebug } from "../context/DebugContext";

type TimeInput = number;

export type TimeInterval = {
  start: TimeInput;
  end: TimeInput;
  color?: string;
  label?: string;
};

type Props = {
  intervals: TimeInterval[];
  startTimestampMs: number; // Absolute start of the logical day timeline (e.g. 3:00 AM)
  endTimestampMs: number; // Absolute end of the logical day timeline (e.g. 2:59:59 AM next day)
  height?: number;
  showHourLabels?: boolean;
  maxLabels?: number;
  trackColor?: string;
  tickColor?: string;
  labelColor?: string;
  style?: ViewStyle;
  roundness?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Converts an absolute timestamp to its relative minute position along the custom logical timeline duration.
 */
function toTimelineMinutes(
  timestamp: number,
  timelineStartMs: number,
  totalDurationMin: number,
): number {
  const diffMs = timestamp - timelineStartMs;
  const minutes = diffMs / 1000 / 60;
  return clamp(minutes, 0, totalDurationMin);
}

function formatHourLabel(hour: number) {
  const normalizedHour = ((hour % 24) + 24) % 24;
  if (normalizedHour === 0) return "12am";
  if (normalizedHour < 12) return `${normalizedHour}am`;
  if (normalizedHour === 12) return "12pm";
  return `${normalizedHour - 12}pm`;
}

/**
 * Returns evenly spaced hour values offset by the starting hour of the timeline.
 */
function getEvenlySpacedHours(maxLabels: number, startTimestampMs: number) {
  const startHour = new Date(startTimestampMs).getHours();
  if (maxLabels <= 1) return [startHour];

  const step = 24 / (maxLabels - 1);

  return Array.from({ length: maxLabels }, (_, i) => {
    const rawValue = startHour + i * step;
    return Math.round(rawValue);
  });
}

type NormalizedSegment = {
  startMin: number;
  endMin: number;
  color: string;
  label?: string;
};

function normalizeIntervals(
  intervals: TimeInterval[],
  timelineStartMs: number,
  totalDurationMin: number,
): NormalizedSegment[] {
  const segments: NormalizedSegment[] = [];

  for (const interval of intervals) {
    const startMin = toTimelineMinutes(
      interval.start,
      timelineStartMs,
      totalDurationMin,
    );
    const endMin = toTimelineMinutes(
      interval.end,
      timelineStartMs,
      totalDurationMin,
    );
    const color = interval.color ?? "#4A90E2";

    if (startMin === endMin) continue;

    segments.push({
      startMin,
      endMin,
      color,
      label: interval.label,
    });
  }

  return segments.sort((a, b) => a.startMin - b.startMin);
}

export const DayIntervalsTimeline: React.FC<Props> = ({
  intervals,
  startTimestampMs,
  endTimestampMs,
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

  // Total absolute minute duration specified by your provider (typically 1440 mins)
  const totalDurationMin = useMemo(() => {
    return (endTimestampMs - startTimestampMs) / 1000 / 60;
  }, [startTimestampMs, endTimestampMs]);

  const segments = useMemo(
    () => normalizeIntervals(intervals, startTimestampMs, totalDurationMin),
    [intervals, startTimestampMs, totalDurationMin],
  );

  const labelHours = useMemo(
    () =>
      getEvenlySpacedHours(
        Math.max(1, Math.min(maxLabels, 4)),
        startTimestampMs,
      ),
    [maxLabels, startTimestampMs],
  );

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };
  const { isDebugMode } = useDebug(); // <-- Consume the debug state here

  return (
    <>
      {isDebugMode && (
        <>
          <ScrollView horizontal={true} style={{}}>
            <Text style={{ fontSize: 10, color: "#000000" }}>
              {JSON.stringify(mapIntervalsToReadableTime(intervals))}
            </Text>
          </ScrollView>
          <ScrollView horizontal={true} style={{}}>
            <Text style={{ fontSize: 10, color: "#000000" }}>
              {JSON.stringify(segments)}
            </Text>
          </ScrollView>
        </>
      )}
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
              const left = (segment.startMin / totalDurationMin) * trackWidth;
              const width =
                ((segment.endMin - segment.startMin) / totalDurationMin) *
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
              const startHour = new Date(startTimestampMs).getHours();
              const relativeHourOffset = hour - startHour;
              const x = (relativeHourOffset / 24) * trackWidth;

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
              const startHour = new Date(startTimestampMs).getHours();
              const relativeHourOffset = hour - startHour;
              const leftPct = (relativeHourOffset / 24) * 100;

              return (
                <View
                  key={`label-${hour}-${i}`}
                  style={[
                    styles.labelWrap,
                    {
                      left: `${clamp(leftPct, 0, 100)}%`,
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
    </>
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
