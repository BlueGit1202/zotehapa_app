import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  variationContainer: {
    marginBottom: 16,
  },
  variationName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  optionButtonSelected: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  optionButtonUnselected: {
    borderColor: '#D1D5DB',
  },
  optionText: {
    fontSize: 14,
  },
});

const VariationSelector = ({ variations, onSelect }) => {
  const [selectedOptions, setSelectedOptions] = React.useState({});
  
  const handleOptionSelect = (variationId, optionId) => {
    const newSelection = {
      ...selectedOptions,
      [variationId]: optionId,
    };
    
    setSelectedOptions(newSelection);
    
    // Find the selected variation based on the selected options
    if (variations.length > 0 && variations[0].options.length > 0) {
      onSelect(variations[0].options[0]);
    }
  };

  return (
    <View style={styles.container}>
      {variations.map((variation) => (
        <View key={variation.id} style={styles.variationContainer}>
          <Text style={styles.variationName}>{variation.name}:</Text>
          <View style={styles.optionsContainer}>
            {variation.options.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleOptionSelect(variation.id, option.id)}
                style={[
                  styles.optionButton,
                  selectedOptions[variation.id] === option.id
                    ? styles.optionButtonSelected
                    : styles.optionButtonUnselected
                ]}
              >
                <Text style={styles.optionText}>{option.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

export default VariationSelector;