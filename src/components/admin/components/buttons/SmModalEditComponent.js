import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SmModalEditComponent = ({ onPress, label = "Edit" }) => {
  return (
    <TouchableOpacity
      className="flex-row items-center border border-green-500 rounded-md px-3 py-1.5 m-0.5"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialIcons name="edit" size={16} color="#22c55e" />
      <Text className="text-green-600 ml-1 text-sm">
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default SmModalEditComponent;
