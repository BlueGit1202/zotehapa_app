import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const MobileMenuChildren = ({ categories, onClose, onBack }) => {
  const navigation = useNavigation();

  const handleCategoryPress = (slug) => {
    onClose();
    navigation.navigate('Products', { category: slug });
  };

  return (
    <View>
      {categories?.length > 0 ? (
        categories.map((category) => (
          <View key={category?.slug} style={styles.childCategoryItem}>
            <TouchableOpacity 
              onPress={() => handleCategoryPress(category?.slug)}
              style={styles.childCategoryButton}
            >
              <Text style={styles.childCategoryName}>{category?.name || 'Subcategory'}</Text>
            </TouchableOpacity>
            
            {category?.children?.length > 0 && (
              <TouchableOpacity onPress={() => handleCategoryPress(category?.slug)}>
                <MaterialIcons 
                  name="keyboard-arrow-right" 
                  size={24} 
                  color="#3B82F6" 
                />
              </TouchableOpacity>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noItemsText}>No subcategories available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  childCategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  childCategoryButton: {
    flex: 1,
  },
  childCategoryName: {
    fontSize: 15,
  },
  noItemsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
});

export default MobileMenuChildren;