import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  ActivityIndicator,
  StyleSheet,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { resetPassword } from '../../../store/actions/authActions';

const ResetPasswordComponent = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { phone, email } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    password: '',
    password_confirmation: '',
    email: '',
    phone: '',
    country_code: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (phone?.otp?.phone) {
      setForm({
        ...form,
        phone: phone.otp.phone,
        country_code: phone.otp.country_code,
      });
    } else if (email?.otp?.email) {
      setForm({
        ...form,
        email: email.otp.email,
      });
    } else {
      navigation.navigate('Login');
    }
  }, [phone, email]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrors({});
      await dispatch(resetPassword(form));
      Alert.alert('Success', 'Password reset successfully');
      navigation.navigate('Home');
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Image 
          source={{ uri: 'https://example.com/images/auth.jpg' }} 
          style={styles.authImage} 
        />
        
        <View style={styles.formContainer}>
          <Text style={styles.title}>Reset Password</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>New Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
              placeholder="New password"
              secureTextEntry
            />
            {errors.password && (
              <Text style={styles.errorMessage}>{errors.password[0]}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={[styles.input, errors.password_confirmation && styles.inputError]}
              value={form.password_confirmation}
              onChangeText={(text) => setForm({ ...form, password_confirmation: text })}
              placeholder="Confirm password"
              secureTextEntry
            />
            {errors.password_confirmation && (
              <Text style={styles.errorMessage}>{errors.password_confirmation[0]}</Text>
            )}
          </View>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#4B6FED" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// Use similar styles as previous components
const styles = StyleSheet.create({
  // ... (same styles as LoginComponent)
});

export default ResetPasswordComponent;