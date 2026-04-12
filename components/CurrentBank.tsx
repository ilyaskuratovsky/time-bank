import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useDatabaseContext } from "../database/DatabaseContext";

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
    timeBankDatabase: { bankedTimes, set },
  } = useDatabaseContext();

  console.log("CurrentBank render, project: " + project);

  const currentSeconds = bankedTimes[project] ?? 0;

  const [isEditing, setIsEditing] = useState(false);
  const [editingSeconds, setEditingSeconds] = useState(currentSeconds);

  const formattedTime = formatPrettyTime(currentSeconds);
  const formattedEditingTime = useMemo(
    () => formatPrettyTime(editingSeconds),
    [editingSeconds],
  );

  const clearBankedTime = async () => {
    await set(project, 0);
  };

  const startEditing = () => {
    setEditingSeconds(currentSeconds);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingSeconds(currentSeconds);
  };

  const saveEditing = async () => {
    const clamped = Math.max(0, editingSeconds);
    await set(project, clamped);
    setIsEditing(false);
  };

  const adjustSeconds = (delta: number) => {
    setEditingSeconds((prev) => Math.max(0, prev + delta));
  };

  const display = isEditing ? formattedEditingTime : formattedTime;

  return (
    <View style={styles.container}>
      <View style={styles.timeRow}>
        <Text style={styles.bankedTimeText}>{display.main}</Text>
        <Text style={styles.secondsText}>{display.seconds}</Text>
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
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  bankedTimeText: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#28a745",
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
});

export default CurrentBank;
