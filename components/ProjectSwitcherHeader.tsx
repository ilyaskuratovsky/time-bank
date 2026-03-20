import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type ProjectItem = {
  id: string;
  name: string;
};

type ProjectSwitcherHeaderProps = {
  projects: ProjectItem[];
  activeIndex: number;
  onChange: (index: number) => void;
};

export default function ProjectSwitcherHeader({
  projects,
  activeIndex,
  onChange,
}: ProjectSwitcherHeaderProps) {
  if (!projects?.length) {
    return null;
  }

  const safeIndex = Math.min(Math.max(activeIndex, 0), projects.length - 1);
  const currentProject = projects[safeIndex];

  const goPrev = () => {
    const nextIndex = safeIndex === 0 ? projects.length - 1 : safeIndex - 1;
    onChange(nextIndex);
  };

  const goNext = () => {
    const nextIndex = safeIndex === projects.length - 1 ? 0 : safeIndex + 1;
    onChange(nextIndex);
  };

  return (
    <View style={[styles.container]}>
      <View style={[styles.headerShell]}>
        <View style={styles.switcherShell}>
          <View style={styles.switcherRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.arrowButton}
              onPress={goPrev}
            >
              <Text style={styles.arrowText}>‹</Text>
            </TouchableOpacity>

            <View style={[styles.projectCard]}>
              <View style={styles.projectCardTop}>
                <View style={styles.projectTextWrap}>
                  <Text style={styles.projectName}>{currentProject.name}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.arrowButton}
              onPress={goNext}
            >
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.paginationRow}>
            {projects.map((project, index) => (
              <TouchableOpacity
                key={project.id}
                activeOpacity={0.8}
                onPress={() => onChange(index)}
                style={
                  index === safeIndex
                    ? styles.paginationActive
                    : styles.paginationDot
                }
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  headerShell: {
    backgroundColor: "#111827",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    //marginBottom: 16,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    color: "#94a3b8",
    fontWeight: "600",
  },
  headerTitle: {
    marginTop: 6,
    fontSize: 28,
    lineHeight: 32,
    color: "#ffffff",
    fontWeight: "700",
  },
  addButton: {
    height: 42,
    width: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "rgba(255,255,255,0.12)",
    backgroundColor: "gray",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  addButtonText: {
    fontSize: 24,
    lineHeight: 24,
    color: "#ffffff",
    marginTop: -2,
  },
  switcherShell: {
    // backgroundColor: "rgba(255,255,255,0.08)",
    // borderRadius: 24,
    // padding: 10,
    // borderWidth: 1,
    // borderColor: "rgba(255,255,255,0.08)",
  },
  switcherRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrowButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgray",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  arrowText: {
    color: "#ffffff",
    fontSize: 26,
    lineHeight: 28,
    fontWeight: "500",
  },
  projectCard: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "gray",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  projectCardTop: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  projectTextWrap: {
    // flex: 1,
    // backgroundColor: "blue",
    paddingRight: 10,
  },
  cardEyebrow: {
    fontSize: 10,
    letterSpacing: 1.6,
    color: "#64748b",
    fontWeight: "700",
  },
  projectName: {
    marginTop: 6,
    fontSize: 24,
    lineHeight: 22,
    color: "#111827",
    //fontWeight: "700",
  },
  projectMeta: {
    marginTop: 4,
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  statusBadge: {
    backgroundColor: "#ecfdf5",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#047857",
    fontWeight: "700",
  },
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  paginationActive: {
    width: 24,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#ffffff",
    marginHorizontal: 4,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.35)",
    marginHorizontal: 4,
  },
});
