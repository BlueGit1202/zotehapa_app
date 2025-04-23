import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator  // Add ActivityIndicator for the loading spinner
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LoadingComponent from '../components/LoadingComponent';
import { changePassword } from '../../../store/actions/frontend/frontendEditProfileActions';
import BreadcrumbComponent from '../components/BreadcrumbComponent';
import alertService from "../../../../services/alertService";
import { FadeOutLeft } from 'react-native-reanimated';

const ProfileChangePasswordComponent = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChangePassword = () => {
    setIsLoading(true);
    dispatch(changePassword(form))
      .then(() => {
        setIsLoading(false);
        alertService.success('Password updated successfully');
        setForm({
          old_password: '',
          new_password: '',
          confirm_password: ''
        });
        setErrors({});
      })
      .catch(err => {
        setErrors(err.response?.data?.errors || {});
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <BreadcrumbComponent />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Change Password</Text>

          {/* Input fields remain the same */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Old Password*</Text>
            <TextInput
              style={[styles.input, errors.old_password && styles.inputError]}
              secureTextEntry
              value={form.old_password}
              onChangeText={text => setForm({ ...form, old_password: text })}
            />
            {errors.old_password && (
              <Text style={styles.errorText}>{errors.old_password[0]}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password*</Text>
            <TextInput
              style={[styles.input, errors.new_password && styles.inputError]}
              secureTextEntry
              value={form.new_password}
              onChangeText={text => setForm({ ...form, new_password: text })}
            />
            {errors.new_password && (
              <Text style={styles.errorText}>{errors.new_password[0]}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password*</Text>
            <TextInput
              style={[styles.input, errors.confirm_password && styles.inputError]}
              secureTextEntry
              value={form.confirm_password}
              onChangeText={text => setForm({ ...form, confirm_password: text })}
            />
            {errors.confirm_password && (
              <Text style={styles.errorText}>{errors.confirm_password[0]}</Text>
            )}
          </View>

          {/* Updated Button with Loading State */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleChangePassword}
            disabled={isLoading}  // Disable button while loading
          >
            {isLoading ? (
               <ActivityIndicator color="#4B6FED" />
            ) : (
              <Text style={styles.buttonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
};

// Keep your existing styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  headerContainer: {
    padding: 16,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1f2937',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#ffffff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProfileChangePasswordComponent;