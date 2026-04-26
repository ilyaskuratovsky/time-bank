import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Timer from "./Timer";
import CurrentBank from "./CurrentBank";
import { useDatabaseContext } from "../database/DatabaseContext";
import ProjectSwitcherHeader from "./ProjectSwitcherHeader";
import ProjectSwitcherDemo from "./ProjectSwitcherDemo";
import ProjectTimer from "./ProjectTimer";

const Sprint: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { timeBankDatabase } = useDatabaseContext();

  const projects = [
    {
      id: "Work",
      name: "Work",
    },
    {
      id: "Side Project",
      name: "Side Project",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {});

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <View style={styles.timerContainer}>
        <ProjectTimer />
      </View>

      <View style={styles.currentBankContainer}>
        <CurrentBank project={projects[activeIndex].id} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    width: "100%",
  },

  currentBankContainer: {
    width: "90%",
    marginTop: 20,
    flex: 1, // fills remaining space
  },
});

export default Sprint;
