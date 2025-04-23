import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfWeek,
  endOfWeek,
  subWeeks,
  subMonths,
  subYears
} from "date-fns";

const ShopperzDatePicker = ({
  inputStyle = "box",
  range = false,
  onDateChange
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRange, setSelectedRange] = useState([null, null]);
  const [presetLabel, setPresetLabel] = useState("");

  const presetDates = [
    { label: "Today", value: [new Date(), new Date()] },
    {
      label: "Last Week",
      value: [
        startOfWeek(subWeeks(new Date(), 1)),
        endOfWeek(subWeeks(new Date(), 1))
      ]
    },
    {
      label: "This Month",
      value: [startOfMonth(new Date()), endOfMonth(new Date())]
    },
    {
      label: "Last Month",
      value: [
        startOfMonth(subMonths(new Date(), 1)),
        endOfMonth(subMonths(new Date(), 1))
      ]
    },
    {
      label: "This Year",
      value: [startOfYear(new Date()), endOfYear(new Date())]
    },
    {
      label: "Last Year",
      value: [
        startOfYear(subYears(new Date(), 1)),
        endOfYear(subYears(new Date(), 1))
      ]
    }
  ];

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    if (range) {
      if (!selectedRange[0]) {
        setSelectedRange([date, null]);
      } else if (!selectedRange[1]) {
        const newRange = [selectedRange[0], date].sort((a, b) => a - b);
        setSelectedRange(newRange);
        onDateChange(newRange);
        hideDatePicker();
      }
    } else {
      setSelectedDate(date);
      onDateChange(date);
      hideDatePicker();
    }
  };

  const applyPreset = dates => {
    if (range) {
      setSelectedRange(dates);
      onDateChange(dates);
    } else {
      setSelectedDate(dates[0]);
      onDateChange(dates[0]);
    }
    hideDatePicker();
  };

  const clearSelection = () => {
    if (range) {
      setSelectedRange([null, null]);
      onDateChange([null, null]);
    } else {
      setSelectedDate(null);
      onDateChange(null);
    }
    setPresetLabel("");
  };

  const getDisplayText = () => {
    if (range) {
      if (selectedRange[0] && selectedRange[1]) {
        return `${format(selectedRange[0], "MMM dd, yyyy")} - ${format(
          selectedRange[1],
          "MMM dd, yyyy"
        )}`;
      } else if (selectedRange[0]) {
        return `${format(selectedRange[0], "MMM dd, yyyy")} - Select end date`;
      }
      return presetLabel || "Select date range";
    }
    return selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Select date";
  };

  const styles = StyleSheet.create({
    box: {
      borderWidth: 1,
      borderColor: "rgba(var(--primary), 0.5)",
      borderRadius: 8,
      height: 42,
      paddingHorizontal: 12,
      justifyContent: "center",
      maxWidth: 260
    },
    read: {
      justifyContent: "flex-end",
      paddingRight: 30
    },
    filter: {
      borderWidth: 1,
      borderColor: "#e5e7eb",
      borderRadius: 8,
      height: 42,
      paddingHorizontal: 12,
      justifyContent: "center",
      width: "100%"
    },
    inputText: {
      fontSize: 14,
      fontWeight: "500",
      color: "rgb(var(--primary))"
    },
    filterText: {
      color: "#566a7f"
    },
    iconContainer: {
      position: "absolute",
      left: 12,
      flexDirection: "row",
      alignItems: "center"
    },
    clearIcon: {
      position: "absolute",
      right: 8
    },
    presetContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      padding: 8,
      gap: 6
    },
    presetButton: {
      padding: 8,
      borderRadius: 6,
      backgroundColor: "#f7f7f7"
    },
    presetText: {
      fontSize: 12,
      fontWeight: "500",
      textAlign: "center",
      textTransform: "capitalize"
    }
  });

  return (
    <View>
      <TouchableOpacity
        style={[
          styles[inputStyle],
          { flexDirection: "row", alignItems: "center" }
        ]}
        onPress={showDatePicker}
      >
        {inputStyle === "box" &&
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="calendar"
              size={18}
              color="rgb(var(--primary))"
            />
          </View>}

        <Text
          style={[
            styles.inputText,
            inputStyle === "filter" && styles.filterText,
            { flex: 1 }
          ]}
        >
          {getDisplayText()}
        </Text>

        {(selectedDate || (selectedRange[0] && inputStyle !== "read")) &&
          <TouchableOpacity style={styles.clearIcon} onPress={clearSelection}>
            <MaterialCommunityIcons
              name="close"
              size={22}
              color="rgb(var(--primary))"
            />
          </TouchableOpacity>}
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        display={inputStyle === "filter" ? "inline" : "spinner"}
      />

      {/* Custom modal for preset dates */}
      {isDatePickerVisible &&
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 8,
            padding: 12,
            marginTop: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 10,
            elevation: 2
          }}
        >
          <View style={styles.presetContainer}>
            {presetDates.map((preset, index) =>
              <TouchableOpacity
                key={index}
                style={styles.presetButton}
                onPress={() => {
                  applyPreset(preset.value);
                  setPresetLabel(preset.label);
                }}
              >
                <Text style={styles.presetText}>
                  {preset.label}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>}
    </View>
  );
};

export default ShopperzDatePicker;
