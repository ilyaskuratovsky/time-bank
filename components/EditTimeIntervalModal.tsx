import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Interval } from "../database/useTimeBankDatabase";

interface EditTimeIntervalModalProps {
  visible: boolean;
  interval: Interval | null;
  onClose: () => void;
  onSave: (updatedStart: number, updatedEnd: number) => void;
}

/**
 * Helper to format a timestamp into a 24h format (HH:MM) for the text input
 */
const formatTimestampToHM = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

/**
 * Helper to take the edited "HH:MM" string and map it back into the 
 * original timestamp's base calendar date.
 */
const mergeTimeToTimestamp = (timeStr: string, originalTimestamp: number): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date(originalTimestamp);
  if (!isNaN(hours) && !isNaN(minutes)) {
    date.setHours(hours, minutes, 0, 0);
  }
  return date.getTime();
};

const EditTimeIntervalModal: React.FC<EditTimeIntervalModalProps> = ({
  visible,
  interval,
  onClose,
  onSave,
}) => {
  const [startTimeStr, setStartTimeStr] = useState("");
  const [endTimeStr, setEndTimeStr] = useState("");

  // Sync internal input state whenever a new interval is selected/passed in
  useEffect(() => {
    if (interval) {
      setStartTimeStr(formatTimestampToHM(interval.start));
      setEndTimeStr(formatTimestampToHM(interval.end));
    }
  }, [interval, visible]);

  const handleSave = () => {
    if (!interval) return;

    const updatedStart = mergeTimeToTimestamp(startTimeStr, interval.start);
    const updatedEnd = mergeTimeToTimestamp(endTimeStr, interval.end);

    if (updatedEnd < updatedStart) {
      alert("End time cannot be earlier than start time!");
      return;
    }

    onSave(updatedStart, updatedEnd);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.modalTitle}>Edit Logged Time</Text>

          <View style={modalStyles.inputGroup}>
            <Text style={modalStyles.inputLabel}>Start Time (HH:MM)</Text>
            <TextInput
              style={modalStyles.input}
              value={startTimeStr}
              onChangeText={setStartTimeStr}
              placeholder="09:00"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />
          </View>

          <View style={modalStyles.inputGroup}>
            <Text style={modalStyles.inputLabel}>End Time (HH:MM)</Text>
            <TextInput
              style={modalStyles.input}
              value={endTimeStr}
              onChangeText={setEndTimeStr}
              placeholder="17:00"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />
          </View>

          <View style={modalStyles.buttonGroup}>
            <TouchableOpacity
              style={[modalStyles.btn, modalStyles.btnCancel]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={modalStyles.btnCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[modalStyles.btn, modalStyles.btnSave]}
              onPress={handleSave}
              activeOpacity={0.7}
            >
              <Text style={modalStyles.btnSaveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    width: "100%",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#334155",
    backgroundColor: "#f8fafc",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  btnCancel: {
    backgroundColor: "#f1f5f9",
  },
  btnCancelText: {
    color: "#475569",
    fontWeight: "600",
  },
  btnSave: {
    backgroundColor: "#2563eb",
  },
  btnSaveText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});

export default EditTimeIntervalModal;