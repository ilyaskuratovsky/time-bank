import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CurrentBank from "./CurrentBank";
import CurrentBankMini from "./CurrentBankMini";
import ProjectTimer from "./ProjectTimer";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const MIN_HEIGHT = 200;
const MAX_HEIGHT = SCREEN_HEIGHT * 0.5;

const Sprint: React.FC = () => {
  const insets = useSafeAreaInsets();

  const projects = [
    { id: "Work", name: "Work" },
    { id: "Side Project", name: "Side Project" },
  ];

  const [activeProject, setActiveProject] = useState(projects[0].id); // Renamed and initialized with project ID
  console.log('Sprint rendered with projects:', projects, 'activeProject:', activeProject);
  const [expanded, setExpanded] = useState(false);

  const animatedHeight = useRef(new Animated.Value(MIN_HEIGHT)).current;

  const togglePanel = () => {
    Animated.timing(animatedHeight, {
      toValue: expanded ? MIN_HEIGHT : MAX_HEIGHT,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setExpanded(!expanded);
  };

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        alignItems: "center",
      }}
    >
      {/* Timer */}
      <ProjectTimer onProjectChange={(projectId) => setActiveProject(projectId)} />
      {/* Bottom Sheet */}
      <Animated.View style={[styles.bottomPanel, { height: animatedHeight }]}>
        {/* Handle / Toggle Area */}
        <TouchableOpacity style={styles.handle} onPress={togglePanel}>
          <View style={styles.handleBar} />
        </TouchableOpacity>

        {/* Content */}
        {expanded ? (
          <CurrentBank project={activeProject} />
        ) : (
          <CurrentBankMini project={activeProject} />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    width: "100%",
    height: 360,
  },

  bottomPanel: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },

  handle: {
    alignItems: "center",
    paddingVertical: 10,
  },

  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ccc",
  },
});

export default Sprint;

