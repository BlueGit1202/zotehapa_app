import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BreadcrumbComponent from "../components/BreadcrumbComponent";

const ProductComponent = ({ children }) => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 py-2">
        <BreadcrumbComponent navigation={navigation} />
      </View>
      {children}
    </View>
  );
};

export default ProductComponent;
