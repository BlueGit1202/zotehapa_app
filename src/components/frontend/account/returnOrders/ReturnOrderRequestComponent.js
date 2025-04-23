import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingComponent from './LoadingComponent';
import RNPickerSelect from 'react-native-picker-select';

const ReturnOrderRequestComponent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  
  const [isAllReturn, setIsAllReturn] = useState(false);
  const [form, setForm] = useState({
    return_reason_id: null,
    note: '',
    order_id: null,
    order_serial_no: null,
    products: []
  });
  const [errors, setErrors] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  
  const { loading, order, orderProducts, returnReasons } = useSelector(state => ({
    loading: state.frontendReturnAndRefund.loading,
    order: state.frontendOrder.show,
    orderProducts: state.frontendOrder.orderProducts,
    returnReasons: state.frontendReturnReason.lists
  }));
  
  // Fetch data on component mount
  useEffect(() => {
    if (id) {
      dispatch({ type: 'GET_ORDER_DETAILS_REQUEST', payload: id });
      dispatch({ type: 'GET_RETURN_REASONS_REQUEST' });
    }
  }, [dispatch, id]);
  
  // Update form when order is loaded
  useEffect(() => {
    if (order) {
      setForm(prev => ({
        ...prev,
        order_id: order.id,
        order_serial_no: order.order_serial_no
      }));
    }
  }, [order]);
  
  // Select all products
  const selectAll = (value) => {
    setIsAllReturn(value);
    const updatedProducts = orderProducts.map(product => {
      if (product.is_refundable) {
        return { 
          ...product, 
          isReturn: value,
          quantity: 1
        };
      }
      return product;
    });
    
    dispatch({ type: 'UPDATE_ORDER_PRODUCTS', payload: updatedProducts });
    
    if (value) {
      const selectedProducts = updatedProducts
        .filter(p => p.is_refundable && p.isReturn)
        .map(p => ({
          product_id: p.product_id,
          quantity: 1,
          price: p.price,
          total: p.total,
          tax: p.tax,
          order_quantity: p.order_quantity,
          return_price: parseFloat(1 * p.price),
          has_variation: p.has_variation,
          variation_id: p.variation_id,
          variation_names: p.variation_names,
        }));
      
      setForm(prev => ({ ...prev, products: selectedProducts }));
    } else {
      setForm(prev => ({ ...prev, products: [] }));
    }
  };
  
  // Select single product
  const selectProduct = (index, value) => {
    const updatedProducts = [...orderProducts];
    updatedProducts[index].isReturn = value;
    updatedProducts[index].quantity = value ? 1 : 0;
    
    dispatch({ type: 'UPDATE_ORDER_PRODUCTS', payload: updatedProducts });
    
    const selectedProducts = updatedProducts
      .filter(p => p.is_refundable && p.isReturn)
      .map(p => ({
        product_id: p.product_id,
        quantity: p.quantity,
        price: p.price,
        total: p.total,
        tax: p.tax,
        order_quantity: p.order_quantity,
        return_price: parseFloat(p.quantity * p.price),
        has_variation: p.has_variation,
        variation_id: p.variation_id,
        variation_names: p.variation_names,
      }));
    
    setForm(prev => ({ ...prev, products: selectedProducts }));
    setIsAllReturn(selectedProducts.length === orderProducts.filter(p => p.is_refundable).length);
  };
  
  // Quantity handlers
  const quantityIncrement = (index) => {
    const updatedProducts = [...orderProducts];
    if (updatedProducts[index].quantity < updatedProducts[index].order_quantity) {
      updatedProducts[index].quantity += 1;
      
      dispatch({ type: 'UPDATE_ORDER_PRODUCTS', payload: updatedProducts });
      
      const selectedProducts = form.products.map(p => 
        p.product_id === updatedProducts[index].product_id 
          ? { 
              ...p, 
              quantity: updatedProducts[index].quantity,
              return_price: parseFloat(updatedProducts[index].quantity * updatedProducts[index].price)
            } 
          : p
      );
      
      setForm(prev => ({ ...prev, products: selectedProducts }));
    }
  };
  
  const quantityDecrement = (index) => {
    const updatedProducts = [...orderProducts];
    if (updatedProducts[index].quantity > 1) {
      updatedProducts[index].quantity -= 1;
      
      dispatch({ type: 'UPDATE_ORDER_PRODUCTS', payload: updatedProducts });
      
      const selectedProducts = form.products.map(p => 
        p.product_id === updatedProducts[index].product_id 
          ? { 
              ...p, 
              quantity: updatedProducts[index].quantity,
              return_price: parseFloat(updatedProducts[index].quantity * updatedProducts[index].price)
            } 
          : p
      );
      
      setForm(prev => ({ ...prev, products: selectedProducts }));
    }
  };
  
  const handleQuantityChange = (index, value) => {
    const updatedProducts = [...orderProducts];
    let quantity = parseInt(value) || 0;
    
    if (quantity < 1) quantity = 1;
    if (quantity > updatedProducts[index].order_quantity) {
      quantity = updatedProducts[index].order_quantity;
    }
    
    updatedProducts[index].quantity = quantity;
    
    dispatch({ type: 'UPDATE_ORDER_PRODUCTS', payload: updatedProducts });
    
    const selectedProducts = form.products.map(p => 
      p.product_id === updatedProducts[index].product_id 
        ? { 
            ...p, 
            quantity: quantity,
            return_price: parseFloat(quantity * updatedProducts[index].price)
          } 
        : p
    );
    
    setForm(prev => ({ ...prev, products: selectedProducts }));
  };
  
  // Handle image selection
  const handleImageSelection = (event) => {
    // In React Native, you would use a library like react-native-image-picker
    // This is a simplified version
    // const files = event.target.files;
    // setSelectedImages(files);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!form.return_reason_id) {
      setErrors({ return_reason_id: ['Return reason is required'] });
      return;
    }
    
    if (form.products.length === 0) {
      setErrors({ products: ['Please select at least one product'] });
      return;
    }
    
    const formData = new FormData();
    formData.append('return_reason_id', form.return_reason_id);
    formData.append('note', form.note);
    formData.append('order_id', form.order_id);
    formData.append('order_serial_no', form.order_serial_no);
    formData.append('products', JSON.stringify(form.products));
    
    // Append images
    // selectedImages.forEach((image, index) => {
    //   formData.append('image[]', {
    //     uri: image.uri,
    //     type: image.type,
    //     name: image.fileName
    //   });
    // });
    
    dispatch({ 
      type: 'SUBMIT_RETURN_REQUEST_REQUEST', 
      payload: { 
        id, 
        form: formData,
        navigation 
      } 
    });
  };
  
  return (
    <ScrollView className="p-4 bg-gray-50">
      <LoadingComponent loading={loading} />
      
      {/* Header */}
      <View className="flex-row items-center mb-7">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#3B82F6" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-primary ml-4">Return Request</Text>
      </View>
      
      <View className="rounded-xl shadow-md mb-6 bg-white">
        <Text className="font-semibold p-4">Order ID: #{order?.order_serial_no}</Text>
        
        {errors.products && (
          <View className="bg-red-100 border border-red-400 rounded p-3 mx-4 mb-4">
            <Text className="text-red-700">{errors.products[0]}</Text>
            <TouchableOpacity 
              className="absolute top-0 right-0 p-2"
              onPress={() => setErrors(prev => ({ ...prev, products: null }))}
            >
              <Icon name="close" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
        
        <ScrollView horizontal>
          <View>
            {/* Table Header */}
            <View className="flex-row border-b border-t border-gray-200">
              <Text className="w-16 p-4 font-semibold">
                <TouchableOpacity onPress={() => selectAll(!isAllReturn)}>
                  <Icon 
                    name={isAllReturn ? "checkbox-marked" : "checkbox-blank-outline"} 
                    size={20} 
                    color="#3B82F6" 
                  />
                </TouchableOpacity>
              </Text>
              <Text className="w-48 p-4 font-semibold">Products</Text>
              <Text className="w-32 p-4 font-semibold">Quantity</Text>
            </View>
            
            {/* Table Rows */}
            {orderProducts && orderProducts.length > 0 ? (
              orderProducts.map((product, index) => (
                <View key={index} className="flex-row border-b border-gray-100 last:border-0">
                  <View className="w-16 p-4 justify-center">
                    {product.is_refundable ? (
                      <TouchableOpacity onPress={() => selectProduct(index, !product.isReturn)}>
                        <Icon 
                          name={product.isReturn ? "checkbox-marked" : "checkbox-blank-outline"} 
                          size={20} 
                          color="#3B82F6" 
                        />
                      </TouchableOpacity>
                    ) : (
                      <Text className="text-red-500 font-semibold">Not Refundable</Text>
                    )}
                  </View>
                  <View className="w-48 p-4 flex-row items-center">
                    <Image 
                      source={{ uri: product.product_image }} 
                      className="w-12 h-12 rounded-md"
                    />
                    <View className="ml-3 flex-1">
                      <Text className="text-sm font-medium" numberOfLines={1}>{product.product_name}</Text>
                      {product.has_variation && (
                        <Text className="text-xs text-gray-500" numberOfLines={1}>{product.variation_names}</Text>
                      )}
                    </View>
                  </View>
                  <View className="w-32 p-4 justify-center">
                    {product.is_refundable && product.isReturn ? (
                      <View className="flex-row items-center justify-between bg-gray-100 rounded-full p-1">
                        <TouchableOpacity 
                          onPress={() => quantityDecrement(index)}
                          disabled={product.quantity <= 1}
                        >
                          <Icon 
                            name="minus-circle" 
                            size={20} 
                            color={product.quantity <= 1 ? "#A0A3BD" : "#3B82F6"} 
                          />
                        </TouchableOpacity>
                        <TextInput
                          className="text-center w-10 text-sm font-medium"
                          value={product.quantity.toString()}
                          onChangeText={(value) => handleQuantityChange(index, value)}
                          keyboardType="numeric"
                        />
                        <TouchableOpacity 
                          onPress={() => quantityIncrement(index)}
                          disabled={product.quantity >= product.order_quantity}
                        >
                          <Icon 
                            name="plus-circle" 
                            size={20} 
                            color={product.quantity >= product.order_quantity ? "#A0A3BD" : "#3B82F6"} 
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <Text className="text-center">-</Text>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View className="p-4">
                <Text>No products found</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
      
      {/* Return Details Form */}
      <View className="rounded-xl shadow-md p-4 mb-6 bg-white">
        <View className="mb-4">
          <Text className="font-medium mb-2">Return Reason *</Text>
          <View className={`border rounded-lg p-3 ${errors.return_reason_id ? 'border-red-500' : 'border-gray-200'}`}>
            <RNPickerSelect
              onValueChange={(value) => {
                setForm(prev => ({ ...prev, return_reason_id: value }));
                setErrors(prev => ({ ...prev, return_reason_id: null }));
              }}
              items={returnReasons.map(reason => ({
                label: reason.title,
                value: reason.id
              }))}
              placeholder={{ label: 'Select a reason...', value: null }}
              value={form.return_reason_id}
            />
          </View>
          {errors.return_reason_id && (
            <Text className="text-red-500 text-xs mt-1">{errors.return_reason_id[0]}</Text>
          )}
        </View>
        
        <View className="mb-4">
          <Text className="font-medium mb-2">Return Note</Text>
          <TextInput
            className="border border-gray-200 rounded-lg p-3 h-24 text-sm"
            multiline
            numberOfLines={4}
            onChangeText={(text) => setForm(prev => ({ ...prev, note: text }))}
            value={form.note}
          />
          {errors.note && (
            <Text className="text-red-500 text-xs mt-1">{errors.note[0]}</Text>
          )}
        </View>
        
        <View>
          <Text className="font-medium mb-2">Attachment</Text>
          <TouchableOpacity 
            className="border border-gray-200 rounded-lg p-3 items-center"
            onPress={handleImageSelection}
          >
            <Icon name="image" size={24} color="#6B7280" />
            <Text className="text-gray-500 mt-2">Select Images</Text>
          </TouchableOpacity>
          {selectedImages.length > 0 && (
            <ScrollView horizontal className="mt-2">
              {Array.from(selectedImages).map((image, index) => (
                <Image 
                  key={index}
                  source={{ uri: image.uri }}
                  className="w-16 h-16 rounded-lg mr-2"
                />
              ))}
            </ScrollView>
          )}
        </View>
      </View>
      
      {/* Submit Button */}
      <TouchableOpacity 
        className="bg-primary py-3 px-6 rounded-full items-center mb-20"
        onPress={handleSubmit}
      >
        <Text className="text-white font-semibold">Submit Return</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ReturnOrderRequestComponent;