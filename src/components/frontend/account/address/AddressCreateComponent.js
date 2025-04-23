import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { frontendAddressActions } from '../../../../store/actions/frontend/frontendAddressActions';
import alertService from '../../../../../services/alertService';

const AddressCreateComponent = ({
  visible,
  onClose,
  address,
  countries = [],
  states = [],
  cities = [],
  flag = '🇺🇸',
  callingCode = '+1',
  onCountryChange,
  onStateChange,
  onSuccess
}) => {
  const dispatch = useDispatch();
  const { temp = {}, loading = false } = useSelector(
    state => ({
      temp: state.frontendAddress.temp || {},
      loading: state.frontendAddress.loading || false
    }),
    shallowEqual
  );
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    country_code: callingCode,
    phone: '',
    country: '',
    state: '',
    city: '',
    zip_code: '',
    address: '',
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (address) {
      setFormData({
        full_name: address.full_name || '',
        email: address.email || '',
        country_code: address.country_code || callingCode,
        phone: address.phone || '',
        country: address.country || '',
        state: address.state || '',
        city: address.city || '',
        zip_code: address.zip_code || '',
        address: address.address || '',
      });
    } else {
      setFormData(prev => ({
        ...prev,
        country_code: callingCode
      }));
    }
  }, [address, callingCode]);

  const handleSubmit = async () => {
    try {
      // Basic validation
      if (!formData.full_name || !formData.phone || !formData.address) {
        alertService.error('Please fill in all required fields');
        return;
      }

      const payload = {
        form: formData,
        search: { paginate: 0, order_column: "id", order_type: "asc" }
      };
      
      await dispatch(frontendAddressActions.save(payload));
      alertService.success(temp.isEditing ? 'Address updated successfully' : 'Address added successfully');
      onSuccess();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alertService.error(error.message || 'Failed to save address');
      }
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {temp.isEditing ? 'Edit Address' : 'Add New Address'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer}>
          {/* Full Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={[styles.input, errors.full_name && styles.inputError]}
              value={formData.full_name}
              onChangeText={(text) => handleChange('full_name', text)}
              placeholder="Enter full name"
            />
            {errors.full_name && (
              <Text style={styles.errorText}>{errors.full_name[0]}</Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              placeholder="Enter email"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email[0]}</Text>
            )}
          </View>

          {/* Phone */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone *</Text>
            <View style={[styles.phoneInputContainer, errors.phone && styles.inputError]}>
              <View style={styles.phonePrefix}>
                <Text style={styles.flag}>{flag}</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                value={formData.phone}
                onChangeText={(text) => handleChange('phone', text)}
                keyboardType="phone-pad"
                placeholder="Enter phone number"
              />
            </View>
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone[0]}</Text>
            )}
          </View>

          {/* Country */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Country *</Text>
            <View style={[styles.pickerContainer, errors.country && styles.inputError]}>
              <Picker
                selectedValue={formData.country}
                onValueChange={(value) => {
                  handleChange('country', value);
                  onCountryChange(value);
                  handleChange('state', '');
                  handleChange('city', '');
                }}
              >
                <Picker.Item label="Select Country" value="" />
                {countries.map((country) => (
                  <Picker.Item 
                    key={country.name} 
                    label={country.name} 
                    value={country.name} 
                  />
                ))}
              </Picker>
            </View>
            {errors.country && (
              <Text style={styles.errorText}>{errors.country[0]}</Text>
            )}
          </View>

          {/* State */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>State</Text>
            <View style={[styles.pickerContainer, errors.state && styles.inputError]}>
              <Picker
                selectedValue={formData.state}
                onValueChange={(value) => {
                  handleChange('state', value);
                  onStateChange(value);
                  handleChange('city', '');
                }}
                enabled={!!formData.country && states.length > 0}
              >
                <Picker.Item label={states.length ? "Select State" : "No states available"} value="" />
                {states.map((state) => (
                  <Picker.Item 
                    key={state.name} 
                    label={state.name} 
                    value={state.name} 
                  />
                ))}
              </Picker>
            </View>
            {errors.state && (
              <Text style={styles.errorText}>{errors.state[0]}</Text>
            )}
          </View>

          {/* City */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>City</Text>
            <View style={[styles.pickerContainer, errors.city && styles.inputError]}>
              <Picker
                selectedValue={formData.city}
                onValueChange={(value) => handleChange('city', value)}
                enabled={!!formData.state && cities.length > 0}
              >
                <Picker.Item label={cities.length ? "Select City" : "No cities available"} value="" />
                {cities.map((city) => (
                  <Picker.Item 
                    key={city.name} 
                    label={city.name} 
                    value={city.name} 
                  />
                ))}
              </Picker>
            </View>
            {errors.city && (
              <Text style={styles.errorText}>{errors.city[0]}</Text>
            )}
          </View>

          {/* Zip Code */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Zip Code</Text>
            <TextInput
              style={[styles.input, errors.zip_code && styles.inputError]}
              value={formData.zip_code}
              onChangeText={(text) => handleChange('zip_code', text)}
              placeholder="Enter zip code"
              keyboardType="numeric"
            />
            {errors.zip_code && (
              <Text style={styles.errorText}>{errors.zip_code[0]}</Text>
            )}
          </View>

          {/* Address */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Street Address *</Text>
            <TextInput
              style={[styles.input, errors.address && styles.inputError]}
              value={formData.address}
              onChangeText={(text) => handleChange('address', text)}
              placeholder="Enter street address"
              multiline
              numberOfLines={3}
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address[0]}</Text>
            )}
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#4B6FED" />
              ) : (
                <Text style={styles.buttonText}>
                  {temp.isEditing ? 'Update Address' : 'Add Address'}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    fontSize: 20,
    color: '#ef4444',
    padding: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    fontSize: 14,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  phonePrefix: {
    paddingHorizontal: 12,
  },
  flag: {
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 14,
  },
  pickerContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#374151',
  },
});

export default AddressCreateComponent;