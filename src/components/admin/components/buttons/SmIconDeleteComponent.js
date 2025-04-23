import React, { useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SmIconDeleteComponent = ({ onPress, tooltipText = "Delete" }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        onPressIn={() => setShowTooltip(true)}
        onPressOut={() => setShowTooltip(false)}
        activeOpacity={0.7}
      >
        <MaterialIcons name="delete" size={20} color="#ef4444" />
      </TouchableOpacity>

      {showTooltip &&
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>
            {tooltipText}
          </Text>
        </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center"
  },
  button: {
    padding: 8,
    borderRadius: 4
  },
  tooltip: {
    position: "absolute",
    top: -30,
    backgroundColor: "#333",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 10
  },
  tooltipText: {
    color: "white",
    fontSize: 12
  }
});

export default SmIconDeleteComponent;
