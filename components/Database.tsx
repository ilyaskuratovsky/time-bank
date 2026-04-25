import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Button } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDatabaseContext } from "../database/DatabaseContext";
import { formatTime } from "../utils/Utils";
import logger from "../utils/Logger";
import {
  useTimeBankDatabase,
  Interval,
  ManualRecord,
  ProjectIntervals,
  ProjectManualRecords,
} from "../database/useTimeBankDatabase";

const Database: React.FC = () => {
  const insets = useSafeAreaInsets();
  const timeBankDatabase = useTimeBankDatabase();

  const {
    intervalsByProject,
    manualRecordsByProject,
  } = timeBankDatabase;

  const projectIds = Array.from(
    new Set([
      ...Object.keys(intervalsByProject ?? {}),
      ...Object.keys(manualRecordsByProject ?? {}),
    ]),
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <Text style={styles.title}>TimeBankDatabase</Text>

      {projectIds.length === 0 ? (
        <Text style={styles.empty}>No time bank data found.</Text>
      ) : (
        projectIds.map((projectId) => {
          const intervals = intervalsByProject[projectId] ?? [];
          const manualRecords = manualRecordsByProject[projectId] ?? [];

          return (
            <View key={projectId} style={styles.card}>
              <Text style={styles.projectTitle}>{projectId}</Text>

              <Text style={styles.sectionTitle}>
                Intervals ({intervals.length})
              </Text>

              {intervals.length === 0 ? (
                <Text style={styles.empty}>No intervals</Text>
              ) : (
                intervals.map((interval, index) => (
                  <Text key={`${projectId}-interval-${index}`} style={styles.row}>
                    #{index + 1}{" "}
                    {new Date(interval.start).toLocaleString()} →{" "}
                    {new Date(interval.end).toLocaleString()} (
                    {Math.round((interval.end - interval.start) / 1000)}s)
                  </Text>
                ))
              )}

              <Text style={styles.sectionTitle}>
                Manual Records ({manualRecords.length})
              </Text>

              {manualRecords.length === 0 ? (
                <Text style={styles.empty}>No manual records</Text>
              ) : (
                manualRecords.map((record, index) => (
                  <Text key={`${projectId}-manual-${index}`} style={styles.row}>
                    #{index + 1} {new Date(record.ts).toLocaleString()} —{" "}
                    {record.seconds}s
                  </Text>
                ))
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#f8f9fa",
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
  },
  row: {
    fontSize: 13,
    marginBottom: 4,
  },
  empty: {
    fontSize: 13,
    color: "#777",
    fontStyle: "italic",
  },
});

export default Database;