import React, { useEffect } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { dashboardActions } from "../../../store/actions/dashboardActions";

const TopProductsComponent = () => {
  const dispatch = useDispatch();
  const { topProducts } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(dashboardActions.fetchTopProducts());
  }, []);

  return (
    <View className="bg-white rounded-lg shadow-sm mb-4 p-4">
      <Text className="font-semibold text-lg mb-4">Top Products</Text>

      {topProducts.length > 0
        ? <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex flex-row space-x-4">
              {topProducts.map((product, index) =>
                <View key={index} className="w-40">
                  <Image
                    source={{ uri: product.image }}
                    className="w-full h-32 rounded-lg mb-2"
                    defaultSource={require("../../../../assets/product.png")}
                  />
                  <Text
                    className="text-sm font-medium"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {product.name}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {product.sales} Sales
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        : <Text className="text-center text-gray-500">
            No top products found
          </Text>}
    </View>
  );
};

export default TopProductsComponent;
