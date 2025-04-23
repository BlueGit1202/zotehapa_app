import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const FilterComponent = ({ onPress }) => {
  return (
    <TouchableOpacity
      className="flex-row items-center bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm"
      onPress={onPress}
    >
      <MaterialIcons name="filter-list" size={16} color="#6b7280" />
      <Text className="text-gray-600 ml-1 text-sm">Filter</Text>
    </TouchableOpacity>
  );
};

export default FilterComponent;
