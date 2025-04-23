import React from "react";
import { TouchableOpacity, Text, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const ExcelComponent = ({ onPress }) => {
  const handlePress = () => {
    try {
      onPress();
    } catch (error) {
      Alert.alert("Error", "Failed to generate Excel file");
      console.error("Excel download error:", error);
    }
  };

  return (
    <TouchableOpacity
      className="flex-row items-center py-2 px-4"
      onPress={handlePress}
      accessibilityLabel="Download Excel"
    >
      <MaterialIcons name="description" size={20} color="#1D6F42" />
      <Text className="ml-2">Excel</Text>
    </TouchableOpacity>
  );
};

export default ExcelComponent;
