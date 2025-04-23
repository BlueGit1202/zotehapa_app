import React, { useState } from 'react';
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
import { forgotPassword } from '../actions/authActions';

const ForgotPasswordComponent = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    phone: '',
    country_code: '',
  });
  const [errors, setErrors] = useState({});
  const [toggleValue, setToggleValue] = useState(false);
  const [inputLabel, setInputLabel] = useState('Email');
  const [inputButton, setInputButton] = useState('Use phone instead');

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrors({});
      await dispatch(forgotPassword(form));
      Alert.alert('Success', 'OTP sent successfully');
      navigation.navigate('ForgotPasswordVerify');
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };

  const handleFieldToggle = () => {
    setToggleValue(!toggleValue);
    if (!toggleValue) {
      setInputLabel('Phone');
      setInputButton('Use email instead');
      setForm({ ...form, email: '' });
    } else {
      setInputLabel('Email');
      setInputButton('Use phone instead');
      setForm({ ...form, phone: '' });
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
          <Text style={styles.title}>Forgot Password</Text>
          
          {errors.validation && (
            <View style={styles.errorAlert}>
              <Text style={styles.errorText}>{errors.validation}</Text>
              <TouchableOpacity onPress={() => setErrors({})}>
                <Text style={styles.closeError}>×</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>{inputLabel}</Text>
              <TouchableOpacity onPress={handleFieldToggle}>
                <Text style={styles.toggleButton}>{inputButton}</Text>
              </TouchableOpacity>
            </View>
            
            {toggleValue ? (
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCodeContainer}>
                  <Text style={styles.flag}>🇺🇸</Text>
                  <Text style={styles.countryCode}>+1</Text>
                </View>
                <TextInput
                  style={[styles.input, errors.phone && styles.inputError]}
                  value={form.phone}
                  onChangeText={(text) => setForm({ ...form, phone: text })}
                  placeholder="Phone number"
                  keyboardType="phone-pad"
                />
              </View>
            ) : (
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
                placeholder="Email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
            
            {errors.email_or_phone ? (
              <Text style={styles.errorMessage}>{errors.email_or_phone}</Text>
            ) : (
              <>
                {errors.phone && toggleValue && (
                  <Text style={styles.errorMessage}>{errors.phone[0]}</Text>
                )}
                {errors.email && !toggleValue && (
                  <Text style={styles.errorMessage}>{errors.email[0]}</Text>
                )}
              </>
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
              <Text style={styles.submitButtonText}>Get OTP</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.backButtonText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ... (same styles as LoginComponent with minor adjustments)
  backButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: '#4B6FED',
    fontWeight: 'bold',
  },
});

export default ForgotPasswordComponent;