import React, { useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

const SmIconViewComponent = ({ link, id }) => {
  const navigation = useNavigation();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <View className="relative">
      <TouchableOpacity
        className="p-2 rounded-full bg-gray-100"
        onPress={() => navigation.navigate(link, { id })}
        onPressIn={() => setShowTooltip(true)}
        onPressOut={() => setShowTooltip(false)}
      >
        <MaterialIcons name="visibility" size={20} color="#4B5563" />
      </TouchableOpacity>

      {showTooltip &&
        <View className="absolute bg-gray-800 px-2 py-1 rounded -top-8 left-1/2 transform -translate-x-1/2">
          <Text className="text-white text-xs">View</Text>
        </View>}
    </View>
  );
};

export default SmIconViewComponent;
