import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Modal,
  StyleSheet
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { updateProfile } from '../../../store/actions/frontend/frontendEditProfileActions';
import { fetchCountryCodes, fetchCallingCode } from '../../../store/actions/countryCodeActions';
import { companyActions } from '../../../store/actions/companyActions';
import LoadingComponent from '../components/LoadingComponent';
import BreadcrumbComponent from '../components/BreadcrumbComponent';
import alertService from '../../../../services/alertService';

const ProfileEditProfileComponent = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.frontendEditProfile);
  const { user } = useSelector(state => state.auth);
  const { lists: countryCodes } = useSelector(state => state.countryCode);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country_code: ''
  });
  const [errors, setErrors] = useState({});
  const [selectedFlag, setSelectedFlag] = useState('');
  const [countryModalVisible, setCountryModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchCountryCodes());
    dispatch(companyActions.lists()).then(companyRes => {
      if (user.country_code === null) {
        dispatch(fetchCallingCode(companyRes.data.data.company_country_code))
          .then(res => {
            setSelectedFlag(res.data.data.flag_emoji);
            setForm(prev => ({
              ...prev,
              country_code: res.data.data.calling_code
            }));
          });
      }
    });

    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        country_code: user.country_code
      });
      
      if (user.country_code) {
        dispatch(fetchCallingCode(user.country_code))
          .then(res => {
            setSelectedFlag(res.data.data.flag_emoji);
          });
      }
    }
  }, [dispatch, user]);

  const handleSave = () => {
    dispatch(updateProfile(form))
      .then(() => {
        alertService.success('Profile updated successfully');
        setErrors({});
      })
      .catch(err => {
        setErrors(err.response?.data?.errors || {});
      });
  };

  const handleCountrySelect = (country) => {
    setSelectedFlag(country.flag_emoji);
    setForm({
      ...form,
      country_code: country.calling_code
    });
    setCountryModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <BreadcrumbComponent />
      </View>
      
      <LoadingComponent isActive={loading.isActive} />
      
      <View style={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Edit Profile</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name*</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={form.name}
              onChangeText={text => setForm({...form, name: text})}
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name[0]}</Text>
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email*</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              keyboardType="email-address"
              value={form.email}
              onChangeText={text => setForm({...form, email: text})}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email[0]}</Text>
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone*</Text>
            <View style={[styles.phoneInputContainer, errors.phone && styles.inputError]}>
              <TouchableOpacity 
                style={styles.countryCodeButton}
                onPress={() => setCountryModalVisible(true)}
              >
                <Text style={styles.flagText}>{selectedFlag}</Text>
                <Text>{form.country_code}</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.phoneInput}
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={text => setForm({...form, phone: text})}
              />
            </View>
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone[0]}</Text>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Country Code Modal */}
      <Modal
        visible={countryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
            </View>
            <ScrollView style={styles.modalScrollView}>
              {countryCodes.map(country => (
                <TouchableOpacity
                  key={country.id}
                  style={styles.countryItem}
                  onPress={() => handleCountrySelect(country)}
                >
                  <Text style={styles.flagText}>{country.flag_emoji}</Text>
                  <Text style={styles.countryCodeText}>{country.calling_code}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setCountryModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

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
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#d1d5db',
  },
  flagText: {
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: '80%',
    maxHeight: '75%',
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalScrollView: {
    maxHeight: 240,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  countryCodeText: {
    marginLeft: 12,
  },
  modalCancelButton: {
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#374151',
  },
});

export default ProfileEditProfileComponent;