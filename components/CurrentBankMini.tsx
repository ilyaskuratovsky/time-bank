import React, { useState, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; 
import { useDatabaseContext } from "../database/DatabaseContext";
import { DayIntervalsTimeline } from "./DayIntervalsTimeline";
import { getSecondsInRange, getTodayRange, toTimeString } from "../utils/Utils";
import { EditBankTime } from "./EditBankTime";
import { useToday } from "../context/TodayContext";
import { calculateTime } from "./TimeCalculator";

interface CurrentBankMiniProps {
  project: string;
}

const CurrentBankMini: React.FC<CurrentBankMiniProps> = ({ project }) => {
  const {
    timeBankDatabase: {
      intervalsByProject,
      manualRecordsByProject,
      addManualRecord,
    },
  } = useDatabaseContext();

  // Reference for the TimeSpent component to trigger its edit mode
  const [isEditing, setIsEditing] = useState(false);
  console.log('CurrentBankMini rendered for project:', project);
  const allIntervals = intervalsByProject[project] ?? [];
  const allManualRecords = manualRecordsByProject[project] ?? [];
  const { startTs: todayStartTs, endTs: todayEndTs } = useToday();

  const currentSeconds = useMemo(() => {
    // Use the new calculateTime function
    return calculateTime(allIntervals, allManualRecords, todayStartTs, todayEndTs);
  }, [allIntervals, allManualRecords, todayStartTs, todayEndTs]);

const timelineIntervals = useMemo(() => {
  return allIntervals
    .filter((interval) => interval.start >= todayStartTs && interval.end <= todayEndTs)
    .map((interval) => ({
      start: interval.start,
      end: interval.end,
      color: "#3B82F6",
    }));
}, [allIntervals, todayStartTs, todayEndTs]); // Make sure to add startTs and endTs to the dependency array

  const handleManualTimeUpdate = (newTotalSeconds: number) => {
    // Adds a manual record based on the new total provided by the modal
    addManualRecord(project, Date.now(), newTotalSeconds);
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      {/* Header Row: Contains Centered Time and Absolute Icon */}
      {/*}
      <View style={styles.headerRow}>
        <Text>Dec 27, 2027</Text>
      </View>
      */}
      <View style={styles.headerRow}>
        <EditBankTime 
          totalSeconds={currentSeconds} 
          onSave={handleManualTimeUpdate}
          isEditing={isEditing}
          onClose={() => setIsEditing(false)}
        />
        
        <TouchableOpacity 
          style={styles.editIconBtn} 
          onPress={() => setIsEditing(true)}
        >
          <MaterialIcons name="edit" size={22} color="#007bff" />
        </TouchableOpacity>
      </View>

      <View style={styles.dayIntervalsTimelineContainer}>
        <DayIntervalsTimeline startTimestampMs={todayStartTs} endTimestampMs={todayEndTs} intervals={timelineIntervals} height={18} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#a0d9b4",
    borderRadius: 10,
    backgroundColor: "#e6ffe6",
    alignItems: "center",
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Keeps TimeSpent centered
    position: 'relative',
    marginBottom: 10,
  },
  editIconBtn: {
    position: 'absolute',
    right: 0,
    padding: 8,
  },
  dayIntervalsTimelineContainer: {
    width: "100%",
    paddingHorizontal: 18,
  },
});

export default CurrentBankMini;