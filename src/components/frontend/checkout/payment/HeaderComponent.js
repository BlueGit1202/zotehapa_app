import React from 'react';
import { View, Text } from 'react-native';

const HeaderComponent = () => {
  return (
    <View className="mb-4">
      <Text className="text-lg font-bold capitalize mb-1">Payment Information</Text>
      <Text className="text-sm font-medium capitalize text-gray-600">
        Select your payment method
      </Text>
    </View>
  );
};

export default HeaderComponent;