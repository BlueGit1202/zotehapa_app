import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BreadcrumbComponent from "../components/BreadcrumbComponent";

const CustomerComponent = ({ children }) => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 p-4">
      <BreadcrumbComponent />
      {children}
    </View>
  );
};

export default CustomerComponent;
