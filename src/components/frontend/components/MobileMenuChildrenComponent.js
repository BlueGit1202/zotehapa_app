import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const MobileMenuChildrenComponent = ({ 
  categories = [], 
  parentCategory,
  onClose,
  onShowChildMenu
}) => {
  const navigation = useNavigation();

  if (categories.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onClose(`mobile_category_${parentCategory.slug}`)}>
          <Icon name="chevron-left" size={24} style={styles.icon} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => {
            navigation.navigate('Product', { category: parentCategory.slug });
            onClose('mobile-category-canvas');
          }}
        >
          <Text style={styles.title}>{parentCategory.name}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => onClose('mobile-category-canvas')}
          style={styles.closeButton}
        >
          <Icon name="close-circle" size={24} color="#F23E14" />
        </TouchableOpacity>
      </View>

      {/* Category List */}
      <ScrollView style={styles.listContainer}>
        {categories.map((category) => (
          <View key={category.slug} style={styles.listItem}>
            <View style={styles.itemContent}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Product', { category: category.slug });
                  onClose('mobile-category-canvas');
                }}
                style={styles.categoryLink}
              >
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
              
              {category.children?.length > 0 && (
                <TouchableOpacity
                  onPress={() => onShowChildMenu(`mobile_category_${category.slug}`)}
                  style={styles.chevronButton}
                >
                  <View style={styles.chevronCircle}>
                    <Icon name="chevron-right" size={20} color="#007FE3" />
                  </View>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Recursive children */}
            {category.children?.length > 0 && (
              <MobileMenuChildrenComponent 
                categories={category.children}
                parentCategory={category}
                onClose={onClose}
                onShowChildMenu={onShowChildMenu}
              />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.8,
    height: '100%',
    position: 'absolute',
    top: 0,
    left: -width, // Start off-screen
    backgroundColor: 'white',
    zIndex: 40,
    elevation: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  icon: {
    marginRight: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  closeButton: {
    marginLeft: 'auto',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  categoryLink: {
    flex: 1,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  chevronButton: {
    marginLeft: 8,
  },
  chevronCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 127, 227, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MobileMenuChildrenComponent;