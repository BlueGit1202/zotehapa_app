import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const ExportComponent = ({ onPress }) => {
  return (
    <TouchableOpacity
      className="flex-row items-center bg-white py-2 px-4 rounded-lg shadow-sm border border-gray-200"
      onPress={onPress}
      accessibilityLabel="Export button"
    >
      <MaterialIcons name="file-download" size={20} color="#4B5563" />
      <Text className="ml-2 text-gray-700">Export</Text>
    </TouchableOpacity>
  );
};

export default ExportComponent;
