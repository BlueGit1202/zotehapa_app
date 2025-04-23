import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  StyleSheet,
  ActivityIndicator,
  Modal,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import alertService from '../../../../../services/alertService';
import { fetchCallingCode, fetchCountryCode, fetchCountryCodes } from "../../../../store/actions/frontend/frontendCountryCodeActions";
import { fetchSettings } from "../../../../store/actions/frontend/frontendSettingActions";
import { updateProfile } from "../../../../store/actions/frontend/frontendEditProfileActions";
import { updateAuthInfo, profile as authProfile } from "../../../../store/actions/authActions";

const AccountInfoComponent = () => {
  const dispatch = useDispatch();
  
  const profile = useSelector(state => state.auth.authInfo, shallowEqual);
  const countryCodes = useSelector(state => state.frontendCountryCode.lists, shallowEqual);
  
  const [loading, setLoading] = useState(false);
  const [localForm, setLocalForm] = useState({
    name: "",
    email: "",
    phone: "",
    country_code: ""
  });
  const [flag, setFlag] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [showCountryCodes, setShowCountryCodes] = useState(false);

  useEffect(() => {
    if (profile) {
      setLocalForm({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        country_code: profile.country_code || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        await dispatch(authProfile());
        await dispatch(fetchCountryCodes());
        
        if (profile?.country_code) {
          const res = await dispatch(fetchCallingCode(profile.country_code));
          setFlag(res.data.flag_emoji);
        } else {
          const companyRes = await dispatch(fetchSettings());
          const countryRes = await dispatch(fetchCountryCode(companyRes.data.data.company_country_code));
          setFlag(countryRes.data.flag_emoji);
          setLocalForm(prev => ({ ...prev, country_code: countryRes.data.calling_code }));
        }
      } catch (err) {
        alertService.error(err.message || 'Failed to initialize profile');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

const pickImage = useCallback(async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const image = result.assets[0];
      setImage(image);
      
      // Prepare for upload
      const uploadUri = image.uri;
      const filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
      const fileType = image.mimeType || 'image/jpeg';

      // Create the form data
      const formData = new FormData();
      formData.append('file', {
        uri: uploadUri,
        name: filename,
        type: fileType,
      });

      // Add any additional required headers
      const headers = {
        'Content-Type': 'multipart/form-data',
        'x-goog-content-length-range': '0,10485760' 
        // Add any other required headers for your cloud storage
        // For Google Cloud Storage, you might need:
        // 'x-goog-content-length-range': '0,10485760' // Example: 0-10MB
      };

      // Upload to your backend or directly to cloud storage
      const response = await fetch('YOUR_UPLOAD_ENDPOINT', {
        method: 'POST',
        body: formData,
        headers,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const responseData = await response.json();
      console.log('Upload successful:', responseData);
    }
  } catch (err) {
    console.error('Image picker/upload error:', err);
    alertService.error('Failed to process image');
  }
}, []);

  const changeCountryCode = useCallback((countryCode) => {
    setFlag(countryCode.flag_emoji);
    setLocalForm(prev => ({ ...prev, country_code: countryCode.calling_code }));
    setShowCountryCodes(false);
  }, []);

  const handleChange = useCallback((name, value) => {
    setLocalForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const save = useCallback(async () => {
    try {
      setLoading(true);
      setErrors({});
      
      const formData = new FormData();
      formData.append("name", localForm.name);
      formData.append("email", localForm.email);
      formData.append("phone", localForm.phone);
      formData.append("country_code", localForm.country_code);
      
      if (image?.uri) {
        // Extract file extension from URI
        const uriParts = image.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append("image", {
          uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
          type: `image/${fileType}`,
          name: `profile.${fileType}`,
        });
      }

      const res = await dispatch(updateProfile(formData));
      
      if (res?.data?.data) {
        await dispatch(updateAuthInfo(res.data.data));
        alertService.success("Profile updated successfully");
        setImage(null);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Save error:', err);
      
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alertService.error(err.message || 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, localForm, image]);

  const countryCodeModal = useMemo(() => (
    <Modal
      visible={showCountryCodes}
      transparent
      animationType="slide"
      onRequestClose={() => setShowCountryCodes(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            {countryCodes.map(countryCode => (
              <TouchableOpacity
                key={countryCode.id}
                style={styles.countryCodeItem}
                onPress={() => changeCountryCode(countryCode)}
              >
                <Text style={styles.flagText}>{countryCode.flag_emoji}</Text>
                <Text style={styles.countryCodeItemText}>{countryCode.calling_code}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => setShowCountryCodes(false)}
          >
            <Text style={styles.closeModalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  ), [showCountryCodes, countryCodes, changeCountryCode]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4B6FED" />
        </View>
      )}
      
      <Text style={styles.title}>Account Information</Text>
      
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Personal Info</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name (required)</Text>
          <TextInput
            value={localForm.name}
            onChangeText={(text) => handleChange('name', text)}
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Enter your full name"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name[0]}</Text>}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email (required)</Text>
          <TextInput
            value={localForm.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Enter your email"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email[0]}</Text>}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone (required)</Text>
          <View style={[styles.phoneInputContainer, errors.phone && styles.inputError]}>
            <TouchableOpacity 
              style={styles.countryCodeButton}
              onPress={() => setShowCountryCodes(true)}
            >
              <Text style={styles.flagText}>{flag}</Text>
              <Text style={styles.countryCodeText}>{localForm.country_code}</Text>
            </TouchableOpacity>
            <TextInput
              value={localForm.phone}
              onChangeText={(text) => handleChange('phone', text)}
              keyboardType="phone-pad"
              style={styles.phoneInput}
              placeholder="Enter phone number"
            />
          </View>
          
          {countryCodeModal}
          
          {errors.phone && <Text style={styles.errorText}>{errors.phone[0]}</Text>}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Profile Picture</Text>
          <TouchableOpacity
            onPress={pickImage}
            style={[styles.imagePickerButton, errors.image && styles.inputError]}
          >
            <Text style={styles.imagePickerText}>
              {image ? 'Image selected' : 'Select an image'}
            </Text>
          </TouchableOpacity>
          {image?.uri && (
            <Image 
              source={{ uri: image.uri }} 
              style={styles.selectedImage}
            />
          )}
          {errors.image && <Text style={styles.errorText}>{errors.image[0]}</Text>}
        </View>
      </View>
      
      <TouchableOpacity
        onPress={save}
        style={styles.submitButton}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
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
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    overflow: 'hidden',
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#d1d5db',
  },
  flagText: {
    marginRight: 4,
  },
  countryCodeText: {
    fontSize: 12,
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 8,
    maxHeight: '60%',
  },
  countryCodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  countryCodeItemText: {
    fontSize: 14,
    marginLeft: 8,
  },
  closeModalButton: {
    padding: 16,
    backgroundColor: '#3b82f6',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imagePickerButton: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  imagePickerText: {
    fontSize: 16,
    color: '#6b7280',
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginBottom: 24,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default React.memo(AccountInfoComponent);