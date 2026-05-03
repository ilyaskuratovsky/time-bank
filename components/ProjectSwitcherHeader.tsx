import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from "react-native";

export type ProjectItem = {
  id: string;
  name: string;
  color?: string;
};

type ProjectSwitcherHeaderProps = {
  projects: ProjectItem[];
  activeIndex: number;
  onChange: (index: number) => void;
  onManageProjects: () => void;
};

export default function ProjectSwitcherHeader({
  projects,
  activeIndex,
  onChange,
  onManageProjects,
}: ProjectSwitcherHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!projects.length) return null;
  const currentProject = projects[activeIndex];

  const handleSelect = (index: number) => {
    onChange(index);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Spacer for centering */}
      <View style={styles.sideElement} />

      {/* Header Trigger */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsOpen(true)}
        style={styles.titleButton}
      >
        <View style={styles.titleRow}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              currentProject.color ? { color: currentProject.color } : null,
            ]}
          >
            {currentProject.name}
          </Text>
          <Text style={[styles.chevron, isOpen && styles.chevronUpsideDown]}>
            ⌄
          </Text>
        </View>
      </TouchableOpacity>

      {/* Right spacer to maintain center alignment */}
      <View style={styles.sideElement} />

      {/* Inline Dropdown Menu */}
      <Modal visible={isOpen} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdownMenu}>
              {projects.map((project, index) => (
                <TouchableOpacity
                  key={project.id}
                  style={[
                    styles.menuItem,
                    index === activeIndex && styles.activeMenuItem,
                  ]}
                  onPress={() => handleSelect(index)}
                >
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: project.color || "#CCC" },
                    ]}
                  />
                  <Text style={styles.menuText}>{project.name}</Text>
                  {index === activeIndex && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>
              ))}

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setIsOpen(false);
                  onManageProjects();
                }}
              >
                <Text style={[styles.menuText, styles.manageText]}>
                  Manage Projects...
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    backgroundColor: "#FFF",
  },
  sideElement: {
    width: 48,
    height: 48,
  },
  titleButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  chevron: {
    marginLeft: 4,
    fontSize: 16,
    opacity: 0.5,
  },
  chevronUpsideDown: {
    transform: [{ rotate: "180deg" }],
    marginTop: -4,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  dropdownContainer: {
    position: "absolute",
    top: 55,
    left: "10%",
    right: "10%",
    alignItems: "center",
  },
  dropdownMenu: {
    width: 240,
    backgroundColor: "#FFF",
    borderRadius: 14,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activeMenuItem: {
    backgroundColor: "#F9FAFB",
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  manageText: {
    color: "#6366F1",
    fontSize: 14,
  },
  check: {
    fontSize: 16,
    color: "#6366F1",
    fontWeight: "700",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
  },
});