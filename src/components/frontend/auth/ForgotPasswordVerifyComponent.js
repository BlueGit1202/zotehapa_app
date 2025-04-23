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
import { verifyPhone, verifyEmail, resetPassword } from '../../../store/actions/authActions';

const ForgotPasswordVerifyComponent = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { phone, email } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    token: '',
    email: '',
    phone: '',
    country_code: '',
  });
  const [errors, setErrors] = useState('');

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
      navigation.navigate('ForgotPassword');
    }
  }, [phone, email]);

  const handleResendCode = async () => {
    try {
      setLoading(true);
      if (form.phone) {
        await dispatch(forgotPassword({ 
          phone: form.phone, 
          country_code: form.country_code 
        }));
      } else {
        await dispatch(forgotPassword({ email: form.email }));
      }
      Alert.alert('Success', 'Verification code resent successfully');
    } catch (err) {
      setErrors(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      setErrors('');
      
      if (form.phone) {
        await dispatch(verifyPhone(form));
      } else {
        await dispatch(verifyEmail(form));
      }
      
      navigation.navigate('ResetPassword');
    } catch (err) {
      setErrors(err.response?.data?.message || 'Verification failed');
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
          <Text style={styles.title}>
            {form.phone ? 'Verify Phone Number' : 'Verify Email'}
          </Text>
          
          <Text style={styles.subtitle}>
            Enter the code sent to{' '}
            {form.phone ? 
              `${form.country_code}${form.phone}` : 
              form.email}
          </Text>

          {errors && (
            <View style={styles.errorAlert}>
              <Text style={styles.errorText}>{errors}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={form.token}
              onChangeText={(text) => setForm({ ...form, token: text })}
              placeholder="Enter verification code"
              keyboardType="number-pad"
            />
          </View>

          <TouchableOpacity 
            style={styles.resendButton}
            onPress={handleResendCode}
            disabled={loading}
          >
            <Text style={styles.resendText}>
              Didn't receive code?{' '}
              <Text style={styles.resendLink}>Resend</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#4B6FED" />
            ) : (
              <Text style={styles.submitButtonText}>Verify</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 16,
    overflow: 'hidden',
  },
  authImage: {
    width: '100%',
    height: 200,
  },
  formContainer: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B6FED',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorAlert: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D9DBE9',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  resendButton: {
    marginBottom: 24,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    color: '#4B6FED',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#4B6FED',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    alignItems: 'center',
  },
  backButtonText: {
    color: '#4B6FED',
    fontWeight: 'bold',
  },
});

export default ForgotPasswordVerifyComponent;