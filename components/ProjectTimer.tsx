import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Timer from "./Timer";
import CurrentBank from "./CurrentBank";
import { useDatabaseContext } from "../database/DatabaseContext";
import ProjectSwitcherHeader from "./ProjectSwitcherHeader";
import ProjectSwitcherDemo from "./ProjectSwitcherDemo";

const ProjectTimer: React.FC = () => {
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
        justifyContent: "center",
      }}
    >
      <ProjectSwitcherHeader
        projects={projects}
        activeIndex={activeIndex}
        onChange={(index) => {
          setActiveIndex(index);
        }}
      />
      {/*
      <ProjectSwitcherDemo />
      */}
      <View style={styles.timerContainer}>
        <Timer
          project={projects[activeIndex].id}
          bankTimeInterval={async (intervals: { start: number; end: number }[]) => {
            console.log("Banking intervals: ", intervals);
            await timeBankDatabase.addIntervals(projects[activeIndex].id, intervals);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: { width: "90%" },
  currentBankContainer: { width: "90%", flex: 1 },
});

export default ProjectTimer;

