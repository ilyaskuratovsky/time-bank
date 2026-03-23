import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";

interface TabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.tab, activeTab === "sprint" && styles.activeTab]}
        onPress={() => onTabChange("sprint")}
      >
        <Text
          style={[styles.tabText, activeTab === "sprint" && styles.activeText]}
        >
          Sprint
        </Text>
      </Pressable>
      <Pressable
        style={[styles.tab, activeTab === "stats" && styles.activeTab]}
        onPress={() => onTabChange("stats")}
      >
        <Text
          style={[styles.tabText, activeTab === "stats" && styles.activeText]}
        >
          Stats
        </Text>
      </Pressable>
      <Pressable
        style={[styles.tab, activeTab === "tools" && styles.activeTab]}
        onPress={() => onTabChange("tools")}
      >
        <Text
          style={[styles.tabText, activeTab === "tools" && styles.activeText]}
        >
          Tools
        </Text>
      </Pressable>
      <Pressable
        style={[styles.tab, activeTab === "log" && styles.activeTab]}
        onPress={() => onTabChange("log")}
      >
        <Text
          style={[styles.tabText, activeTab === "log" && styles.activeText]}
        >
          Log
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#007bff",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  activeText: {
    color: "#007bff",
  },
});

export default TabBar;
