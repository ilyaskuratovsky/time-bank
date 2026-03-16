import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatTime } from "../utils/Utils"; // Import the time formatting utility
import { useDatabaseContext } from "../database/DatabaseContext";
import { BankedTimes } from "../database/Types";

interface CurrentBankProps {}

const CurrentBank: React.FC<CurrentBankProps> = ({}) => {
  const [bankedTime, setBankedTime] = useState(0);
  const handleUpdate = useCallback((data: BankedTimes) => {
    setBankedTime(data["_"] ?? 0);
  }, []); // Empty array means this function reference is stable forever
  //
  const { bankedTimes } = useDatabaseContext();
  const formattedTime = formatTime(bankedTimes["_"] ?? 0);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Banked Time</Text>
      <Text style={styles.bankedTimeText}>{formattedTime}</Text>
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
});

export default CurrentBank;
