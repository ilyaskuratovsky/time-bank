import React, { useRef, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";

type Project = {
  id: string;
  name: string;
  color: string;
  backgroundColor: string;
};

const PROJECTS: Project[] = [
  { id: "work", name: "Work", color: "#2563EB", backgroundColor: "#DBEAFE" },
  { id: "side", name: "Side", color: "#16A34A", backgroundColor: "#DCFCE7" },
  { id: "gym", name: "Gym", color: "#DC2626", backgroundColor: "#FEE2E2" },
  { id: "study", name: "Study", color: "#9333EA", backgroundColor: "#F3E8FF" },
  { id: "admin", name: "Admin", color: "#F59E0B", backgroundColor: "#FEF3C7" },
  { id: "home", name: "Home", color: "#0891B2", backgroundColor: "#CFFAFE" },
  { id: "deep", name: "Deep Work", color: "#4F46E5", backgroundColor: "#E0E7FF" },
];

export default function ProjectSwitcherDemo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView | null>(null);
  const tabLayouts = useRef<Record<number, { x: number; width: number }>>({});
  const [containerWidth, setContainerWidth] = useState(0);

  const activeProject = PROJECTS[activeIndex];

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const handleTabLayout = (index: number, event: LayoutChangeEvent) => {
    tabLayouts.current[index] = {
      x: event.nativeEvent.layout.x,
      width: event.nativeEvent.layout.width,
    };
  };

  const selectProject = (index: number) => {
    setActiveIndex(index);

    const layout = tabLayouts.current[index];
    if (!layout || containerWidth === 0) return;

    const centeredX = layout.x - containerWidth / 2 + layout.width / 2;

    scrollRef.current?.scrollTo({
      x: Math.max(centeredX, 0),
      animated: true,
    });
  };

  const handleAddProject = () => {
    console.log("Add project pressed");
  };

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: activeProject.backgroundColor },
      ]}
    >
      <View style={styles.header} onLayout={handleContainerLayout}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {PROJECTS.map((project, index) => {
            const isActive = index === activeIndex;

            return (
              <Pressable
                key={project.id}
                onLayout={(event) => handleTabLayout(index, event)}
                onPress={() => selectProject(index)}
                style={[
                  styles.tab,
                  isActive && {
                    backgroundColor: project.color,
                    borderColor: project.color,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    isActive && styles.activeTabText,
                  ]}
                >
                  {project.name}
                </Text>
              </Pressable>
            );
          })}

          <Pressable onPress={handleAddProject} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </Pressable>
        </ScrollView>
      </View>

      <View style={styles.content}>
        <Text style={[styles.projectTitle, { color: activeProject.color }]}>
          {activeProject.name}
        </Text>

        <Text style={styles.subtitle}>
          Query key: {activeProject.id}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 14,
  },
  header: {
    width: "100%",
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#9CA3AF",
    backgroundColor: "#FFFFFF",
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  projectTitle: {
    fontSize: 42,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#4B5563",
  },
});