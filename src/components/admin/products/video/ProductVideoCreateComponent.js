import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNPickerSelect from 'react-native-picker-select';
import videoProviderEnum from "../../../../enums//modules/videoProviderEnum"
import { save } from '../../../../store/actions/productVideoActions';

const ProductVideoCreate = ({ productId }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    video_provider: null,
    link: '',
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const videoProviders = [
    { label: 'YouTube', value: videoProviderEnum.YOUTUBE },
    { label: 'Vimeo', value: videoProviderEnum.VIMEO },
    // Add other providers as needed
  ];

  const handleCreateClick = () => {
    setShowModal(true);
  };

  const handleReset = () => {
    setShowModal(false);
    setForm({
      video_provider: null,
      link: '',
    });
    setErrors({});
  };

  const handleSave = () => {
    setLoading(true);
    dispatch(save({ 
      productId,
      form: {
        video_provider: form.video_provider,
        link: form.link
      }
    }))
      .then(() => {
        Alert.alert('Success', 'Video saved successfully');
        handleReset();
      })
      .catch(err => {
        setErrors(err.response?.data?.errors || {});
      })
      .finally(() => setLoading(false));
  };

  return (
    <View style={styles.container}>
      {/* Add Video Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleCreateClick}
      >
        <Icon name="plus" size={20} color="white" />
        <Text style={styles.addButtonText}>Add Video</Text>
      </TouchableOpacity>

      {/* Video Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={false}
        onRequestClose={handleReset}
      >
        <ScrollView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Product Video</Text>
            <TouchableOpacity onPress={handleReset}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Loading Indicator */}
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#4B6FED" />
            </View>
          )}

          {/* Form Content */}
          <View style={styles.formContainer}>
            {/* Video Provider */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Video Provider*</Text>
              <View style={styles.pickerContainer}>
                <RNPickerSelect
                  onValueChange={(value) => setForm({...form, video_provider: value})}
                  items={videoProviders}
                  value={form.video_provider}
                  placeholder={{ label: 'Select provider...', value: null }}
                  style={pickerSelectStyles}
                />
              </View>
              {errors.video_provider && (
                <Text style={styles.errorText}>{errors.video_provider[0]}</Text>
              )}
            </View>

            {/* Video Link */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Link*</Text>
              <TextInput
                style={[styles.input, styles.textArea, errors.link && styles.inputError]}
                value={form.link}
                onChangeText={(text) => setForm({...form, link: text})}
                placeholder="Enter video link"
                multiline
                numberOfLines={4}
              />
              {errors.link && (
                <Text style={styles.errorText}>{errors.link[0]}</Text>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={handleReset}
              >
                <Icon name="close-circle" size={20} color="#008BBA" />
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
                disabled={loading}
              >
                <Icon name="content-save" size={20} color="white" />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#008BBA',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#008BBA',
  },
  cancelButtonText: {
    color: '#008BBA',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#008BBA',
  },
  saveButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProductVideoCreate;