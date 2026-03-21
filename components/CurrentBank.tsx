import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { formatTime } from "../utils/Utils"; // Import the time formatting utility
import { useDatabaseContext } from "../database/DatabaseContext";

interface CurrentBankProps {}

const CurrentBank: React.FC<CurrentBankProps> = ({}) => {
  const {
    timeBankDatabase: { bankedTimes, set },
  } = useDatabaseContext();
  //const { bankedTimes, set } = useDatabaseContext();
  const currentSeconds = bankedTimes["_"] ?? 0;

  const [isEditing, setIsEditing] = useState(false);
  const [editingSeconds, setEditingSeconds] = useState(currentSeconds);

  const formattedTime = formatTime(currentSeconds);
  const formattedEditingTime = useMemo(
    () => formatTime(editingSeconds),
    [editingSeconds],
  );

  const clearBankedTime = async () => {
    await set("_", 0);
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
    await set("_", clamped);
    setIsEditing(false);
  };

  const adjustSeconds = (delta: number) => {
    setEditingSeconds((prev) => Math.max(0, prev + delta));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.bankedTimeText}>
        {isEditing ? formattedEditingTime : formattedTime}
      </Text>

      {isEditing ? (
        <View style={styles.editContainer}>
          <View style={styles.adjustRow}>
            <Button title="+" onPress={() => adjustSeconds(60)} />
            <Button title="-" onPress={() => adjustSeconds(-60)} />
            <Button title="+" onPress={() => adjustSeconds(1)} />
            <Button title="-" onPress={() => adjustSeconds(-1)} />
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
    flex: 1, // Make the container take all available vertical space
    width: "100%", // Make it take all available horizontal space from its parent
    // marginVertical: 20, // Removed to allow it to fill the parent's vertical space completely
    padding: 15,
    borderWidth: 1,
    borderColor: "#a0d9b4",
    borderRadius: 10,
    backgroundColor: "#e6ffe6",
    alignItems: "center",
    justifyContent: "center", // Center content vertically within this expanded container
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    color: "#333",
    marginBottom: 5,
  },
  bankedTimeText: {
    fontSize: 64, // Big font size
    fontWeight: "bold",
    color: "#28a745", // Green color
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
