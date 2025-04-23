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
  Alert,
  Dimensions
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { login } from '../../../store/actions/authActions';
import Site_Logo from "../../../../assets/logo.png"

const { width } = Dimensions.get('window');

const LoginComponent = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    phone: '',
    country_code: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [toggleValue, setToggleValue] = useState(false);
  const [inputLabel, setInputLabel] = useState('Email');
  const [inputButton, setInputButton] = useState('Use phone instead');

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrors({});
      await dispatch(login(form));
      navigation.navigate('Home');
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
      Alert.alert('Error', 'Login failed. Please check your credentials and try again.');
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
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image 
            source={Site_Logo} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
          
          {errors.validation && (
            <View style={styles.errorAlert}>
              <Text style={styles.errorText}>{errors.validation}</Text>
            </View>
          )}

          {/* Email/Phone Field */}
          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <Text style={styles.inputLabel}>{inputLabel}</Text>
              <TouchableOpacity onPress={handleFieldToggle}>
                <Text style={styles.toggleButton}>{inputButton}</Text>
              </TouchableOpacity>
            </View>
            
            {toggleValue ? (
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCodeButton}>
                  <Text style={styles.countryCodeText}>🇺🇸 +1</Text>
                </View>
                <TextInput
                  style={[styles.phoneInput, errors.phone && styles.inputError]}
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
            
            {errors.email_or_phone && <Text style={styles.errorMessage}>{errors.email_or_phone}</Text>}
            {errors.phone && toggleValue && <Text style={styles.errorMessage}>{errors.phone[0]}</Text>}
            {errors.email && !toggleValue && <Text style={styles.errorMessage}>{errors.email[0]}</Text>}
          </View>

          {/* Password Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
              placeholder="Enter your password"
              secureTextEntry
            />
            {errors.password && <Text style={styles.errorMessage}>{errors.password[0]}</Text>}
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.rememberContainer}>
            <TouchableOpacity style={styles.checkboxContainer}>
              <View style={styles.checkbox} />
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#4B6FED" />
            ) : (
              <Text style={styles.submitButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Footer */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  logoContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.25,
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 32,
  },
  errorAlert: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
  toggleButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B6FED',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorMessage: {
    color: '#ef4444',
    fontSize: 13,
    marginTop: 8,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },
  countryCodeButton: {
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  countryCodeText: {
    fontSize: 16,
    color: '#334155',
  },
  phoneInput: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginRight: 8,
  },
  rememberText: {
    fontSize: 14,
    color: '#475569',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#4B6FED',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4B6FED',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#4B6FED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 15,
    color: '#64748b',
  },
  signupLink: {
    fontSize: 15,
    color: '#4B6FED',
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default LoginComponent;