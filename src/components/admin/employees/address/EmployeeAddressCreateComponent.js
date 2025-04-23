import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Modal,
  StyleSheet 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import worldMapData from 'city-state-country';
import LoadingComponent from '../../components/LoadingComponent';
import { employeeAddressActions } from '../../../../store/actions/employeeAddressActions';
import { fetchCountryCodeDetails, fetchCountryCodes } from '../../../../store/actions/countryCodeActions';
import { companyActions } from '../../../../store/actions/companyActions';
import alertService from '../../../../../services/alertService';

const EmployeeAddressCreate = (route) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const countryCodes = useSelector(state => state.countryCode.lists);
  const employeeId = route.employeeId;

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
  const allCountries = worldMapData.getAllCountries();
  console.log("countries",allCountries)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await dispatch(fetchCountryCodes());
        
        const companyRes = await dispatch(companyActions.lists());
        const countryCodeRes = await dispatch(fetchCountryCodeDetails(
          companyRes.data.data.company_country_code
        ));
        
        const defaultCode = countryCodeRes.data.data;
        setForm(prev => ({
          ...prev,
          country_code: defaultCode.calling_code
        }));
        
        const allCountries = worldMapData.getAllCountries();
        console.log("allCountries:", allCountries);
        setCountries(allCountries);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
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

  const resetForm = () => {
    setForm({
      full_name: '',
      email: '',
      country_code: form.country_code,
      phone: '',
      country: '',
      state: '',
      city: '',
      zip_code: '',
      address: ''
    });
    setSelectedCountry(null);
    setSelectedState(null);
    setStates([]);
    setCities([]);
    setErrors({});
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await dispatch(employeeAddressActions.save({
        id: employeeId,
        form,
        search: route.search
      }));
      
      resetForm();
      alertService.success('Address saved successfully');
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
    <View style={styles.container}>
      {/* Add Address Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>{'Add address'}</Text>
      </TouchableOpacity>

      {/* Address Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={resetForm}
      >
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{'Address'}</Text>
            <TouchableOpacity onPress={resetForm}>
              <Icon name="times" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{'Full name'} *</Text>
            <TextInput
              value={form.full_name}
              onChangeText={text => handleChange('full_name', text)}
              style={[styles.input, errors.full_name && styles.inputError]}
            />
            {errors.full_name && <Text style={styles.errorText}>{errors.full_name[0]}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{'email'}</Text>
            <TextInput
              value={form.email}
              onChangeText={text => handleChange('email', text)}
              keyboardType="email-address"
              style={[styles.input, errors.email && styles.inputError]}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email[0]}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{'phone'} *</Text>
            <View style={[styles.phoneInputContainer, errors.phone && styles.inputError]}>
              <Picker
                selectedValue={form.country_code}
                onValueChange={code => handleChange('country_code', code)}
                style={styles.countryCodePicker}
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
                value={form.phone}
                onChangeText={text => handleChange('phone', text)}
                keyboardType="phone-pad"
                style={styles.phoneInput}
              />
            </View>
            {errors.phone && <Text style={styles.errorText}>{errors.phone[0]}</Text>}
          </View>

          {/* Country Picker */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{'Country'} *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCountry}
                onValueChange={handleCountryChange}
              >
                <Picker.Item label={'Select_country'} value={null} />
                {countries.map(country => (
                  <Picker.Item key={country.name} label={country.name} value={country.name} />
                ))}
              </Picker>
            </View>
            {errors.country && <Text style={styles.errorText}>{errors.country[0]}</Text>}
          </View>

          {/* State Picker */}
          {states.length > 0 && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{'State'}</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedState}
                  onValueChange={handleStateChange}
                >
                  <Picker.Item label={'Select state'} value={null} />
                  {states.map(state => (
                    <Picker.Item key={state} label={state} value={state} />
                  ))}
                </Picker>
              </View>
              {errors.state && <Text style={styles.errorText}>{errors.state[0]}</Text>}
            </View>
          )}

          {/* City Picker */}
          {cities.length > 0 && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{'City'}</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={form.city}
                  onValueChange={value => handleChange('city', value)}
                >
                  <Picker.Item label={'Select city'} value="" />
                  {cities.map(city => (
                    <Picker.Item key={city} label={city} value={city} />
                  ))}
                </Picker>
              </View>
              {errors.city && <Text style={styles.errorText}>{errors.city[0]}</Text>}
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{'Zip_code'}</Text>
            <TextInput
              value={form.zip_code}
              onChangeText={text => handleChange('zip_code', text)}
              keyboardType="numeric"
              style={[styles.input, errors.zip_code && styles.inputError]}
            />
            {errors.zip_code && <Text style={styles.errorText}>{errors.zip_code[0]}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{'Street address'} *</Text>
            <TextInput
              value={form.address}
              onChangeText={text => handleChange('address', text)}
              multiline
              numberOfLines={3}
              style={[styles.textArea, errors.address && styles.inputError]}
            />
            {errors.address && <Text style={styles.errorText}>{errors.address[0]}</Text>}
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              onPress={resetForm}
              style={styles.closeButton}
            >
              <Text>{'Close'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleSubmit}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>{'Save'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 4,
    margin: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
    height: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    padding: 1,
  },
  countryCodePicker: {
    width: 100,
  },
  phoneInput: {
    flex: 1,
    marginLeft: 8,
    padding: 10,
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  closeButton: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
});

export default EmployeeAddressCreate;