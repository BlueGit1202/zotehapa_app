import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  ScrollView,
  ActivityIndicator,
  Alert,
  Picker
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { lists, save } from '../../../../store/actions/productVariationActions';
import { getSku as generateSku } from '../../../../store/actions/productActions';
import appService from '../../../../../services/appService';

const ProductVariationCreate = ({ route }) => {
  const { productId } = route.params;
  const dispatch = useDispatch();
  const { attributes, loading } = useSelector(state => state.productAttributes);
  const sku = useSelector(state => state.products.sku);

  const [showModal, setShowModal] = useState(false);
  const [variationData, setVariationData] = useState({
    elements: {},
    price: '',
    sku: '',
    attributes: []
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(lists({ order_type: "asc" }));
    dispatch(generateSku());
  }, []);

  const handleAddVariation = () => {
    setShowModal(true);
  };

  const handleReset = () => {
    setShowModal(false);
    setVariationData({
      elements: {},
      price: '',
      sku: sku,
      attributes: []
    });
    setErrors({});
    dispatch(generateSku());
  };

  const handleAttributeChange = (attributeId, optionId) => {
    setVariationData(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        [attributeId]: optionId
      }
    }));
  };

  const handleGenerateSku = () => {
    dispatch(generateSku())
      .then(() => {
        setVariationData(prev => ({
          ...prev,
          sku
        }));
      });
  };

  const handleSave = () => {
    const attributes = [];
    Object.entries(variationData.elements).forEach(([attrId, optionId]) => {
      if (optionId) {
        attributes.push({
          product_attribute_id: attrId,
          product_attribute_option_id: optionId,
          price: variationData.price,
          sku: variationData.sku
        });
      }
    });

    if (attributes.length === 0) {
      setErrors({ global: ["Please select at least one attribute option"] });
      return;
    }

    dispatch(save({
      productId,
      attributes: JSON.stringify(attributes)
    }))
      .then(() => {
        Alert.alert('Success', 'Variation saved successfully');
        handleReset();
      })
      .catch(err => {
        setErrors(err.response?.data?.errors || {});
      });
  };

  return (
    <View style={styles.container}>
      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4B6FED" />
        </View>
      )}

      {/* Add Variation Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddVariation}
      >
        <Icon name="plus-circle" size={20} color="white" />
        <Text style={styles.addButtonText}>Add Variation</Text>
      </TouchableOpacity>

      {/* Variation Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={false}
        onRequestClose={handleReset}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Variations</Text>
            <TouchableOpacity onPress={handleReset}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Modal Body */}
          <ScrollView style={styles.modalBody}>
            {/* Global Error */}
            {errors.global && (
              <View style={styles.errorAlert}>
                <Text style={styles.errorText}>{errors.global[0]}</Text>
              </View>
            )}

            {/* Attribute Selection */}
            <View style={styles.section}>
              {attributes.length > 0 ? (
                attributes.map(attribute => (
                  <View key={attribute.id} style={styles.formGroup}>
                    <Text style={styles.label}>{attribute.name}</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={variationData.elements[attribute.id] || ''}
                        onValueChange={(itemValue) => handleAttributeChange(attribute.id, itemValue)}
                        style={styles.picker}
                      >
                        <Picker.Item label="Please select" value="" />
                        {attribute.options.map(option => (
                          <Picker.Item 
                            key={option.id} 
                            label={option.name} 
                            value={option.id} 
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyAlert}>
                  <Text style={styles.emptyText}>No attributes available. Please add attributes first.</Text>
                </View>
              )}
            </View>

            {/* Price and SKU */}
            <View style={styles.section}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Price*</Text>
                <TextInput
                  style={[styles.input, errors.price && styles.inputError]}
                  value={variationData.price}
                  onChangeText={text => setVariationData({...variationData, price: text})}
                  keyboardType="numeric"
                  placeholder="Enter price"
                  onKeyPress={({ nativeEvent }) => appService.floatNumber(nativeEvent)}
                />
                {errors.price && <Text style={styles.errorText}>{errors.price[0]}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>SKU*</Text>
                <View style={styles.skuContainer}>
                  <TextInput
                    style={[styles.input, styles.skuInput, errors.sku && styles.inputError]}
                    value={variationData.sku}
                    onChangeText={text => setVariationData({...variationData, sku: text})}
                    placeholder="Enter SKU"
                  />
                  <TouchableOpacity 
                    style={styles.generateButton}
                    onPress={handleGenerateSku}
                  >
                    <Icon name="shuffle" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                {errors.sku && <Text style={styles.errorText}>{errors.sku[0]}</Text>}
              </View>
            </View>
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleReset}
            >
              <Icon name="close-circle" size={20} color="#008BBA" />
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Icon name="content-save" size={20} color="white" />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 37,
    backgroundColor: '#008BBA',
    borderRadius: 4,
    paddingHorizontal: 12,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    flex: 1,
    padding: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  section: {
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  skuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skuInput: {
    flex: 1,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  generateButton: {
    width: 40,
    height: 40,
    backgroundColor: '#008BBA',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  errorAlert: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  emptyAlert: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeeba',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
  },
  emptyText: {
    color: '#856404',
    fontSize: 14,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#008BBA',
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#008BBA',
    marginLeft: 8,
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#008BBA',
    borderRadius: 4,
    flex: 1,
    marginLeft: 8,
  },
  saveButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default ProductVariationCreate;