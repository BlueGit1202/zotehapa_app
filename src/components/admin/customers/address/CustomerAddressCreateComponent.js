import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Picker } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import worldMapData from 'city-state-country';
import LoadingComponent from '../../components/LoadingComponent';
import CountryCodePicker from '../../components/CountryCodePicker';
import { customerAddressActions } from "../../../../store/actions/customerAddressActions";


const CustomerAddressCreateComponent = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  
  const countryCodes = useSelector(state => state.countryCode.lists);
  const customerId = route.params?.id;

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    country_code: '+1',
    phone: '',
    country: '',
    state: '',
    city: '',
    zip_code: '',
    address: ''
  });

  useEffect(() => {
    // Load countries when component mounts
    const allCountries = worldMapData.getAllCountries();
    setCountries(allCountries);
    
    // Set default country code if available
    if (countryCodes.length > 0) {
      const defaultCode = countryCodes.find(code => code.is_default === 1);
      if (defaultCode) {
        setForm(prev => ({ 
          ...prev, 
          country_code: defaultCode.calling_code 
        }));
      }
    }
  }, [countryCodes]);

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (countryName) => {
    setSelectedCountry(countryName);
    handleChange('country', countryName);
    handleChange('state', '');
    handleChange('city', '');
    
    const countryStates = worldMapData.getAllStatesFromCountry(countryName);
    setStates(countryStates);
    setCities([]);
  };

  const handleStateChange = (stateName) => {
    setSelectedState(stateName);
    handleChange('state', stateName);
    handleChange('city', '');
    
    const stateCities = worldMapData.getAllCitiesFromState(stateName);
    setCities(stateCities);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await dispatch(customerAddressActions.save({
        id: customerId,
        form,
        search: route.params?.search
      }));
      
      navigation.goBack();
      alertService.success('Address saved successfully');
    } catch (error) {
      setErrors(error.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      full_name: '',
      email: '',
      country_code: '+1',
      phone: '',
      country: '',
      state: '',
      city: '',
      zip_code: '',
      address: ''
    });
    setSelectedCountry('');
    setSelectedState('');
    setStates([]);
    setCities([]);
    setErrors({});
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-4">{'Address'}</Text>
        
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1">{'Full name'} *</Text>
          <TextInput
            value={form.full_name}
            onChangeText={text => handleChange('full_name', text)}
            className={`border rounded p-2 ${errors.full_name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.full_name && <Text className="text-red-500 text-xs mt-1">{errors.full_name[0]}</Text>}
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium mb-1">{'Email'}</Text>
          <TextInput
            value={form.email}
            onChangeText={text => handleChange('email', text)}
            keyboardType="email-address"
            className={`border rounded p-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email[0]}</Text>}
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium mb-1">{'Phone'} *</Text>
          <CountryCodePicker
            value={form.country_code}
            onValueChange={code => handleChange('country_code', code)}
            countryCodes={countryCodes}
          />
          <TextInput
            value={form.phone}
            onChangeText={text => handleChange('phone', text)}
            keyboardType="phone-pad"
            className={`border rounded p-2 mt-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.phone && <Text className="text-red-500 text-xs mt-1">{errors.phone[0]}</Text>}
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium mb-1">{'Country'} *</Text>
          <View className="border rounded p-2 border-gray-300">
            <Picker
              selectedValue={selectedCountry}
              onValueChange={handleCountryChange}
            >
              <Picker.Item label={'Select country'} value="" />
              {countries.map(country => (
                <Picker.Item key={country.name} label={country.name} value={country.name} />
              ))}
            </Picker>
          </View>
          {errors.country && <Text className="text-red-500 text-xs mt-1">{errors.country[0]}</Text>}
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium mb-1">{'State'} *</Text>
          <View className="border rounded p-2 border-gray-300">
            <Picker
              selectedValue={selectedState}
              onValueChange={handleStateChange}
              enabled={states.length > 0}
            >
              <Picker.Item label={'Select state'} value="" />
              {states.map(state => (
                <Picker.Item key={state} label={state} value={state} />
              ))}
            </Picker>
          </View>
          {errors.state && <Text className="text-red-500 text-xs mt-1">{errors.state[0]}</Text>}
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium mb-1">{'City'} *</Text>
          <View className="border rounded p-2 border-gray-300">
            <Picker
              selectedValue={form.city}
              onValueChange={value => handleChange('city', value)}
              enabled={cities.length > 0}
            >
              <Picker.Item label={'Select city'} value="" />
              {cities.map(city => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>
          </View>
          {errors.city && <Text className="text-red-500 text-xs mt-1">{errors.city[0]}</Text>}
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium mb-1">{'Zip_code'}</Text>
          <TextInput
            value={form.zip_code}
            onChangeText={text => handleChange('zip_code', text)}
            className={`border rounded p-2 ${errors.zip_code ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.zip_code && <Text className="text-red-500 text-xs mt-1">{errors.zip_code[0]}</Text>}
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium mb-1">{'Street address'} *</Text>
          <TextInput
            value={form.address}
            onChangeText={text => handleChange('address', text)}
            multiline
            numberOfLines={3}
            className={`border rounded p-2 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.address && <Text className="text-red-500 text-xs mt-1">{errors.address[0]}</Text>}
        </View>

        <View className="flex-row justify-between mt-6">
          <TouchableOpacity 
            onPress={resetForm}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            <Text>{'Reset'}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleSubmit}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            <Text className="text-white">{'Save'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default CustomerAddressCreateComponent;