import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import LoadingComponent from '../../components/LoadingComponent';
import PaginationWrapper from '../../components/PaginationWrapper';
import { customerAddressActions } from '../../../../store/actions/customerAddressActions';
customerAddressActions

const CustomerAddressListComponent = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  
  const customerId = route.params?.id;
  const addresses = useSelector(state => state.customerAddress.lists);
  const pagination = useSelector(state => state.customerAddress.pagination);
  const page = useSelector(state => state.customerAddress.page);

  useEffect(() => {
    fetchAddresses();
  }, [customerId]);

  const fetchAddresses = async (page = 1) => {
    try {
      setLoading(true);
      await dispatch(customerAddressActions.lists({
        id: customerId,
        search: {
          page,
          per_page: 10,
          order_column: 'id',
          order_type: 'desc'
        }
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchAddresses(page);
  };

  const handleDelete = async (addressId) => {
    try {
      setLoading(true);
      await dispatch(customerAddressActions.destroy({
        id: customerId,
        addressId,
        search: {
          page: 1,
          per_page: 10
        }
      }));
      alertService.success('Address deleted successfully');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View className="border-b border-gray-200 py-4">
      <View className="mb-2">
        <Text className="font-bold">{item.full_name}</Text>
      </View>
      <View className="mb-1">
        <Text>{item.email}</Text>
      </View>
      <View className="mb-1">
        <Text>{item.country_code}{item.phone}</Text>
      </View>
      <View className="mb-1">
        <Text>{item.address}</Text>
      </View>
      <View className="mb-1">
        <Text>{item.city}, {item.state}, {item.country}</Text>
      </View>
      <View className="mb-2">
        <Text>{item.zip_code}</Text>
      </View>
      <View className="flex-row justify-end">
        <TouchableOpacity 
          onPress={() => navigation.navigate('CustomerAddressEdit', { 
            id: customerId, 
            addressId: item.id 
          })}
          className="bg-yellow-100 px-2 py-1 rounded mr-2"
        >
          <Text className="text-yellow-600">{'Edit'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => handleDelete(item.id)}
          className="bg-red-100 px-2 py-1 rounded"
        >
          <Text className="text-red-600">{'Delete'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <View className="flex-1 p-4 bg-gray-50">
      <View className="mb-4">
        <Text className="text-lg font-bold">{'Address'}</Text>
      </View>

      <View className="bg-white rounded-lg shadow-sm">
        <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
          <Text className="text-lg font-bold">{'Address'}</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('CustomerAddressCreate', { id: customerId })}
            className="bg-green-500 p-2 rounded"
          >
            <Text className="text-white">{'Add address'}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={addresses}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={
            <View className="p-4">
              <Text className="text-center text-gray-500">{'Not addresses found'}</Text>
            </View>
          }
          contentContainerStyle={{ padding: 16 }}
        />

        <PaginationWrapper 
          pagination={pagination}
          page={page}
          onPageChange={handlePageChange}
        />
      </View>
    </View>
  );
};

export default CustomerAddressListComponent;