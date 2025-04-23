import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';

const HeaderComponent = () => {
  const carts = useSelector(state => state.frontendCart.lists);

  return (
    <View className="mb-4">
      <Text className="text-lg font-bold capitalize">Your Shipping Cart</Text>
      <Text className="text-sm font-medium capitalize text-gray-600">
        ({carts.length}) {carts.length > 1 ? 'products' : 'product'}
      </Text>
    </View>
  );
};

export default HeaderComponent;