import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { useDatabaseContext } from "../database/DatabaseContext";
import { DayIntervalsTimeline } from "./DayIntervalsTimeline";
import { getSecondsInRange, getTodayRange, toTimeString } from "../utils/Utils";

interface CurrentBankMiniProps {
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

const CurrentBankMini: React.FC<CurrentBankMiniProps> = ({ project }) => {
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

  const formattedTime = formatPrettyTime(currentSeconds);

  const timelineIntervals = useMemo(() => {
    const timelineIntervals = allIntervals.map((interval, i) => ({
      start: toTimeString(interval.start),
      end: toTimeString(interval.end),
      color: "#3B82F6", // or vary per interval if you want
    }));
    return timelineIntervals;
  }, [allIntervals]);

  return (
    <View style={styles.container}>
      <View style={styles.timeRow}>
        <Text style={styles.bankedTimeText}>{formattedTime.main}</Text>
        <Text style={styles.secondsText}>{formattedTime.seconds}</Text>
      </View>
      <View style={styles.dayIntervalsTimelineContainer}>
        <DayIntervalsTimeline intervals={timelineIntervals} height={18} />
      </View>
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
    width: "100%",
    paddingLeft: 18,
    paddingRight: 18,
  },
});

export default CurrentBankMini;
