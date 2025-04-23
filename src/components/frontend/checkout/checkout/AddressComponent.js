import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, Modal, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import appService from '../../../../../services/appService';
import LoadingComponent from '../../components/LoadingComponent';
import alertService from '../../../../../services/alertService';
import { fetchCallingCode, fetchCountryCode, fetchCountryCodes } from '../../../../store/actions/frontend/frontendCountryCodeActions';
import { companyActions } from '../../../../store/actions/companyActions';
import { frontendAddressActions } from '../../../../store/actions/frontend/frontendAddressActions';

const AddressComponent = ({ show, slug, title, selectedAddress, method }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState({ isActive: false });
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState({
    form: {
      full_name: "",
      email: "",
      country_code: null,
      phone: "",
      country: null,
      state: null,
      city: null,
      zip_code: "",
      address: "",
    },
    flag: "",
    calling_code: "",
    countries: [],
    states: [],
    cities: []
  });

  const addresses = useSelector(state => state.frontendAddress.lists);
  const countryCodes = useSelector(state => state.frontendCountryCode.lists);
  const [activeAddressId, setActiveAddressId] = useState(null);

  useEffect(() => {
    if (show) {
      setLoading({ isActive: true });
      dispatch("frontendAddress/lists", {
        search: {
          paginate: 0,
          order_column: "id",
          order_type: "asc",
        }
      }).finally(() => setLoading({ isActive: false }));

      setLoading({ isActive: true });
      dispatch(fetchCountryCodes());
      dispatch(companyActions.lists()).then(companyRes => {
        dispatch(fetchCountryCode(companyRes.data.data.company_country_code)).then(res => {
          setAddress(prev => ({
            ...prev,
            form: {
              ...prev.form,
              country_code: res.data.data.calling_code
            },
            calling_code: res.data.data.calling_code,
            flag: res.data.data.flag_emoji
          }));
          setLoading({ isActive: false });
        }).catch(() => setLoading({ isActive: false }));
      }).catch(() => setLoading({ isActive: false }));
    }
  }, [show, dispatch]);

  const phoneNumber = (e) => {
    return appService.phoneNumber(e);
  };

  const activeAddress = (address) => {
    setActiveAddressId(address.id);
    method(address);
  };

  const callCountry = () => {
    setLoading({ isActive: true });
    // In React Native, you would use a different approach for country/state/city data
    // For now, we'll mock it
    const mockCountries = [{ name: "United States" }, { name: "Canada" }];
    setAddress(prev => ({ ...prev, countries: mockCountries }));
    setLoading({ isActive: false });
  };

  const changeCountry = (e) => {
    setAddress(prev => ({
      ...prev,
      flag: e.flag_emoji,
      form: {
        ...prev.form,
        country_code: e.calling_code
      }
    }));
  };

  const callStates = (countryName) => {
    // Mock states data
    const mockStates = countryName === "United States" ? 
      [{ name: "California" }, { name: "New York" }] : 
      [{ name: "Ontario" }, { name: "Quebec" }];
    
    setAddress(prev => ({
      ...prev,
      states: mockStates,
      form: {
        ...prev.form,
        state: null,
        city: null
      },
      cities: []
    }));
  };

  const callCities = (stateName) => {
    // Mock cities data
    const mockCities = stateName === "California" ? 
      [{ name: "Los Angeles" }, { name: "San Francisco" }] : 
      [{ name: "Toronto" }, { name: "Ottawa" }];
    
    setAddress(prev => ({
      ...prev,
      cities: mockCities,
      form: {
        ...prev.form,
        city: null
      }
    }));
  };

  const reset = () => {
    setModalVisible(false);
    dispatch(frontendAddressActions.reset());
    setErrors({});
    setAddress(prev => ({
      ...prev,
      form: {
        full_name: "",
        email: "",
        country_code: prev.calling_code,
        phone: "",
        country: null,
        state: null,
        city: null,
        zip_code: "",
        address: "",
      },
      states: [],
      cities: []
    }));
  };

  const save = () => {
    try {
      const tempId = useSelector(state => state.frontendAddress.temp).temp_id;
      setLoading({ isActive: true });
      
      dispatch(frontendAddressActions.save(address.form)).then((res) => {
        setModalVisible(false);
        setLoading({ isActive: false });
        alertService.successFlip(tempId === null ? 0 : 1, "Address");
        reset();
        activeAddress(res.data.data);
      }).catch((err) => {
        setLoading({ isActive: false });
        setErrors(err.response.data.errors);
      });
    } catch (err) {
      setLoading({ isActive: false });
      alertService.error(err);
    }
  };

  const edit = (address) => {
    if (Object.keys(selectedAddress).length > 0) {
      setModalVisible(true);
      setLoading({ isActive: true });
      
      dispatch(frontendAddressActions.edit(address.id)).then((res) => {
        setLoading({ isActive: false });
        
        // Mock data for states and cities
        const mockStates = [{ name: address.state }];
        const mockCities = address.city ? [{ name: address.city }] : [];
        
        setAddress(prev => ({
          ...prev,
          states: mockStates,
          cities: mockCities,
          form: {
            full_name: address.full_name,
            email: address.email,
            country_code: address.country_code,
            phone: address.phone,
            country: address.country,
            state: address.state || null,
            city: address.city || null,
            zip_code: address.zip_code,
            address: address.address,
          }
        }));
        
        dispatch(fetchCallingCode(address.country_code)).then(res => {
          setAddress(prev => ({ ...prev, flag: res.data.data.flag_emoji }));
          setLoading({ isActive: false });
        }).catch(() => setLoading({ isActive: false }));
      }).catch((err) => {
        alertService.error(err.response.data.message);
      });
    }
  };

  if (!show) return null;

  return (
    <View className="mb-6 rounded-2xl shadow-md bg-white">
      <LoadingComponent loading={loading} />
      
      <View className="flex flex-row items-center justify-between p-4 border-b border-gray-100">
        <Text className="font-bold capitalize text-lg">{title}</Text>
        <View className="flex flex-row items-center gap-4">
          {Object.keys(selectedAddress).length > 0 && (
            <TouchableOpacity 
              onPress={() => edit(selectedAddress)}
              className="px-3 h-8 rounded-full flex items-center gap-2 bg-green-50"
            >
              <Text className="text-green-600">✏️</Text>
              <Text className="text-sm font-medium capitalize text-green-600">Edit</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            onPress={() => setModalVisible(true)}
            className="px-3 h-8 rounded-full flex items-center gap-2 bg-orange-50"
          >
            <Text className="text-orange-500">➕</Text>
            <Text className="text-sm font-medium capitalize text-orange-500">Add New</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
        {addresses.map(address => (
          <TouchableOpacity
            key={address.id}
            onPress={() => activeAddress(address)}
            className={`p-4 rounded-lg border ${Object.keys(selectedAddress).length > 0 && address.id === selectedAddress.id ? 'border-orange-300 bg-orange-50' : 'border-gray-100 bg-gray-50'}`}
          >
            <Text className="text-base font-medium capitalize mb-1">{address.full_name}</Text>
            {address.phone && <Text className="text-sm">{address.country_code ?? ''} {address.phone},</Text>}
            {address.email && <Text className="text-sm">{address.email},</Text>}
            {address.state && <Text className="text-sm">{address.state},</Text>}
            {address.city && <Text className="text-sm">{address.city},</Text>}
            {address.country && <Text className="text-sm">{address.country},</Text>}
            {address.address && <Text className="text-sm">{address.address}{address.zip_code ? ',' : ''}</Text>}
            {address.zip_code && <Text className="text-sm">{address.zip_code}</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {/* Address Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="w-full bg-white rounded-xl max-w-3xl">
            <View className="flex flex-row items-center justify-between p-4 border-b border-gray-100">
              <Text className="text-lg font-bold capitalize">Address</Text>
              <Pressable onPress={reset}>
                <Text className="text-lg text-red-500">✕</Text>
              </Pressable>
            </View>
            
            <ScrollView className="p-5">
              <View className="mb-4">
                <Text className="text-sm font-medium mb-1">Full Name *</Text>
                <TextInput
                  value={address.form.full_name}
                  onChangeText={(text) => setAddress(prev => ({
                    ...prev,
                    form: { ...prev.form, full_name: text }
                  }))}
                  className="w-full h-12 px-4 rounded-lg border border-gray-200"
                />
                {errors.full_name && <Text className="text-red-500 text-xs">{errors.full_name[0]}</Text>}
              </View>
              
              <View className="mb-4">
                <Text className="text-sm font-medium mb-1">Email</Text>
                <TextInput
                  value={address.form.email}
                  onChangeText={(text) => setAddress(prev => ({
                    ...prev,
                    form: { ...prev.form, email: text }
                  }))}
                  keyboardType="email-address"
                  className="w-full h-12 px-4 rounded-lg border border-gray-200"
                />
                {errors.email && <Text className="text-red-500 text-xs">{errors.email[0]}</Text>}
              </View>
              
              <View className="mb-4">
                <Text className="text-sm font-medium mb-1">Phone *</Text>
                <View className="flex flex-row items-center border border-gray-200 rounded-lg">
                  <Picker
                    selectedValue={address.form.country_code}
                    onValueChange={(itemValue) => changeCountry(countryCodes.find(c => c.calling_code === itemValue))}
                    style={{ width: 100 }}
                  >
                    {countryCodes.map(code => (
                      <Picker.Item 
                        key={code.id} 
                        label={`${code.flag_emoji} ${code.calling_code}`} 
                        value={code.calling_code} 
                      />
                    ))}
                  </Picker>
                  <TextInput
                    value={address.form.phone}
                    onChangeText={(text) => setAddress(prev => ({
                      ...prev,
                      form: { ...prev.form, phone: text }
                    }))}
                    keyboardType="phone-pad"
                    className="flex-1 h-12 px-4"
                  />
                </View>
                {errors.phone && <Text className="text-red-500 text-xs">{errors.phone[0]}</Text>}
              </View>
              
              <View className="mb-4">
                <Text className="text-sm font-medium mb-1">Country *</Text>
                <Picker
                  selectedValue={address.form.country}
                  onValueChange={(itemValue) => {
                    setAddress(prev => ({
                      ...prev,
                      form: { ...prev.form, country: itemValue }
                    }));
                    callStates(itemValue);
                  }}
                  className="w-full h-12 border border-gray-200 rounded-lg"
                >
                  <Picker.Item label="Select Country" value={null} />
                  {address.countries.map(country => (
                    <Picker.Item key={country.name} label={country.name} value={country.name} />
                  ))}
                </Picker>
                {errors.country && <Text className="text-red-500 text-xs">{errors.country[0]}</Text>}
              </View>
              
              <View className="mb-4">
                <Text className="text-sm font-medium mb-1">State</Text>
                <Picker
                  selectedValue={address.form.state}
                  onValueChange={(itemValue) => {
                    setAddress(prev => ({
                      ...prev,
                      form: { ...prev.form, state: itemValue }
                    }));
                    callCities(itemValue);
                  }}
                  className="w-full h-12 border border-gray-200 rounded-lg"
                >
                  <Picker.Item label="Select State" value={null} />
                  {address.states.map(state => (
                    <Picker.Item key={state.name} label={state.name} value={state.name} />
                  ))}
                </Picker>
                {errors.state && <Text className="text-red-500 text-xs">{errors.state[0]}</Text>}
              </View>
              
              <View className="mb-4">
                <Text className="text-sm font-medium mb-1">City</Text>
                <Picker
                  selectedValue={address.form.city}
                  onValueChange={(itemValue) => setAddress(prev => ({
                    ...prev,
                    form: { ...prev.form, city: itemValue }
                  }))}
                  className="w-full h-12 border border-gray-200 rounded-lg"
                >
                  <Picker.Item label="Select City" value={null} />
                  {address.cities.map(city => (
                    <Picker.Item key={city.name} label={city.name} value={city.name} />
                  ))}
                </Picker>
                {errors.city && <Text className="text-red-500 text-xs">{errors.city[0]}</Text>}
              </View>
              
              <View className="mb-4">
                <Text className="text-sm font-medium mb-1">Zip Code</Text>
                <TextInput
                  value={address.form.zip_code}
                  onChangeText={(text) => setAddress(prev => ({
                    ...prev,
                    form: { ...prev.form, zip_code: text }
                  }))}
                  keyboardType="numeric"
                  className="w-full h-12 px-4 rounded-lg border border-gray-200"
                />
                {errors.zip_code && <Text className="text-red-500 text-xs">{errors.zip_code[0]}</Text>}
              </View>
              
              <View className="mb-4">
                <Text className="text-sm font-medium mb-1">Street Address *</Text>
                <TextInput
                  value={address.form.address}
                  onChangeText={(text) => setAddress(prev => ({
                    ...prev,
                    form: { ...prev.form, address: text }
                  }))}
                  multiline
                  className="w-full h-20 px-4 rounded-lg border border-gray-200"
                />
                {errors.address && <Text className="text-red-500 text-xs">{errors.address[0]}</Text>}
              </View>
              
              <View className="flex flex-row gap-6 mt-4">
                <TouchableOpacity 
                  onPress={save}
                  className="bg-blue-500 px-8 py-3 rounded-full"
                >
                  <Text className="text-white font-bold text-center">Save Address</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={reset}
                  className="bg-gray-100 px-8 py-3 rounded-full"
                >
                  <Text className="text-gray-800 font-bold text-center">Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddressComponent;