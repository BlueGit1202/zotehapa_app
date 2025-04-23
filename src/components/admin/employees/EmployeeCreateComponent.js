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
import { employeeActions } from '../../../store/actions/employeeActions';
import LoadingComponent from '../components/LoadingComponent';
import CountryCodePicker from '../components/countrycode/CountryCodePicker';
import alertService from '../../../../services/alertService';

const EmployeeCreateComponent = ({ onEmployeeAdded, onCancel }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { show } = useSelector(state => state.employee);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    status: 5,
    role_id: 3,
    country_code: '+1'
  });

  // Check if we're editing an existing employee
  useEffect(() => {
    if (route.params?.employee) {
      const { employee } = route.params;
      dispatch(employeeActions.edit(employee.id))
      setForm({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        password: '',
        password_confirmation: '',
        status: employee.status || 5,
        role_id: employee.role_id || 3,
        country_code: employee.country_code || '+1'
      });
      setIsEditing(true);
    }
  }, [route.params?.employee]);

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrors({});
      
      const payload = { 
        form: { ...form },
        search: { paginate: 0, order_column: "id", order_type: "desc" }
      };

        await dispatch(employeeActions.save(payload));
        
      if (onEmployeeAdded) {
        onEmployeeAdded();
      } else {
        navigation.goBack();
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    if (isEditing && route.params?.employee) {
      const { employee } = route.params;
      setForm({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        password: '',
        password_confirmation: '',
        status: employee.status || 5,
        role_id: employee.role_id || 3,
        country_code: employee.country_code || '+1'
      });
    } else {
      setForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        status: 5,
        role_id: 3,
        country_code: '+1'
      });
    }
    setErrors({});
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          {isEditing ? 'Edit Employee' : 'Add Employee'}
        </Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            value={form.name}
            onChangeText={text => handleChange('name', text)}
            style={[styles.input, errors.name && styles.inputError]}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name[0]}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            value={form.email}
            onChangeText={text => handleChange('email', text)}
            keyboardType="email-address"
            style={[styles.input, errors.email && styles.inputError]}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email[0]}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone</Text>
          <CountryCodePicker
            value={form.country_code}
            onValueChange={code => handleChange('country_code', code)}
          />
          <TextInput
            value={form.phone}
            onChangeText={text => handleChange('phone', text)}
            keyboardType="phone-pad"
            style={[styles.input, styles.phoneInput, errors.phone && styles.inputError]}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone[0]}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Status *</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity 
              style={[styles.radioOption, form.status === 5 && styles.radioOptionActive]}
              onPress={() => handleChange('status', 5)}
            >
              <View style={[styles.radioOuter, form.status === 5 && styles.radioOuterActive]}>
                {form.status === 5 && <View style={styles.radioInner} />}
              </View>
              <Text>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.radioOption, form.status === 10 && styles.radioOptionActive]}
              onPress={() => handleChange('status', 10)}
            >
              <View style={[styles.radioOuter, form.status === 10 && styles.radioOuterActive]}>
                {form.status === 10 && <View style={styles.radioInner} />}
              </View>
              <Text>Inactive</Text>
            </TouchableOpacity>
          </View>
          {errors.status && <Text style={styles.errorText}>{errors.status[0]}</Text>}
        </View>

        {!isEditing && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password *</Text>
              <TextInput
                value={form.password}
                onChangeText={text => handleChange('password', text)}
                secureTextEntry
                style={[styles.input, errors.password && styles.inputError]}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password[0]}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password *</Text>
              <TextInput
                value={form.password_confirmation}
                onChangeText={text => handleChange('password_confirmation', text)}
                secureTextEntry
                style={[styles.input, errors.password_confirmation && styles.inputError]}
              />
              {errors.password_confirmation && (
                <Text style={styles.errorText}>{errors.password_confirmation[0]}</Text>
              )}
            </View>
          </>
        )}

        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            onPress={onCancel || (() => navigation.goBack())}
            style={styles.cancelButton}
          >
            <Text>Cancel</Text>
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
    </ScrollView>
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
  radioOuterActive: {
    borderColor: '#3b82f6',
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
  cancelButton: {
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

export default EmployeeCreateComponent;