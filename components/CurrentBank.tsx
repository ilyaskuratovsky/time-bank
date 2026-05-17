import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { useDatabaseContext } from "../database/DatabaseContext";
import { DayIntervalsTimeline } from "./DayIntervalsTimeline";
import { getSecondsInRange, getTodayRange, toTimeString } from "../utils/Utils";
import { useToday } from "../context/TodayContext";

interface CurrentBankProps {
  project: string;
}

const formatPrettyTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  return {
    main: `${hours}h ${minutes}m`,
    seconds: `${seconds}s`,
  };
};

const CurrentBank: React.FC<CurrentBankProps> = ({ project }) => {
  const {
    timeBankDatabase: {
      intervalsByProject,
      manualRecordsByProject,
      addManualRecord,
      set,
    },
  } = useDatabaseContext();

  const allIntervals = intervalsByProject[project] ?? [];
  const allManualRecords = manualRecordsByProject[project] ?? [];

  const today = useMemo(() => getTodayRange(), []);

  const intervalSecondsToday = useMemo(() => {
    return getSecondsInRange(allIntervals, today.start, today.end);
  }, [allIntervals, today]);

  const manualSecondsToday = useMemo(() => {
    return allManualRecords.reduce((total, record) => {
      if (record.ts >= today.start && record.ts < today.end) {
        return total + record.seconds;
      }

      return total;
    }, 0);
  }, [allManualRecords, today]);

  const currentSeconds = intervalSecondsToday + manualSecondsToday;

  const [isEditing, setIsEditing] = useState(false);
  const [editingSeconds, setEditingSeconds] = useState(currentSeconds);
  const [editingStartedAt, setEditingStartedAt] = useState<number | null>(null);

  const formattedTime = formatPrettyTime(currentSeconds);
  const formattedEditingTime = useMemo(
    () => formatPrettyTime(editingSeconds),
    [editingSeconds],
  );

  const clearBankedTime = async () => {
    await set(project, [], []);
  };

  const startEditing = () => {
    setEditingSeconds(currentSeconds);
    setEditingStartedAt(Date.now());
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingSeconds(currentSeconds);
    setEditingStartedAt(null);
  };

  const saveEditing = async () => {
    if (editingStartedAt == null) return;

    const clamped = Math.max(0, editingSeconds);
    const deltaSeconds = clamped - currentSeconds;

    if (deltaSeconds !== 0) {
      console.log("adding manual record: ", {
        project,
        deltaSeconds,
        editingStartedAt,
      });
      await addManualRecord(project, editingStartedAt, deltaSeconds);
    }

    setIsEditing(false);
    setEditingStartedAt(null);
  };

  const adjustSeconds = (delta: number) => {
    setEditingSeconds((prev) => Math.max(0, prev + delta));
  };

  const display = isEditing ? formattedEditingTime : formattedTime;

  const timelineIntervals = useMemo(() => {
    const timelineIntervals = allIntervals.map((interval, i) => ({
      start: interval.start,
      end: interval.end,
      color: "#3B82F6", // or vary per interval if you want
    }));
    return timelineIntervals;
  }, [allIntervals]);
  const { startTs: todayStartTs, endTs: todayEndTs } = useToday();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Today</Text>
      </View>
      <ScrollView>
        <View style={styles.timeRow}>
          <Text style={styles.bankedTimeText}>{display.main}</Text>
          <Text style={styles.secondsText}>{display.seconds}</Text>
        </View>
        <View style={styles.dayIntervalsTimelineContainer}>
          <DayIntervalsTimeline startTimestampMs={todayStartTs} endTimestampMs={todayEndTs} intervals={timelineIntervals} height={18} />
        </View>

        {isEditing ? (
          <View style={styles.editContainer}>
            <View style={styles.adjustRow}>
              <Button title="+1m" onPress={() => adjustSeconds(60)} />
              <Button title="-1m" onPress={() => adjustSeconds(-60)} />
              <Button title="+1s" onPress={() => adjustSeconds(1)} />
              <Button title="-1s" onPress={() => adjustSeconds(-1)} />
            </View>

            <View style={styles.editActions}>
              <Button title="Cancel" onPress={cancelEditing} color="#6c757d" />
              <Button title="Save" onPress={saveEditing} color="#007bff" />
            </View>
          </View>
        ) : (
          <View style={styles.buttonRow}>
            <View style={styles.buttonWrapper}>
              <Button title="Clear" onPress={clearBankedTime} color="#d9534f" />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Edit" onPress={startEditing} color="#007bff" />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#a0d9b4",
    borderRadius: 10,
    backgroundColor: "#e6ffe6",

    alignItems: "center",
    justifyContent: "flex-start", // 👈 key change
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    //backgroundColor:"cyan",
  },
  bankedTimeText: {
    fontSize: 44,
    fontWeight: "bold",
    color: "#007bff",
  },
  secondsText: {
    fontSize: 20,
    color: "#6c757d",
    marginLeft: 6,
    marginBottom: 10,
  },
  buttonWrapper: {
    marginTop: 16,
    width: "45%",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  editContainer: {
    width: "100%",
    alignItems: "center",
  },
  adjustRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  header: {
    width: "100%",
    marginBottom: 8,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#495057",
  },

  headerSubtitle: {
    fontSize: 16,
    color: "#868e96",
    marginTop: 2,
  },
  dayIntervalsTimelineContainer: {
    alignItems: "center",
    paddingLeft: 18,
    paddingRight: 18,
  },
});

export default CurrentBank;
