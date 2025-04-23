import React, { useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const SmIconModalEditComponent = ({ onPress }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <View className="relative">
      <TouchableOpacity
        className="p-2 rounded-full bg-blue-100"
        onPress={onPress}
        onPressIn={() => setShowTooltip(true)}
        onPressOut={() => setShowTooltip(false)}
      >
        <MaterialIcons name="edit" size={20} color="#3B82F6" />
      </TouchableOpacity>

      {showTooltip &&
        <View className="absolute bg-gray-800 px-2 py-1 rounded -top-8 left-1/2 transform -translate-x-1/2">
          <Text className="text-white text-xs">Edit</Text>
        </View>}
    </View>
  );
};

export default SmIconModalEditComponent;
