import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import LoadingComponent from '../components/LoadingComponent';
import { customerAddressActions } from '../../../store/actions/customerAddressActions';

const CustomerAddressEdit = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { customerId, addressId } = route.params;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    zip_code: '',
    address: ''
  });

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoading(true);
        const response = await dispatch(customerAddressActions.show(addressId));
        setForm(response.data);
      } catch (error) {
        Alert.alert('error', 'Address load error');
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [addressId]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await dispatch(customerAddressActions.edit({
        id: addressId,
        customerId,
        form
      }));
      navigation.goBack();
      Alert.alert('success', 'Address updated successfully');
    } catch (error) {
      setErrors(error.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold mb-4">{'Edit address'}</Text>
      
      {/* Form fields similar to your create screen */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">{'Full name'}*</Text>
        <TextInput
          value={form.full_name}
          onChangeText={(text) => setForm({...form, full_name: text})}
          className={`border rounded p-2 ${errors.full_name ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.full_name && <Text className="text-red-500 text-xs">{errors.full_name[0]}</Text>}
      </View>

      {/* Add all other address fields here */}

      <TouchableOpacity
        className="bg-blue-500 p-3 rounded mt-4"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center">{'Save changes'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CustomerAddressEdit;