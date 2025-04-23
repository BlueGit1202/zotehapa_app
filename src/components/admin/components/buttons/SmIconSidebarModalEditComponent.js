import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SmIconSidebarModalEditComponent = ({ onPress }) => {
  return (
    <TouchableOpacity
      className="p-2 rounded-full bg-blue-100"
      onPress={onPress}
      accessibilityLabel="Edit button"
    >
      <MaterialIcons name="edit" size={20} color="#3B82F6" />
      {/* Tooltip would require additional implementation */}
    </TouchableOpacity>
  );
};

export default SmIconSidebarModalEditComponent;
