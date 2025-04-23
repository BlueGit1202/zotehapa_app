import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';

const DropdownPicker = ({ 
  items = [], 
  value, 
  onValueChange, 
  labelBy = 'label', 
  valueBy = 'value', 
  placeholder = 'Select an item',
  className = ''
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedItem = items.find(item => item[valueBy] === value);

  return (
    <>
      <TouchableOpacity 
        className={`border rounded p-2 ${className}`}
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-gray-800">
          {selectedItem ? selectedItem[labelBy] : placeholder}
        </Text>
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="w-80 bg-white rounded-lg p-4">
            <Text className="text-lg font-bold mb-4">Select an option</Text>
            <ScrollView className="max-h-64">
              {items.map(item => (
                <TouchableOpacity 
                  key={item[valueBy]}
                  className="p-3 border-b border-gray-200"
                  onPress={() => {
                    onValueChange(item[valueBy]);
                    setModalVisible(false);
                  }}
                >
                  <Text className="text-gray-800">{item[labelBy]}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              className="mt-4 p-2 bg-gray-200 rounded items-center"
              onPress={() => setModalVisible(false)}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DropdownPicker;