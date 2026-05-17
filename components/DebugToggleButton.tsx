import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useDebug } from "../context/DebugContext"; // Adjust path as needed

export const DebugToggleButton: React.FC = () => {
  const { isDebugMode, toggleDebugMode } = useDebug();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: isDebugMode ? "#EF4444" : "#4B5563" },
      ]}
      onPress={toggleDebugMode}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{isDebugMode ? "Debug: ON" : "Debug: OFF"}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 24,
    right: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    zIndex: 9999, // Keep it above views
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
});