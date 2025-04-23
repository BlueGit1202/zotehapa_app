import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SmSidebarModalCreateComponent = ({ title = "Add New", onPress }) => {
  return (
    <TouchableOpacity
      className="flex-row items-center bg-blue-500 rounded-md px-4 py-2 h-[37px]"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialIcons name="add-circle" size={18} color="white" />
      <Text className="text-white ml-2 text-sm font-medium">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default SmSidebarModalCreateComponent;
