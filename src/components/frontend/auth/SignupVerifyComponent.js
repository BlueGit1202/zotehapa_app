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
import { verifyPhone, verifyEmail, signupLoginVerify } from '../../../store/actions/authActions';
import { signup } from '../../../store/actions/frontend/frontendSignupActions';

const SignupVerifyComponent = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { phone, email, formData } = useSelector(state => state.frontendSignup);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    token: '',
    email: '',
    phone: '',
    country_code: '',
  });
  const [errors, setErrors] = useState('');
  
  console.log("signup verify component is called")

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
      navigation.navigate('Signup');
    }
  }, [phone, email]);

  const handleResendCode = async () => {
    try {
      setLoading(true);
      if (form.phone) {
        await dispatch(otpPhone(formData));
      } else {
        await dispatch(otpEmail(formData));
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
      
      // Complete the signup process
      await dispatch(signup(formData));
      
      // Automatically login the user
      await dispatch(signupLoginVerify(formData));
      
      navigation.navigate('Home');
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

// Use the same styles as ForgotPasswordVerifyComponent
const styles = StyleSheet.create({
  // ... (same styles as ForgotPasswordVerifyComponent)
});

export default SignupVerifyComponent;