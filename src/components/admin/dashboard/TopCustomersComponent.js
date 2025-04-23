import React, { useEffect } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { dashboardActions } from "../../../store/actions/dashboardActions";

const TopCustomersComponent = () => {
  const dispatch = useDispatch();
  const { topCustomers } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(dashboardActions.fetchTopCustomers());
  }, []);

  return (
    <View className="bg-white rounded-lg shadow-sm mb-4 p-4">
      <Text className="font-semibold text-lg mb-4">Top Customers</Text>

      {topCustomers.length > 0
        ? <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex flex-row space-x-4">
              {topCustomers.map((customer, index) =>
                <View
                  key={index}
                  className="w-32 rounded-xl border border-gray-200 p-3"
                >
                  <Image
                    source={{ uri: customer.image }}
                    className="w-12 h-12 rounded-full mx-auto mb-2"
                    defaultSource={require("../../../../assets/profile.png")}
                  />
                  <Text
                    className="text-sm font-medium text-center mb-4"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {customer.name}
                  </Text>
                  <Text className="text-xs text-center py-1 rounded-b-lg text-white bg-blue-500">
                    {customer.order} Orders
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        : <Text className="text-center text-gray-500">
            No top customers found
          </Text>}
    </View>
  );
};

export default TopCustomersComponent;
