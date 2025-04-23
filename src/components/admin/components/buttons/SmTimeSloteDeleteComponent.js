import React from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SmTimeSlotDeleteComponent = ({ onPress, size = 24 }) => {
  return (
    <TouchableOpacity
      className="absolute -top-2 -right-2"
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <MaterialIcons name="cancel" size={size} color="#ef4444" />
    </TouchableOpacity>
  );
};

export default SmTimeSlotDeleteComponent;
