import axios from 'axios';
import { Alert } from 'react-native';

export const otpPhone = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'SIGNUP_REQUEST' });
    const response = await axios.post('auth/signup/otp-phone', payload);
    dispatch({ 
      type: 'OTP_PHONE_SUCCESS', 
      payload: response.data 
    });
    return response;
  } catch (error) {
    dispatch({
      type: 'SIGNUP_FAILURE',
      payload: error.response?.data?.message || 'Failed to send OTP to phone'
    });
    throw error;
  }
};

export const otpEmail = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'SIGNUP_REQUEST' });
    const response = await axios.post('auth/signup/otp-email', payload);
    dispatch({ 
      type: 'OTP_EMAIL_SUCCESS', 
      payload: response.data 
    });
    return response;
  } catch (error) {
    dispatch({
      type: 'SIGNUP_FAILURE',
      payload: error.response?.data?.message || 'Failed to send OTP to email'
    });
    throw error;
  }
};

export const signupValidation = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'SIGNUP_REQUEST' });
    const response = await axios.post('auth/signup/register-validation', payload);
    dispatch({ 
      type: 'SIGNUP_VALIDATION_SUCCESS', 
      payload 
    });
    return response;
  } catch (error) {
    dispatch({
      type: 'SIGNUP_FAILURE',
      payload: error.response?.data?.errors || error.response?.data?.message || 'Validation failed'
    });
    throw error;
  }
};

export const signup = (payload) => async (dispatch) => {
  try {
    dispatch({ type: 'SIGNUP_REQUEST' });
    const response = await axios.post('auth/signup/register', payload);
    dispatch({ type: 'SIGNUP_SUCCESS' });
    Alert.alert('Success', 'Account created successfully!');
    return response;
  } catch (error) {
    dispatch({
      type: 'SIGNUP_FAILURE',
      payload: error.response?.data?.errors || error.response?.data?.message || 'Registration failed'
    });
    throw error;
  }
};

export const resetSignup = () => (dispatch) => {
  dispatch({ type: 'RESET_SIGNUP' });
};