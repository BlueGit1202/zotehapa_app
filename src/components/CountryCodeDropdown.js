import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';

const CountryCodeDropdown = ({ 
  countryCodes, 
  selectedCountry, 
  onSelect, 
  showFullList = false,
  className = ''
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity 
        className={`border rounded p-2 flex-row items-center ${className}`}
        onPress={() => setModalVisible(true)}
      >
        {selectedCountry && (
          <>
            <Text className="mr-1">{selectedCountry.flag_emoji}</Text>
            <Text className="text-xs">{selectedCountry.calling_code}</Text>
          </>
        )}
        {!showFullList && (
          <Text className="ml-1">▼</Text>
        )}
      </TouchableOpacity>
      
      {showFullList ? (
        <View className="mt-2">
          <ScrollView className="max-h-40 border rounded">
            {countryCodes.map(country => (
              <TouchableOpacity 
                key={country.id}
                className="p-2 border-b border-gray-200 flex-row items-center"
                onPress={() => {
                  onSelect(country);
                  setModalVisible(false);
                }}
              >
                <Text className="mr-2">{country.flag_emoji}</Text>
                <Text className="flex-1">{country.country_name}</Text>
                <Text>{country.calling_code}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="w-80 bg-white rounded-lg p-4">
              <Text className="text-lg font-bold mb-4">Select Country</Text>
              <ScrollView className="max-h-64">
                {countryCodes.map(country => (
                  <TouchableOpacity 
                    key={country.id}
                    className="p-2 border-b border-gray-200 flex-row items-center"
                    onPress={() => {
                      onSelect(country);
                      setModalVisible(false);
                    }}
                  >
                    <Text className="mr-2">{country.flag_emoji}</Text>
                    <Text className="flex-1">{country.country_name}</Text>
                    <Text>{country.calling_code}</Text>
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
      )}
    </>
  );
};

export default CountryCodeDropdown;