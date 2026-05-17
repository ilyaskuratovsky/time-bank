import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { useDatabaseContext } from "../database/DatabaseContext";
import { DayIntervalsTimeline } from "./DayIntervalsTimeline";
import { getSecondsInRange, getTodayRange, toTimeString } from "../utils/Utils";
import { useToday } from "../context/TodayContext";
import { Interval } from "../database/useTimeBankDatabase";

// Unified log types
type LogItem =
  | {
      type: "auto";
      id: string;
      timestamp: number;
      duration: number;
      details: string;
    }
  | {
      type: "manual";
      id: string;
      timestamp: number;
      duration: number;
      details: string;
    };

const formatPrettyTime = (totalSeconds: number) => {
  const isNegative = totalSeconds < 0;
  const absSeconds = Math.abs(totalSeconds);
  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const seconds = Math.round(absSeconds % 60);

  return {
    main: `${isNegative ? "-" : ""}${hours}h ${minutes}m`,
    seconds: `${seconds}s`,
  };
};

/**
 * 1. Separate ActivityLog Component
 */
interface ActivityLogProps {
  intervals: Interval[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ intervals }) => {
  // Process automatic timeline intervals occurring today
  const logs: LogItem[] = [];
  intervals.forEach((interval, idx) => {
    const durationSec = (interval.end - interval.start) / 1000;
    logs.push({
      type: "auto",
      id: `auto-${idx}-${interval.start}`,
      timestamp: interval.start,
      duration: durationSec,
      details: `Session: ${toTimeString(interval.start)} - ${toTimeString(interval.end)}`,
    });
  });

  if (logs.length === 0) {
    return (
      <View style={logStyles.emptyState}>
        <Text style={logStyles.emptyText}>No activity logged for today.</Text>
      </View>
    );
  }

  return (
    <View style={logStyles.container}>
      <Text style={logStyles.title}>Activity Log</Text>
      {logs.map((item) => {
        const isManual = item.type === "manual";
        const isNegative = item.duration < 0;
        const timeFormatted = formatPrettyTime(item.duration);

        return (
          <View key={item.id} style={logStyles.card}>
            <View style={logStyles.cardRow}>
              <View style={logStyles.badgeContainer}>
                <Text
                  style={[
                    logStyles.badge,
                    isManual ? logStyles.badgeManual : logStyles.badgeAuto,
                  ]}
                >
                  {isManual ? "Manual" : "Auto"}
                </Text>
                <Text style={logStyles.timeLabel}>
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
              <Text
                style={[
                  logStyles.durationText,
                  isNegative ? logStyles.textNegative : logStyles.textPositive,
                ]}
              >
                {isNegative ? "" : "+"}
                {timeFormatted.main} {timeFormatted.seconds}
              </Text>
            </View>
            <Text style={logStyles.detailsText}>{item.details}</Text>
          </View>
        );
      })}
    </View>
  );
};

const logStyles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
    paddingTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 12,
  },
  emptyState: {
    marginTop: 24,
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    color: "#64748b",
    fontSize: 14,
    fontStyle: "italic",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  badgeAuto: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  badgeManual: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  timeLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  durationText: {
    fontSize: 14,
    fontWeight: "600",
  },
  textPositive: {
    color: "#16a34a",
  },
  textNegative: {
    color: "#dc2626",
  },
  detailsText: {
    fontSize: 12,
    color: "#475569",
  },
});

export default ActivityLog;
