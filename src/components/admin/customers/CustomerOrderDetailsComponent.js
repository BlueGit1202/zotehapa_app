import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import LoadingComponent from '../components/LoadingComponent';
import { fetchMyOrderDetails } from '../../../store/actions/myOrderDetailsActions';

const CustomerOrderDetailsComponent = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const order = useSelector(state => state.myOrderDetails.orderDetails);
  const orderProducts = useSelector(state => state.myOrderDetails.orderProducts);
  const orderAddresses = useSelector(state => state.myOrderDetails.orderAddresses);
  const outletAddress = useSelector(state => state.myOrderDetails.outletAddress);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (route.params?.id && route.params?.orderId) {
        try {
          setLoading(true);
          await dispatch(fetchMyOrderDetails({
              id: route.params.id,
              orderId: route.params.orderId
            }));
        } catch (error) {
          console.error('Error fetching order details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrderDetails();
  }, [route.params?.id, route.params?.orderId]);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <Text className="text-lg font-bold mb-4">{'Order details'}</Text>
        
        <View className="border-b border-gray-200 pb-4 mb-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">{'Order Id'}:</Text>
            <Text className="font-medium">{order?.order_serial_no}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">{'Status'}:</Text>
            <Text className="font-medium">{order?.order_status}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">{'Date'}:</Text>
            <Text className="font-medium">{order?.created_at}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">{'Total amount'}:</Text>
            <Text className="font-medium">${order?.total_amount}</Text>
          </View>
        </View>

        {orderAddresses && (
          <View className="mb-4">
            <Text className="font-bold mb-2">{'Delivery address'}</Text>
            <View className="bg-gray-50 p-3 rounded">
              <Text>{orderAddresses.address}</Text>
              <Text>{orderAddresses.city}, {orderAddresses.state}</Text>
              <Text>{orderAddresses.country}</Text>
              <Text>{'Postal code'}: {orderAddresses.postal_code}</Text>
            </View>
          </View>
        )}

        {outletAddress && (
          <View className="mb-4">
            <Text className="font-bold mb-2">{'Outlet address'}</Text>
            <View className="bg-gray-50 p-3 rounded">
              <Text>{outletAddress.address}</Text>
              <Text>{outletAddress.city}, {outletAddress.state}</Text>
              <Text>{outletAddress.country}</Text>
              <Text>{'Postal code'}: {outletAddress.postal_code}</Text>
            </View>
          </View>
        )}
      </View>

      <View className="bg-white rounded-lg shadow-sm p-4">
        <Text className="text-lg font-bold mb-4">{t('label.products')}</Text>
        
        {orderProducts?.map((product, index) => (
          <View key={index} className="border-b border-gray-200 pb-3 mb-3">
            <View className="flex-row justify-between">
              <Text className="font-medium">{product.name}</Text>
              <Text>x{product.quantity}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">{t('label.price')}:</Text>
              <Text>${product.price}</Text>
            </View>
            {product.variation && (
              <View className="flex-row justify-between">
                <Text className="text-gray-600">{t('label.variation')}:</Text>
                <Text>{product.variation}</Text>
              </View>
            )}
            {product.addons && product.addons.length > 0 && (
              <View className="mt-1">
                <Text className="text-gray-600">{t('label.addons')}:</Text>
                {product.addons.map((addon, i) => (
                  <View key={i} className="flex-row justify-between ml-2">
                    <Text>- {addon.name}</Text>
                    <Text>x{addon.quantity}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CustomerOrderDetailsComponent;