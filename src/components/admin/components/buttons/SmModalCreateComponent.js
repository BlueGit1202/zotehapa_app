import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SmModalCreateComponent = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      className="flex-row items-center h-[37px] px-4 rounded bg-blue-500"
      onPress={onPress}
    >
      <MaterialIcons name="add-circle" size={20} color="white" />
      <Text className="text-white ml-2">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default SmModalCreateComponent;
