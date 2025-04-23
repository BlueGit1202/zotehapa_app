import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SmDeleteComponent = ({ onPress, label = "Delete" }) => {
  return (
    <TouchableOpacity
      className="flex-row items-center border border-red-500 rounded-md px-3 py-1.5 m-1"
      onPress={onPress}
    >
      <MaterialIcons name="delete" size={16} color="#ef4444" />
      <Text className="text-red-500 ml-1 text-sm">
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default SmDeleteComponent;
