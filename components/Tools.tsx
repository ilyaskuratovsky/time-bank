import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDatabaseContext } from "../database/DatabaseContext";
import { formatTime } from "../utils/Utils";

const Tools: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    timeBankDatabase: { bankedTimes },
  } = useDatabaseContext();
  const totalSeconds = bankedTimes["_"] ?? 0;

  const keys = Object.keys(bankedTimes);

  return (
    <ScrollView
      style={[styles.container, { paddingBottom: insets.bottom }]}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Text style={styles.heading}>Tools</Text>
      <View style={styles.statRow}>
        <Text style={styles.label}>Current banked time:</Text>
        <Text style={styles.value}>{formatTime(totalSeconds)}</Text>
      </View>
      <View style={styles.statRow}>
        <Text style={styles.label}>Raw seconds:</Text>
        <Text style={styles.value}>{totalSeconds}</Text>
      </View>
      <Text style={styles.subheading}>All entries</Text>
      {keys.length === 0 ? (
        <Text style={styles.noData}>No entries yet.</Text>
      ) : (
        keys.map((key) => (
          <View style={styles.entry} key={key}>
            <Text style={styles.entryKey}>{key}</Text>
            <Text style={styles.entryValue}>
              {formatTime(bankedTimes[key])}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f9fc",
  },
  heading: {
    fontSize: 28,
    marginBottom: 12,
    fontWeight: "700",
  },
  subheading: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 4,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#111",
    fontWeight: "600",
  },
  noData: {
    fontSize: 16,
    color: "#777",
  },
  entry: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 2,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  entryKey: {
    fontSize: 15,
    color: "#444",
    textTransform: "capitalize",
  },
  entryValue: {
    fontSize: 15,
    color: "#444",
    fontWeight: "600",
  },
});

export default Tools;
