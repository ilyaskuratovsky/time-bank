import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface EditBankTimeProps { // Renamed interface
  totalSeconds: number;
  isEditing: boolean;
  onSave: (val: number) => void;
  onClose: () => void;
}

export const EditBankTime: React.FC<EditBankTimeProps> = ({ // Renamed component
  totalSeconds,
  isEditing,
  onSave,
  onClose,
}) => {
  // 1. Drafting state for the Modal only
  const [draft, setDraft] = useState({ h: 0, m: 0, s: 0 });

  // 2. Display calculation for the main screen (Read-only)
  const displayH = Math.floor(totalSeconds / 3600);
  const displayM = Math.floor((totalSeconds % 3600) / 60);
  const displayS = Math.round(totalSeconds % 60);

  // 3. Initialize draft only when the modal opens
  useEffect(() => {
    if (isEditing) {
      setDraft({
        h: Math.floor(totalSeconds / 3600),
        m: Math.floor((totalSeconds % 3600) / 60),
        s: Math.round(totalSeconds % 60),
      });
    }
  }, [isEditing]); // Remove totalSeconds from here to prevent "jumping" while editing

  const adjust = (type: "h" | "m" | "s", delta: number) => {
    setDraft((prev) => {
      if (type === "h") return { ...prev, h: Math.max(0, prev.h + delta) };
      if (type === "m") return { ...prev, m: (prev.m + delta + 60) % 60 };
      if (type === "s") return { ...prev, s: (prev.s + delta + 60) % 60 };
      return prev;
    });
  };

  const handleReset = () => setDraft({ h: 0, m: 0, s: 0 });

  const handleSave = () => {
    const newTotal = draft.h * 3600 + draft.m * 60 + draft.s;
    onSave(newTotal);
  };

  const Column = ({ label, value, type }: { label: string; value: number; type: "h" | "m" | "s" }) => (
    <View style={styles.pickerColumn}>
      <TouchableOpacity onPress={() => adjust(type, 1)} style={styles.arrowBtn}>
        <MaterialIcons name="keyboard-arrow-up" size={44} color="#007bff" />
      </TouchableOpacity>
      <View style={styles.valueBox}>
        <Text style={styles.pickerValue}>{value.toString().padStart(2, "0")}</Text>
        <Text style={styles.pickerLabel}>{label}</Text>
      </View>
      <TouchableOpacity onPress={() => adjust(type, -1)} style={styles.arrowBtn}>
        <MaterialIcons name="keyboard-arrow-down" size={44} color="#007bff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      {/* Read-only Display (Always follows totalSeconds) */}
      <View style={styles.timeRow}>
        <Text style={styles.bankedTimeText}>{`${displayH}h ${displayM}m`}</Text>
        <Text style={styles.secondsText}>{`${displayS}s`}</Text>
      </View>

      <Modal visible={isEditing} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.pickerContainer}>
              <Column label="hours" value={draft.h} type="h" />
              <Text style={styles.separator}>:</Text>
              <Column label="mins" value={draft.m} type="m" />
              <Text style={styles.separator}>:</Text>
              <Column label="secs" value={draft.s} type="s" />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btn, styles.secondaryBtn]} onPress={onClose}>
                <Text style={styles.secondaryBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.clearBtn]} onPress={handleReset}>
                <Text style={styles.clearBtnText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  timeRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  bankedTimeText: {
    fontSize: 44,
    fontWeight: "bold",
    color: "#007bff",
  },
  secondsText: {
    fontSize: 20,
    color: "#6c757d",
    marginLeft: 6,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "95%",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 30,
    borderRadius: 28,
    alignItems: "center",
    elevation: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 35,
  },
  pickerColumn: {
    alignItems: "center",
    width: 85,
  },
  arrowBtn: {
    padding: 2,
  },
  valueBox: {
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingVertical: 14,
    width: "100%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  pickerValue: {
    fontSize: 36,
    fontWeight: "800",
    color: "#0f172a",
  },
  pickerLabel: {
    fontSize: 10,
    color: "#94a3b8",
    textTransform: "uppercase",
    fontWeight: "700",
    marginTop: 2,
  },
  separator: {
    fontSize: 32,
    fontWeight: "300",
    marginHorizontal: 0,
    color: "#cbd5e1",
    paddingBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtn: {
    backgroundColor: "#f1f5f9",
  },
  clearBtn: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#dc3545",
  },
  saveBtn: {
    backgroundColor: "#007bff",
  },
  secondaryBtnText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 15,
  },
  clearBtnText: {
    color: "#dc3545",
    fontWeight: "600",
    fontSize: 15,
  },
  saveBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
});
