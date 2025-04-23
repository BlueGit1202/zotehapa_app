import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Chip = ({ text, onRemove, color = "#e0e0e0", disabled = false }) => {
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Text style={styles.text}>
        {text}
      </Text>
      {!disabled &&
        <TouchableOpacity
          onPress={onRemove}
          style={styles.closeButton}
          disabled={disabled}
        >
          <Icon name="close" size={16} color="#666" />
        </TouchableOpacity>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginRight: 4
  },
  closeButton: {
    padding: 2
  }
});

export default Chip;
