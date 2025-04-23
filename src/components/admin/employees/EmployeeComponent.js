import React from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import EmployeeListComponent from "./EmployeeListComponent";
import EmployeeCreateComponent from "./EmployeeCreateComponent";
import EmployeeShowComponent from "./EmployeeShowComponent";
import EmployeeOrderDetailsComponent from "./EmployeeOrderDetailsComponent";

const Stack = createStackNavigator();

const EmployeeComponent = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EmployeeList" component={EmployeeListComponent} />
      <Stack.Screen name="EmployeeCreate" component={EmployeeCreateComponent} />
      <Stack.Screen name="EmployeeShow" component={EmployeeShowComponent} />
      <Stack.Screen
        name="EmployeeOrderDetails"
        component={EmployeeOrderDetailsComponent}
      />
    </Stack.Navigator>
  );
};

export default EmployeeComponent;
