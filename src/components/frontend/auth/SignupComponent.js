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
  Alert,
  Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { 
  signupValidation, 
  signup, 
  otpPhone, 
  otpEmail,
  resetSignup
} from '../../../store/actions/frontend/frontendSignupActions';
import Site_Logo from "../../../../assets/logo.png"

const { width } = Dimensions.get('window');

const SignupComponent = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { lists } = useSelector(state => state.frontendSetting);
  const { loading, verificationRequired, verificationType } = useSelector(state => state.frontendSignup);
  const countryCodes = useSelector(state => state.frontendCountryCode.lists);

  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country_code: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [toggleValue, setToggleValue] = useState(false);
  const [inputLabel, setInputLabel] = useState('Email');
  const [inputButton, setInputButton] = useState('Use phone instead');
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    if (lists?.company_country_code && countryCodes?.length > 0) {
      const defaultCountry = countryCodes.find(
        country => country.id === lists.company_country_code
      );
      if (defaultCountry) {
        setSelectedCountry(defaultCountry);
        setForm(prev => ({
          ...prev,
          country_code: defaultCountry.calling_code
        }));
      }
    }

    return () => {
      dispatch(resetSignup());
    };
  }, [lists, countryCodes]);

  useEffect(() => {
    if (verificationRequired) {
      navigation.navigate('SignupVerify', { 
        verificationType,
        formData: form 
      });
    }
  }, [verificationRequired, verificationType]);

  const handleSignup = async () => {
    try {
      setErrors({});
      await dispatch(signupValidation(form));
      
      if (lists.site_phone_verification === 1 && form.phone) {
        await dispatch(otpPhone(form));
      } else if (lists.site_email_verification === 1 && form.email) {
        await dispatch(otpEmail(form));
      } else {
        await dispatch(signup(form));
        navigation.navigate('Login');
      }
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
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

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setForm(prev => ({
      ...prev,
      country_code: country.calling_code
    }));
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
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>Join our community today</Text>
          
          {errors.validation && (
            <View style={styles.errorAlert}>
              <Text style={styles.errorText}>{errors.validation}</Text>
            </View>
          )}

          {/* Name Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              placeholder="Enter your full name"
              autoCapitalize="words"
            />
            {errors.name && <Text style={styles.errorMessage}>{errors.name[0]}</Text>}
          </View>

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
                <TouchableOpacity 
                  style={styles.countryCodeButton}
                  onPress={() => navigation.navigate('CountryCode', {
                    countryCodes,
                    onSelect: handleCountrySelect
                  })}
                >
                  <Text style={styles.countryCodeText}>
                    {selectedCountry?.flag_emoji} {selectedCountry?.calling_code}
                  </Text>
                </TouchableOpacity>
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
              placeholder="Create password"
              secureTextEntry
            />
            {errors.password && <Text style={styles.errorMessage}>{errors.password[0]}</Text>}
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#4B6FED" />
            ) : (
              <Text style={styles.submitButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
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
  submitButton: {
    backgroundColor: '#4B6FED',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 15,
    color: '#64748b',
  },
  loginLink: {
    fontSize: 15,
    color: '#4B6FED',
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default SignupComponent;