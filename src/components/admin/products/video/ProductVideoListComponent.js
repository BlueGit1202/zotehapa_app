import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Table, Row, Rows } from 'react-native-table-component';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { lists, destroy } from '../../../../store/actions/productVideoActions';

const ProductVideoList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;

  // State for loading, pagination, and search filters
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    per_page: 10,
    order_column: 'id',
    order_type: 'desc',
  });

  // Get data from Redux store
  const productVideos = useSelector(state => state.productVideo.lists);
  const pagination = useSelector(state => state.productVideo.pagination);

  // Fetch videos on mount and when searchParams change
  useEffect(() => {
    fetchVideos();
  }, [searchParams]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      await dispatch(lists({ productId, searchParams }));
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete with confirmation
  const handleDelete = (id) => {
    Alert.alert(
      'Delete Video',
      'Are you sure you want to delete this video?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              setLoading(true);
              await dispatch(destroy({ id, productId, searchParams }));
              Alert.alert('Success', 'Video deleted successfully');
            } catch (err) {
              Alert.alert('Error', err.response?.data?.message || 'Failed to delete video');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Navigate to edit screen
  const handleEdit = (video) => {
    navigation.navigate('EditProductVideo', { video, productId });
  };

  // Table headers
  const tableHeaders = ['Video Provider', 'Link', 'Actions'];

  // Format table data
  const tableData = productVideos.map(video => [
    video.provider_name,
    video.link,
    <View className="flex flex-row space-x-2">
      <TouchableOpacity onPress={() => handleEdit(video)}>
        <Icon name="edit" size={20} color="#3b82f6" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(video.id)}>
        <Icon name="delete" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  ]);

  return (
    <View className="flex-1 bg-white p-4">
      {/* Header */}
      <View className="flex flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">Videos</Text>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded"
          onPress={() => navigation.navigate('AddProductVideo', { productId })}
        >
          <Text className="text-white">Add Video</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#4B6FED" className="my-4" />}

      {/* Table (Scrollable for mobile) */}
      <ScrollView horizontal={true} className="mb-4">
        <View className="border border-gray-200 rounded">
          <Table borderStyle={{ borderWidth: 1, borderColor: '#e5e7eb' }}>
            <Row
              data={tableHeaders}
              className="bg-gray-100 p-2"
              textStyle={{ fontWeight: 'bold', textAlign: 'center' }}
            />
            <Rows data={tableData} textStyle={{ padding: 8, textAlign: 'center' }} />
          </Table>
        </View>
      </ScrollView>

      {/* Pagination Controls */}
      <View className="flex flex-row justify-between items-center mt-4">
        <TouchableOpacity
          className="bg-gray-200 px-3 py-1 rounded"
          disabled={searchParams.page === 1}
          onPress={() => setSearchParams({ ...searchParams, page: searchParams.page - 1 })}
        >
          <Text>Previous</Text>
        </TouchableOpacity>
        <Text>Page {searchParams.page} of {pagination?.last_page || 1}</Text>
        <TouchableOpacity
          className="bg-gray-200 px-3 py-1 rounded"
          disabled={searchParams.page === pagination?.last_page}
          onPress={() => setSearchParams({ ...searchParams, page: searchParams.page + 1 })}
        >
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductVideoList;