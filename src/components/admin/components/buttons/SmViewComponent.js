import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const SmViewComponent = ({ link, id, label = "View", style = {} }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(link, { id });
  };

  return (
    <TouchableOpacity
      className="flex-row items-center border border-blue-400 rounded-md px-3 py-1.5 m-0.5"
      style={style}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <MaterialIcons name="visibility" size={16} color="#3b82f6" />
      <Text className="text-blue-500 ml-1 text-sm">
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default SmViewComponent;
