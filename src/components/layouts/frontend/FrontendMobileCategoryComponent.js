import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Modal, Animated, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchCategoryTrees } from '../../../store/actions/frontend/frontendProductCategoryActions';

const MobileCategoryDrawer = ({ visible, onClose }) => {
  const [slideAnim] = useState(new Animated.Value(0));
  const [modalStack, setModalStack] = useState([]);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const setting = useSelector((state) => state.frontendSetting.lists);
  const categories = useSelector((state) => state.frontendProductCategory.trees);

  useEffect(() => {
    dispatch(fetchCategoryTrees());
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      // Initialize with root categories
      setModalStack([{ 
        title: 'Categories', 
        data: categories,
        parent: null 
      }]);
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      // Reset stack when closing
      setModalStack([]);
    }
  }, [visible]);

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 0],
  });

  const handleCategoryPress = (category) => {
    if (category?.children?.length > 0) {
      // Push new level onto stack
      setModalStack(prev => [...prev, {
        title: category.name,
        data: category.children,
        parent: category
      }]);
    } else {
      onClose();
      navigation.navigate('Products', { category: category.slug });
    }
  };

  const handleBack = () => {
    if (modalStack.length > 1) {
      // Pop current level from stack
      setModalStack(prev => prev.slice(0, -1));
    } else {
      onClose();
    }
  };

  const renderCurrentModal = () => {
    const currentLevel = modalStack[modalStack.length - 1];
    if (!currentLevel) return null;

    return (
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          {modalStack.length > 1 ? (
            <TouchableOpacity onPress={handleBack}>
              <MaterialIcons name="arrow-back" size={24} color="#3B82F6" />
            </TouchableOpacity>
          ) : (
            <Image
              source={{ uri: setting?.theme_logo }}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
          
          <Text style={styles.modalTitle} numberOfLines={1}>
            {currentLevel.title}
          </Text>
          
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.categoryList}>
          {currentLevel.data?.length > 0 ? (
            currentLevel.data.map((category) => (
              <TouchableOpacity
                key={category.slug}
                style={styles.categoryItem}
                onPress={() => handleCategoryPress(category)}
              >
                <Text style={styles.categoryName}>{category.name}</Text>
                {category.children?.length > 0 && (
                  <MaterialIcons 
                    name="keyboard-arrow-right" 
                    size={24} 
                    color="#3B82F6" 
                  />
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No categories found</Text>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View style={[styles.modalWrapper, { transform: [{ translateX }] }]}>
          {renderCurrentModal()}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 12,
    textAlign: 'center',
  },
  logo: {
    width: 112,
    height: 40,
  },
  categoryList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryName: {
    fontSize: 16,
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default MobileCategoryDrawer;