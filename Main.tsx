import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Sprint from "./components/Sprint";
import Stats from "./components/Stats";
import TabBar from "./components/TabBar";
import Tools from "./components/Tools";

const Main = () => {
  const [activeTab, setActiveTab] = useState("sprint");
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <View style={{ flex: 1 }}>
        {activeTab === "sprint" && <Sprint />}
        {activeTab === "stats" && <Stats />}
        {activeTab === "tools" && <Tools />}
      </View>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
};

export default Main;
