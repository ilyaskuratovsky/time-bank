import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Timer from "./Timer";
import { useDatabaseContext } from "../database/DatabaseContext";
import ProjectSwitcherHeader from "./ProjectSwitcherHeader";

type ProjectTimerProps = {
  onProjectChange: (projectId: string) => void; // Callback to update the active project
};

const ProjectTimer: React.FC<ProjectTimerProps> = ({ onProjectChange }) => {
  const insets = useSafeAreaInsets();
  const { timeBankDatabase } = useDatabaseContext();

  const projects = [
    { id: "Work", name: "Work" },
    { id: "Side Project", name: "Side Project" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleProjectPress = (index: number) => {
    setActiveIndex(index);
    onProjectChange(projects[index].id);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.headerContainer}>
        <ProjectSwitcherHeader
          projects={projects}
          activeIndex={activeIndex}

          onChange={(index) => {
            setActiveIndex(index);
            handleProjectPress(index); // Call handleProjectPress with the new index
          }}
          onManageProjects={() => {}}
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

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
  },

  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#D1D5DB",
    marginBottom: 16,
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  projectRow: {
    minHeight: 52,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  activeProjectRow: {
    backgroundColor: "#F3F4F6",
  },

  projectName: {
    fontSize: 17,
    fontWeight: "500",
    color: "#111827",
  },

  activeProjectName: {
    fontWeight: "700",
  },

  checkmark: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563EB",
  },
});

export default ProjectTimer;