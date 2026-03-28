import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Timer from "./Timer";
import CurrentBank from "./CurrentBank";
import { useDatabaseContext } from "../database/DatabaseContext";
import ProjectSwitcherHeader from "./ProjectSwitcherHeader";

const Sprint: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { timeBankDatabase: db } = useDatabaseContext();

  const projects = [
    {
      id: "1",
      name: "Work",
    },
    {
      id: "2",
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
      <View style={styles.timerContainer}>
        <Timer
          bankTime={async (seconds: number) => {
            console.log(
              `Banking time: ${seconds} seconds to project ${projects[activeIndex].name}`,
            );
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
