import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { toTimeString } from "../utils/Utils";
import { Interval } from "../database/useTimeBankDatabase";

// Unified log types
type LogItem =
  | {
      type: "auto";
      id: string;
      timestamp: number;
      duration: number;
      timeRangeText: string; // Combined start & end string
      rawInterval: Interval;
      index: number;
    }
  | {
      type: "manual";
      id: string;
      timestamp: number;
      duration: number;
      timeRangeText: string;
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

interface ActivityLogProps {
  intervals: Interval[];
  onEditInterval?: (index: number) => void;
  onDeleteInterval?: (interval: Interval, index: number) => void;
}

const ActivityLog: React.FC<ActivityLogProps> = ({
  intervals,
  onEditInterval,
  onDeleteInterval,
}) => {
  // Process automatic timeline intervals occurring today
  const logs: LogItem[] = [];
  intervals.forEach((interval, idx) => {
    const durationSec = (interval.end - interval.start) / 1000;
    logs.push({
      type: "auto",
      id: `auto-${idx}-${interval.start}`,
      timestamp: interval.start,
      duration: durationSec,
      timeRangeText: `${toTimeString(interval.start)} - ${toTimeString(interval.end)}`,
      rawInterval: interval,
      index: idx,
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
      {logs.map((item, index) => {
        const isManual = item.type === "manual";
        const isNegative = item.duration < 0;
        const timeFormatted = formatPrettyTime(item.duration);

        return (
          <View key={item.id} style={logStyles.card}>
            {/* Unified Single Info Row */}
            <View style={logStyles.infoContainer}>
              <View style={logStyles.metaGroup}>
                {/*
                <Text
                  style={[
                    logStyles.badge,
                    isManual ? logStyles.badgeManual : logStyles.badgeAuto,
                  ]}
                >
                  {isManual ? "Manual" : "Auto"}
                </Text>
              */}
                <Text style={logStyles.timeRangeLabel}>
                  {item.timeRangeText}
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

            {/* Action Buttons */}
            {item.type === "auto" && (
              <View style={logStyles.actionColumn}>
                <TouchableOpacity
                  style={[logStyles.actionButton, logStyles.editButton]}
                  onPress={() => onEditInterval?.(index)}
                  activeOpacity={0.7}
                >
                  <Text style={logStyles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[logStyles.actionButton, logStyles.deleteButton]}
                  onPress={() =>
                    onDeleteInterval?.(item.rawInterval, item.index)
                  }
                  activeOpacity={0.7}
                >
                  <Text style={logStyles.actionButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const logStyles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 0,
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
    //backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    //borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 14,
  },
  metaGroup: {
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
  timeRangeLabel: {
    fontSize: 18,
    fontWeight: "500",
    color: "#475569",
  },
  durationText: {
    fontSize: 18,
    fontWeight: "600",
  },
  textPositive: {
    color: "#16a34a",
  },
  textNegative: {
    color: "#dc2626",
  },
  actionColumn: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  deleteButton: {
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#fca5a5",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
  },
});

export default ActivityLog;
