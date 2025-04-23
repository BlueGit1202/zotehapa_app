import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SmSidebarModalEditComponent = ({
  onPress,
  label = "Edit",
  style = {}
}) => {
  return (
    <TouchableOpacity
      className="flex-row items-center border border-blue-400 rounded-md px-3 py-1.5"
      style={style}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialIcons name="edit" size={14} color="#3b82f6" />
      <Text className="text-blue-500 ml-1 text-xs">
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default SmSidebarModalEditComponent;
