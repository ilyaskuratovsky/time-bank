import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Button } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDatabaseContext } from "../database/DatabaseContext";
import { formatTime } from "../utils/Utils";
import logger from "../utils/Logger";

const Tools: React.FC = () => {
  const [clearVisible, setClearVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const clearLog = () => {
    logger.clear();
  };

  return (
    <ScrollView
      style={[styles.container, { paddingBottom: insets.bottom }]}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {logger.log.length > 0 && <Button title="Clear Log" onPress={clearLog} />}
      {logger.log.length === 0 ? (
        <Text style={styles.noData}>No log entries yet.</Text>
      ) : (
        logger.log.reverse().map((entry, index) => (
          <View style={styles.entry} key={index}>
            <Text style={styles.entryKey}>{entry}</Text>
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
});

export default Tools;
