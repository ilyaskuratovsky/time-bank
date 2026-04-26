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
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.headerContainer}>
        <ProjectSwitcherHeader
          projects={projects}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
        />
      </View>
      <View style={styles.timerContainer}>
        <Timer
          project={projects[activeIndex].id}
          bankTimeInterval={async (intervals) => {
            await timeBankDatabase.addIntervals(
              projects[activeIndex].id,
              intervals,
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    //backgroundColor: "pink",
  },

  headerContainer: {
    width: "100%",
    paddingTop: 18,
    paddingBottom: 4,
    paddingHorizontal: 16,
  },

  timerContainer: {
    width: "90%",
    marginTop: 0,
  },
});
export default ProjectTimer;
