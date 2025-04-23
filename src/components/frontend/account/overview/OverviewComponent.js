import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Pressable, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingComponent from './LoadingComponent';
import OrderReceiptComponent from './OrderReceiptComponent';
import { 
  getTotalOrders, 
  getTotalCompletedOrders, 
  getTotalReturnedOrders, 
  getWalletBalance,
  getOrderLists
} from '../actions/frontendOverviewActions';

const OverviewComponent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  // State
  const [orderId, setOrderId] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  
  // Redux state
  const { 
    loading, 
    name, 
    totalOrders, 
    totalCompletedOrders, 
    totalReturnedOrders, 
    walletBalance,
    orders
  } = useSelector(state => ({
    loading: state.frontendOverview.loading,
    name: state.auth.user?.name || '',
    totalOrders: state.frontendOverview.totalOrders,
    totalCompletedOrders: state.frontendOverview.totalCompletedOrders,
    totalReturnedOrders: state.frontendOverview.totalReturnedOrders,
    walletBalance: state.frontendOverview.walletBalance,
    orders: state.frontendOverview.orders
  }));
  
  // Order status enum
  const orderStatusEnum = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    ON_THE_WAY: 'On The Way',
    DELIVERED: 'Delivered',
    CANCELED: 'Canceled',
    REJECTED: 'Rejected'
  };
  
  // Payment status enum
  const paymentStatusEnum = {
    PAID: 'Paid',
    UNPAID: 'Unpaid'
  };
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(getTotalOrders());
    dispatch(getTotalCompletedOrders());
    dispatch(getTotalReturnedOrders());
    dispatch(getWalletBalance());
    dispatch(getOrderLists({ page: 1, per_page: 3 }));
  }, [dispatch]);
  
  // Order status class
  const orderStatusClass = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'ON_THE_WAY': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELED': 
      case 'REJECTED': 
        return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle order receipt modal
  const handleOrderReceiptModal = (order) => {
    setOrderId(order.id);
    setShowReceiptModal(true);
  };
  
  // Close modal
  const closeModal = () => {
    setShowReceiptModal(false);
    setOrderId(null);
  };
  
  return (
    <ScrollView className="p-4 bg-gray-50">
      <LoadingComponent loading={loading} />
      
      <Text className="text-2xl font-bold mb-2 text-primary">Overview</Text>
      <Text className="mb-7 font-medium">Welcome back, {name}!</Text>
      
      {/* Stats Cards */}
      <View className="flex flex-row flex-wrap justify-between mb-8">
        <View className="w-[48%] md:w-[23%] p-3 rounded-xl shadow-sm bg-white mb-4">
          <View className="bg-pink-500 shadow-pink w-10 h-10 rounded-lg items-center justify-center mb-4">
            <Icon name="shopping" size={20} color="white" />
          </View>
          <Text className="text-pink-500 text-2xl font-bold mb-1">{totalOrders || 0}</Text>
          <Text className="font-medium text-gray-700">Total Orders</Text>
        </View>
        
        <View className="w-[48%] md:w-[23%] p-3 rounded-xl shadow-sm bg-white mb-4">
          <View className="bg-orange-500 shadow-orange w-10 h-10 rounded-lg items-center justify-center mb-4">
            <Icon name="cart-check" size={20} color="white" />
          </View>
          <Text className="text-orange-500 text-2xl font-bold mb-1">{totalCompletedOrders || 0}</Text>
          <Text className="font-medium text-gray-700">Total Completed</Text>
        </View>
        
        <View className="w-[48%] md:w-[23%] p-3 rounded-xl shadow-sm bg-white mb-4">
          <View className="bg-purple-500 shadow-purple w-10 h-10 rounded-lg items-center justify-center mb-4">
            <Icon name="refresh" size={20} color="white" />
          </View>
          <Text className="text-purple-500 text-2xl font-bold mb-1">{totalReturnedOrders || 0}</Text>
          <Text className="font-medium text-gray-700">Total Returned</Text>
        </View>
        
        <View className="w-[48%] md:w-[23%] p-3 rounded-xl shadow-sm bg-white mb-4">
          <View className="bg-blue-500 shadow-blue w-10 h-10 rounded-lg items-center justify-center mb-4">
            <Icon name="wallet" size={20} color="white" />
          </View>
          <Text className="text-blue-500 text-2xl font-bold mb-1">{walletBalance || 0}</Text>
          <Text className="font-medium text-gray-700">Wallet Balance</Text>
        </View>
      </View>
      
      {/* Order History */}
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-xl font-bold">Order History</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('OrderHistory')}
          className="py-2 px-4 rounded-full bg-gray-200"
        >
          <Text className="text-primary font-semibold">Show Full History</Text>
        </TouchableOpacity>
      </View>
      
      {/* Orders Table */}
      <View className="rounded-xl shadow-md bg-white mb-20">
        <ScrollView horizontal>
          <View>
            {/* Table Header */}
            <View className="flex-row border-b-2 border-gray-200">
              <Text className="w-24 p-4 font-semibold">Order ID</Text>
              <Text className="w-24 p-4 font-semibold">Products</Text>
              <Text className="w-24 p-4 font-semibold">Status</Text>
              <Text className="w-24 p-4 font-semibold">Payment</Text>
              <Text className="w-24 p-4 font-semibold">Amount</Text>
              <Text className="w-24 p-4 font-semibold">Action</Text>
            </View>
            
            {/* Table Rows */}
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <View key={order.id} className="flex-row border-t border-gray-100">
                  <View className="w-24 p-4">
                    <Text className="font-semibold mb-1">{order.order_serial_no}</Text>
                    <Text className="text-xs text-gray-600">{order.order_datetime}</Text>
                  </View>
                  <View className="w-24 p-4">
                    <Text>{order.order_items} Product</Text>
                  </View>
                  <View className="w-24 p-4">
                    <Text className={`px-2 py-1 rounded-full text-xs ${orderStatusClass(order.status)}`}>
                      {orderStatusEnum[order.status]}
                    </Text>
                  </View>
                  <View className="w-24 p-4">
                    <Text className={`text-xs px-2 py-1 rounded-full ${
                      paymentStatusEnum.PAID === order.payment_status 
                        ? 'text-green-500 bg-green-100' 
                        : 'text-red-500 bg-red-100'
                    }`}>
                      {paymentStatusEnum[order.payment_status]}
                    </Text>
                  </View>
                  <View className="w-24 p-4">
                    <Text>{order.total_currency_price}</Text>
                  </View>
                  <View className="w-24 p-4">
                    <View className="relative">
                      <TouchableOpacity>
                        <View className="w-8 h-8 rounded-lg bg-primary items-center justify-center">
                          <Icon name="dots-horizontal" size={20} color="white" />
                        </View>
                      </TouchableOpacity>
                      <View className="absolute top-10 right-0 bg-white rounded-lg shadow-md z-10 border border-gray-100">
                        <TouchableOpacity 
                          onPress={() => navigation.navigate('OrderDetails', { id: order.id })}
                          className="px-3 py-2 border-b border-gray-100"
                        >
                          <Text>View</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => handleOrderReceiptModal(order)}
                          className="px-3 py-2"
                        >
                          <Text>Download</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className="p-4">
                <Text>No orders found</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
      
      {/* Order Receipt Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showReceiptModal}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="w-full max-w-xs bg-white rounded-lg">
            <View className="flex-row justify-between p-4">
              <TouchableOpacity 
                onPress={closeModal}
                className="flex-row items-center bg-red-500 py-2 px-4 rounded"
              >
                <Icon name="close" size={16} color="white" />
                <Text className="text-white ml-1 text-xs">Close</Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-row items-center bg-green-500 py-2 px-4 rounded">
                <Icon name="printer" size={16} color="white" />
                <Text className="text-white ml-1 text-xs">Print Invoice</Text>
              </TouchableOpacity>
            </View>
            
            {orderId && <OrderReceiptComponent orderId={orderId} />}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default OverviewComponent;