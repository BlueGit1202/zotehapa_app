import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingComponent from './LoadingComponent';

const ReturnOrderDetailsComponent = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { id } = route.params;
  
  const { loading, returnOrder, returnProducts } = useSelector(state => ({
    loading: state.frontendReturnAndRefund.loading,
    returnOrder: state.frontendReturnAndRefund.show,
    returnProducts: state.frontendReturnAndRefund.returnProducts
  }));
  
  // Return status enum
  const returnStatusEnum = {
    PENDING: 'Pending',
    ACCEPT: 'Accepted',
    REJECTED: 'Rejected'
  };
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch({ type: 'GET_RETURN_ORDER_DETAILS_REQUEST', payload: id });
  }, [dispatch, id]);
  
  // Return status class
  const returnStatusClass = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPT': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <ScrollView className="p-4 bg-gray-50">
      <LoadingComponent loading={loading} />
      
      {/* Header */}
      <View className="flex-row items-center mb-7">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#3B82F6" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-primary ml-4">Return Order Details</Text>
      </View>
      
      {/* Order Products */}
      <View className="rounded-xl shadow-md mb-6 bg-white">
        <Text className="font-semibold p-4">Order ID: #{returnOrder?.order_serial_no}</Text>
        
        <ScrollView horizontal>
          <View>
            {/* Table Header */}
            <View className="flex-row border-b border-t border-gray-200">
              <Text className="w-48 p-4 font-semibold">Products</Text>
              <Text className="w-24 p-4 font-semibold">Quantity</Text>
              <Text className="w-24 p-4 font-semibold">Price</Text>
              <Text className="w-24 p-4 font-semibold">Total</Text>
            </View>
            
            {/* Table Rows */}
            {returnProducts && returnProducts.length > 0 ? (
              returnProducts.map((product, index) => (
                <View key={index} className="flex-row border-b border-gray-100 last:border-0">
                  <View className="w-48 p-4 flex-row items-center">
                    <Image 
                      source={{ uri: product.product_image }} 
                      className="w-12 h-12 rounded-md"
                    />
                    <View className="ml-3 flex-1">
                      <Text className="text-sm font-medium" numberOfLines={1}>{product.product_name}</Text>
                      {product.variation_names && (
                        <Text className="text-xs text-gray-500" numberOfLines={1}>{product.variation_names}</Text>
                      )}
                    </View>
                  </View>
                  <Text className="w-24 p-4">{product.quantity}</Text>
                  <Text className="w-24 p-4">{product.currency_price}</Text>
                  <Text className="w-24 p-4">{product.return_currency_price}</Text>
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
      
      {/* Return Details */}
      <View className="rounded-xl shadow-md p-4 mb-6 bg-white">
        {returnOrder?.return_reason_name && (
          <View className="mb-5">
            <Text className="font-semibold mb-2">Return Reason</Text>
            <Text className="text-sm">{returnOrder.return_reason_name}</Text>
          </View>
        )}
        
        {returnOrder?.note && (
          <View className="mb-5">
            <Text className="font-semibold mb-2">Return Note</Text>
            <Text className="text-sm">{returnOrder.note}</Text>
          </View>
        )}
        
        {returnOrder?.images?.length > 0 && (
          <View>
            <Text className="font-semibold mb-3">Attachment</Text>
            <ScrollView horizontal>
              <View className="flex-row">
                {returnOrder.images.map((image, index) => (
                  <Image 
                    key={index}
                    source={{ uri: image }} 
                    className="w-20 h-20 rounded-lg mr-4"
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
      
      {/* Return Response */}
      <View className="rounded-xl shadow-md p-4 bg-white mb-20">
        <Text className="font-semibold mb-2 text-blue-500">Return Response</Text>
        <View className="flex-row items-center mb-3">
          <Text className="text-sm">Status:</Text>
          <Text className={`text-sm font-semibold ml-1 px-2 py-1 rounded-full ${returnStatusClass(returnOrder?.status)}`}>
            {returnStatusEnum[returnOrder?.status]}
          </Text>
        </View>
        {returnOrder?.status === 'REJECTED' && returnOrder?.reject_reason && (
          <Text className="text-sm">{returnOrder.reject_reason}</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default ReturnOrderDetailsComponent;