import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import {
  useSafeAreaInsets,
  SafeAreaProvider,
} from "react-native-safe-area-context";

import Timer from "./components/Timer"; // Import the Timer component
import CurrentBank from "./components/CurrentBank"; // Import the CurrentBank component
import { useDatabaseContext } from "./database/DatabaseContext";

const Main = () => {
  const insets = useSafeAreaInsets();
  const db = useDatabaseContext();
  return (
    <View
      style={{
        flex: 1,
        // Manually padding the top and bottom based on the device
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={styles.timerContainer}>
        <Timer
          bankTime={async (seconds: number) => {
            db.add("_", seconds);
          }}
        />
      </View>
      <View style={styles.currentBankContainer}>
        <CurrentBank />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: { width: "90%" },
  currentBankContainer: { width: "90%", flex: 1 },
});

export default Main;
