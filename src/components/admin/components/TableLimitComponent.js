import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const TableLimitComponent = ({ page, search, onLimitChange }) => {

  if (page?.total <= 10) {
    return null;
  }

  return (
    <View className="border border-gray-300 rounded-md">
      <Picker
        selectedValue={search.per_page.toString()}
        onValueChange={(itemValue) => {
          search.per_page = parseInt(itemValue);
          onLimitChange();
        }}
        style={{ height: 40, width: 100 }}
      >
        <Picker.Item label={'10'} value="10" />
        <Picker.Item label={'25'} value="25" />
        <Picker.Item label={'50'} value="50" />
        <Picker.Item label={'100'} value="100" />
        <Picker.Item label={'500'} value="500" />
        <Picker.Item label={'1000'} value="1000" />
      </Picker>
    </View>
  );
};

export default TableLimitComponent;