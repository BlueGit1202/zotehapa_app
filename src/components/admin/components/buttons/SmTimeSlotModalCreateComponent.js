import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SmTimeSlotModalCreateComponent = ({
  onPress,
  label = "Add",
  style = {}
}) => {
  return (
    <TouchableOpacity
      className="flex-row items-center h-7 px-3 rounded-full bg-rose-50"
      style={style}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialIcons name="add" size={14} color="#ec4899" />
      <Text className="text-pink-600 ml-1.5 text-xs font-semibold capitalize">
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default SmTimeSlotModalCreateComponent;
