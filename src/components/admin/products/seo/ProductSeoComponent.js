import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import Chip from '../../components/Chip';
import { lists, save } from '../../../../store/actions/productSeoActions';

const ProductSeoComponent = ({ route }) => {
  const { productId } = route.params;
  const dispatch = useDispatch();
  const { seo, loading } = useSelector(state => state.products);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    meta_keyword: []
  });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(lists(productId))
      .then(res => {
        const data = res.payload;
        setForm({
          title: data.title || '',
          description: data.description || '',
        });
        setTags(data.meta_keyword ? JSON.parse(data.meta_keyword) : []);
        setPreview(data.thumb ? { uri: data.thumb } : null);
      });
  }, [productId]);

const handleImagePick = async () => {
  try {
    // Launch image library
    const response = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,  // Reduce quality for smaller file size
      selectionLimit: 1,  // Only allow selecting one image
    });

    // Check response
    if (response.didCancel) {
      console.log('User cancelled image picker');
      return;
    }

    if (response.errorCode) {
      console.error('ImagePicker Error: ', response.errorMessage);
      Alert.alert('Error', 'Failed to pick image: ' + response.errorMessage);
      return;
    }

    if (!response.assets || response.assets.length === 0) {
      console.error('No assets found');
      return;
    }

    const selectedImage = response.assets[0];
    setImage(selectedImage);
    setPreview({ uri: selectedImage.uri });

    // Optional: Upload to server
    await uploadImageToServer(selectedImage);
    
  } catch (error) {
    console.error('Image picker error:', error);
    Alert.alert('Error', 'Failed to pick image');
  }
};

// Optional upload function
const uploadImageToServer = async (image) => {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      type: image.type || 'image/jpeg',  // Fallback to jpeg if type not available
      name: image.fileName || `image-${Date.now()}.jpg`,
    });

    const response = await fetch('YOUR_UPLOAD_ENDPOINT', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer YOUR_TOKEN',  // If needed
      },
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    console.log('Upload success:', result);
    return result;
    
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('product_id', productId);
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('meta_keyword', JSON.stringify(tags));
    
    if (image) {
      formData.append('image', {
        uri: image.uri,
        type: image.type,
        name: image.fileName || 'image.jpg'
      });
    }

    dispatch(save({ form: formData, productId }))
      .then(() => {
        Alert.alert('Success', 'SEO settings saved successfully');
        setErrors({});
      })
      .catch(err => {
        setErrors(err.response?.data?.errors || {});
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B6FED" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SEO Settings</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Title */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title*</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            value={form.title}
            onChangeText={text => setForm({...form, title: text})}
            placeholder="Enter SEO title"
          />
          {errors.title && <Text style={styles.errorText}>{errors.title[0]}</Text>}
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description*</Text>
          <RichEditor
            style={[styles.editor, errors.description && styles.editorError]}
            initialContentHTML={form.description}
            onChange={html => setForm({...form, description: html})}
          />
          <RichToolbar editor={richText => richText} />
          {errors.description && <Text style={styles.errorText}>{errors.description[0]}</Text>}
        </View>

        {/* Meta Keywords */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Meta Keywords*</Text>
          <View style={styles.tagContainer}>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={[styles.tagInput, errors.meta_keyword && styles.inputError]}
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={addTag}
                placeholder="Add keywords"
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
                <Icon name="plus" size={20} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <Chip 
                  key={index} 
                  text={tag} 
                  onRemove={() => removeTag(index)} 
                />
              ))}
            </View>
          </View>
          {errors.meta_keyword && <Text style={styles.errorText}>{errors.meta_keyword[0]}</Text>}
        </View>

        {/* Image */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Image</Text>
          <TouchableOpacity 
            style={styles.imagePicker} 
            onPress={handleImagePick}
          >
            <Text style={styles.imagePickerText}>Choose Image</Text>
          </TouchableOpacity>
          
          {preview && (
            <Image 
              source={preview} 
              style={styles.imagePreview} 
              resizeMode="contain"
            />
          )}
          {errors.image && <Text style={styles.errorText}>{errors.image[0]}</Text>}
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSubmit}
        >
          <Icon name="content-save" size={20} color="white" />
          <Text style={styles.saveButtonText}>Save SEO Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  editor: {
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: 'white',
  },
  editorError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
  tagContainer: {
    marginTop: 8,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  addTagButton: {
    width: 40,
    height: 40,
    backgroundColor: '#008BBA',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  imagePicker: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  imagePickerText: {
    color: '#666',
  },
  imagePreview: {
    width: 120,
    height: 120,
    marginTop: 8,
    borderRadius: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    backgroundColor: '#008BBA',
    borderRadius: 4,
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default ProductSeoComponent;