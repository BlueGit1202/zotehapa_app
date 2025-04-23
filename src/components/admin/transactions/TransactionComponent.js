import React from "react";
import { View } from "react-native";
import BreadcrumbComponent from "../components/BreadcrumbComponent";

const TransactionComponent = ({ children }) => {
  return (
    <View className="flex-1 p-4">
      <View className="mb-4">
        <BreadcrumbComponent />
      </View>
      {children}
    </View>
  );
};

export default TransactionComponent;
