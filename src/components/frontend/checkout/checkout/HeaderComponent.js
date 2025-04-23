import React from 'react';
import { View, Text } from 'react-native';

const HeaderComponent = () => {
  return (
    <View className="mb-4">
      <Text className="text-lg font-bold capitalize mb-1">
        Provide your shipping information
      </Text>
      <Text className="text-sm font-medium capitalize text-gray-600">
        Check your information before you continue
      </Text>
    </View>
  );
};

export default HeaderComponent;