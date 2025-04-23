import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useDispatch } from 'react-redux';
import alertService from '../../../../../services/alertService';
import { changePassword as changePsd } from '../../../../store/actions/frontend/frontendEditProfileActions';

const ChangePasswordComponent = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});

  const changePassword = async () => {
    try {
      setLoading(true);
      await dispatch(changePsd(form));
      
      setLoading(false);
      alertService.successFlip(1, "Password");
      setForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      setErrors({});
    } catch (err) {
      setLoading(false);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alertService.error(err.message);
      }
    }
  };

  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Change Password</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Current Password (required)</Text>
          <TextInput
            secureTextEntry
            value={form.old_password}
            onChangeText={(text) => handleChange('old_password', text)}
            style={[styles.input, errors.old_password && styles.inputError]}
          />
          {errors.old_password && (
            <Text style={styles.errorText}>{errors.old_password[0]}</Text>
          )}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password (required)</Text>
          <TextInput
            secureTextEntry
            value={form.new_password}
            onChangeText={(text) => handleChange('new_password', text)}
            style={[styles.input, errors.new_password && styles.inputError]}
          />
          {errors.new_password && (
            <Text style={styles.errorText}>{errors.new_password[0]}</Text>
          )}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm New Password (required)</Text>
          <TextInput
            secureTextEntry
            value={form.confirm_password}
            onChangeText={(text) => handleChange('confirm_password', text)}
            style={[styles.input, errors.confirm_password && styles.inputError]}
          />
          {errors.confirm_password && (
            <Text style={styles.errorText}>{errors.confirm_password[0]}</Text>
          )}
        </View>
      </View>
      
      <TouchableOpacity
        onPress={changePassword}
        style={styles.submitButton}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#4B6FED" />
        ) : (
          <Text style={styles.submitButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 28,
  },
  formContainer: {
    padding: 24,
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  inputGroup: {
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
    backgroundColor: '#f9fafb',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChangePasswordComponent;