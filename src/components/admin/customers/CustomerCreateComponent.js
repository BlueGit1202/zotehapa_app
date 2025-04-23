import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import LoadingComponent from '../components/LoadingComponent';
import CountryCodePicker from '../components/CountryCodePicker';
import { customerActions } from '../../../store/actions/customerActions';
import alertService from '../../../../services/alertService';
import statusEnum from '../../../enums/modules/statusEnum';

const CustomerCreateComponent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    status: statusEnum.ACTIVE,
    country_code: '+1'
  });

  const countryCodes = useSelector(state => state.countryCode.lists);
  const { temp = {}, show = {} } = useSelector(state => state.customer);

  // Fetch customer data when component mounts (only for edit)
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        if (route.params?.id) {
          await dispatch(customerActions.show(route.params.id));
          dispatch(customerActions.edit(route.params.id));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [route.params?.id, dispatch]);

  // Update form when show data changes
  useEffect(() => {
    if (temp.isEditing && show) {
      setForm({
        name: show.name || '',
        email: show.email || '',
        phone: show.phone || '',
        password: '', // Always empty for security
        password_confirmation: '', // Always empty for security
        status: show.status || statusEnum.ACTIVE,
        country_code: show.country_code || '+1'
      });
      setIsEditing(true);
    }
  }, [show, temp.isEditing]);

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrors({}); // Clear previous errors
      
      const payload = {
        form: { ...form },
        search: { paginate: 0, order_column: "id", order_type: "desc" }
      };

      await dispatch(customerActions.save(payload));
      
      alertService.success(
        isEditing 
          ? 'Customer updated successfully' 
          : 'Customer created successfully'
      );
      navigation.goBack();
    } catch (error) {
      console.log("Error details:", error.response?.data);
      setErrors(error.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    if (isEditing) {
      // Reset to original values when editing
      setForm({
        name: show.name || '',
        email: show.email || '',
        phone: show.phone || '',
        password: '',
        password_confirmation: '',
        status: show.status || statusEnum.ACTIVE,
        country_code: show.country_code || '+1'
      });
    } else {
      setForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        status: statusEnum.ACTIVE,
        country_code: '+1'
      });
    }
    setErrors({});
  };

  if (loading && !show) {
    return <LoadingComponent />;
  }

  return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {isEditing ? 'Edit customer' : 'Create customer'}
        </Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{'Name'} *</Text>
          <TextInput
            value={form.name}
            onChangeText={text => handleChange('name', text)}
            style={[styles.input, errors.name && styles.inputError]}
            placeholder={'Enter name'}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name[0]}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{'Email'} *</Text>
          <TextInput
            value={form.email}
            onChangeText={text => handleChange('email', text)}
            keyboardType="email-address"
            style={[styles.input, errors.email && styles.inputError]}
            placeholder={'Enter email'}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email[0]}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{'Phone'}</Text>
          <CountryCodePicker
            value={form.country_code}
            onValueChange={code => handleChange('country_code', code)}
            countryCodes={countryCodes}
          />
          <TextInput
            value={form.phone}
            onChangeText={text => handleChange('phone', text)}
            keyboardType="phone-pad"
            style={[styles.input, styles.phoneInput, errors.phone && styles.inputError]}
            placeholder={'Enter phone'}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone[0]}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{'Status'} *</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity 
              style={[styles.radioOption, form.status === statusEnum.ACTIVE && styles.radioOptionActive]}
              onPress={() => handleChange('status', statusEnum.ACTIVE)}
            >
              <View style={styles.radioOuter}>
                {form.status === statusEnum.ACTIVE && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text>{'Active'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.radioOption, form.status === statusEnum.INACTIVE && styles.radioOptionActive]}
              onPress={() => handleChange('status', statusEnum.INACTIVE)}
            >
              <View style={styles.radioOuter}>
                {form.status === statusEnum.INACTIVE && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text>{'Inactive'}</Text>
            </TouchableOpacity>
          </View>
          {errors.status && <Text style={styles.errorText}>{errors.status[0]}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{'Password'} {!isEditing && '*'}</Text>
          <TextInput
            value={form.password}
            onChangeText={text => handleChange('password', text)}
            secureTextEntry
            style={[styles.input, errors.password && styles.inputError]}
            placeholder={isEditing ? 'Leave blank' : 'Enter password'}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password[0]}</Text>}
        </View>


          <View style={styles.inputContainer}>
            <Text style={styles.label}>{'Confirm password'} *</Text>
            <TextInput
              value={form.password_confirmation}
              onChangeText={text => handleChange('password_confirmation', text)}
              secureTextEntry
              style={[styles.input, errors.password_confirmation && styles.inputError]}
              placeholder={'Confirm password'}
            />
            {errors.password_confirmation && (
              <Text style={styles.errorText}>{errors.password_confirmation[0]}</Text>
            )}
          </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            onPress={resetForm}
            style={styles.resetButton}
          >
            <Text>{'Reset'}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleSubmit}
            style={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#4B6FED" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isEditing ? 'Update' : 'Save'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  contentContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
  },
  phoneInput: {
    marginTop: 8,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  radioGroup: {
    flexDirection: 'row',
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    padding: 8,
    borderRadius: 4,
  },
  radioOptionActive: {
    backgroundColor: '#eff6ff',
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9ca3af',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  resetButton: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1,
  },
  submitButtonText: {
    color: '#fff',
  },
});

export default CustomerCreateComponent;