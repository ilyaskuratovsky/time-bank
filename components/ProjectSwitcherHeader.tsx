import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type ProjectItem = {
  id: string;
  name: string;
  color?: string;
};

type ProjectSwitcherHeaderProps = {
  projects: ProjectItem[];
  activeIndex: number;
  onChange: (index: number) => void;
  onAddProject?: () => void;
};

export default function ProjectSwitcherHeader({
  projects,
  activeIndex,
  onChange,
  onAddProject,
}: ProjectSwitcherHeaderProps) {
  if (!projects.length) return null;

  const safeIndex = Math.min(Math.max(activeIndex, 0), projects.length - 1);
  const currentProject = projects[safeIndex];

  const goPrev = () => {
    onChange(safeIndex === 0 ? projects.length - 1 : safeIndex - 1);
  };

  const goNext = () => {
    onChange(safeIndex === projects.length - 1 ? 0 : safeIndex + 1);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goPrev} style={styles.arrowButton}>
        <Text style={styles.arrowText}>‹</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.75}
        onLongPress={onAddProject}
        style={styles.titleButton}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            currentProject.color ? { color: currentProject.color } : null,
          ]}
        >
          {currentProject.name}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goNext} style={styles.arrowButton}>
        <Text style={styles.arrowText}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 30,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrowButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    fontSize: 42,
    lineHeight: 42,
    fontWeight: "300",
    color: "#C7C7CC",
  },
  titleButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    color: "#111827",
  },
});