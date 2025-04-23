// components/CustomCheckbox.js
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomCheckbox = ({ 
  isChecked, 
  onToggle, 
  label, 
  size = 20,
  checkedColor = '#3B82F6', // Default blue color for checked state
  uncheckedColor = '#D1D5DB', // Default gray color for unchecked state
  icon = 'checkmark',
  iconSize = 14,
  iconColor = 'white',
  labelStyle,
  containerStyle,
  checkboxStyle
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, containerStyle]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[
        styles.checkbox,
        { 
          width: size, 
          height: size,
          borderColor: isChecked ? checkedColor : uncheckedColor,
          backgroundColor: isChecked ? checkedColor : 'transparent'
        },
        checkboxStyle
      ]}>
        {isChecked && (
          <Icon name={icon} size={iconSize} color={iconColor} />
        )}
      </View>
      {label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8
  },
  checkbox: {
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    marginLeft: 8,
    fontSize: 16
  }
});

export default CustomCheckbox;