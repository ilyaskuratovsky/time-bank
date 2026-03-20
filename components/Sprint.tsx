import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Timer from "./Timer";
import CurrentBank from "./CurrentBank";
import { useDatabaseContext } from "../database/DatabaseContext";

const Sprint: React.FC = () => {
  const insets = useSafeAreaInsets();
  const db = useDatabaseContext();

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={styles.timerContainer}>
        <Timer
          bankTime={async (seconds: number) => {
            await db.add("_", seconds);
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

export default Sprint;
