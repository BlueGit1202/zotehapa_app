import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CategoryBreadcrumbComponent = ({ categories }) => {
  const navigation = useNavigation();
  
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.breadcrumbContainer}>
        {categories.map((category, index) => (
          <View key={category.slug} style={styles.breadcrumbItem}>
            {index < categories.length - 1 ? (
              <TouchableOpacity
                onPress={() => navigation.navigate('Product', { category: category.slug })}
              >
                <Text style={styles.linkText}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.currentText}>
                {category.name}
              </Text>
            )}
            
            {index < categories.length - 1 && (
              <Text style={styles.separator}>›</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'none', // Hidden on mobile by default
  },
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'capitalize',
    color: '#3B82F6', // blue-500
  },
  currentText: {
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'capitalize',
    color: '#1F2937', // gray-800
  },
  separator: {
    fontSize: 14,
    marginHorizontal: 8,
  },
});

export default CategoryBreadcrumbComponent;