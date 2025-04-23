// components/ProductReviewComponent.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  ScrollView, 
  ActivityIndicator,
  StyleSheet,
  Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { 
  saveProductReview, 
  fetchProductReview, 
  uploadReviewImage, 
  deleteReviewImage 
} from '../../../../store/actions/frontend/frontendProductReviewActions';
import { fetchProductDetails } from '../../../../store/actions/frontend/frontendProductActions';

const ProductReviewComponent = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { show: review, temp } = useSelector(state => state.frontendProductReview);
  const product = useSelector(state => state.frontendProduct.show);
  
  const [loading, setLoading] = useState(false);
  const [activeRate, setActiveRate] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [images, setImages] = useState(Array(5).fill(null));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (route.params?.slug) {
      loadProduct();
    }
    if (route.params?.id) {
      loadReview();
    }
  }, [route.params]);

  const loadProduct = () => {
    setLoading(true);
    dispatch(fetchProductDetails({ slug: route.params.slug }))
      .finally(() => setLoading(false));
  };

  const loadReview = () => {
    setLoading(true);
    dispatch(fetchProductReview(route.params.id))
      .then(res => {
        setActiveRate(res.star);
        setReviewText(res.review);
        const newImages = [...images];
        res.images.forEach((img, index) => {
          if (index < 5) newImages[index] = img;
        });
        setImages(newImages);
      })
      .finally(() => setLoading(false));
  };

 const handleImageUpload = async (index) => {
  try {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'We need camera roll permissions to upload images');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (pickerResult.canceled) return;

    const newImages = [...images];
    newImages[index] = pickerResult.assets[0].uri; // Note: Changed to assets[0].uri
    setImages(newImages);

    if (route.params?.id) {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', {
        uri: pickerResult.assets[0].uri,
        name: `image_${Date.now()}.jpg`,
        type: 'image/jpeg'
      });

      // Add proper headers
      const headers = {
        'Content-Type': 'multipart/form-data',
        'x-goog-content-length-range': '0,10485760' // 0-10MB range
      };

      dispatch(uploadReviewImage(route.params.id, formData, headers))
        .then(() => Alert.alert('Success', 'Image uploaded successfully'))
        .catch(err => {
          console.error('Upload error:', err);
          Alert.alert('Error', err.response?.data?.errors?.image?.[0] || 'Failed to upload image');
        })
        .finally(() => setLoading(false));
    }
  } catch (err) {
    console.error('Image picker error:', err);
    Alert.alert('Error', 'Failed to pick image');
  }
};

  const handleRemoveImage = (index) => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to remove this image?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          onPress: () => {
            const newImages = [...images];
            newImages[index] = null;
            setImages(newImages);

            if (route.params?.id) {
              setLoading(true);
              dispatch(deleteReviewImage(route.params.id, index))
                .then(() => Alert.alert('Success', 'Image removed successfully'))
                .catch(err => Alert.alert('Error', err.response?.data?.message || 'Failed to remove image'))
                .finally(() => setLoading(false));
            }
          }
        }
      ]
    );
  };

  const handleSubmit = () => {
    if (!reviewText) {
      setErrors({ review: ['Review details is required'] });
      return;
    }

    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append('star', activeRate);
    formData.append('review', reviewText);
    formData.append('product_id', product.id);

    images.forEach((image, index) => {
      if (image && typeof image === 'string' && !image.startsWith('http')) {
        formData.append('images[]', {
          uri: image,
          name: `image_${index}.jpg`,
          type: 'image/jpeg'
        });
      }
    });

    dispatch(saveProductReview({ form: formData }))
      .then(() => {
        Alert.alert('Success', 'Review submitted successfully');
        navigation.navigate('OrderHistory');
      })
      .catch(err => {
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors);
        } else {
          Alert.alert('Error', 'Failed to submit review');
        }
      })
      .finally(() => setLoading(false));
  };

  if (loading && (!product.id || (route.params?.id && !review.id))) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B6FED"/>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Write Review</Text>
      
      <View style={styles.card}>
        <View style={styles.productHeader}>
          <Image 
            source={{ uri: product.image }} 
            style={styles.productImage} 
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>
              {product.is_offer ? product.currency_price : product.old_currency_price}
            </Text>
          </View>
        </View>
        
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Review ({activeRate})</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map(rate => (
                <TouchableOpacity 
                  key={rate} 
                  onPress={() => setActiveRate(rate)}
                >
                  <Text style={[
                    styles.starIcon,
                    activeRate >= rate && styles.activeStar
                  ]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.star && (
              <Text style={styles.errorText}>{errors.star[0]}</Text>
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Review Details <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.reviewInput}
              multiline
              numberOfLines={4}
              value={reviewText}
              onChangeText={setReviewText}
              placeholder="Write your review here..."
            />
            {errors.review && (
              <Text style={styles.errorText}>{errors.review[0]}</Text>
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upload Images</Text>
            <View style={styles.imagesContainer}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageWrapper}>
                  {image && (
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <Text style={styles.removeIcon}>×</Text>
                    </TouchableOpacity>
                  )}
                  {image ? (
                    <Image 
                      source={{ uri: image }} 
                      style={styles.uploadedImage} 
                    />
                  ) : (
                    <TouchableOpacity 
                      style={styles.uploadButton}
                      onPress={() => handleImageUpload(index)}
                    >
                      <Text style={styles.uploadIcon}>+</Text>
                      <Text style={styles.uploadText}>Add Image</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4B6FED',
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  productPrice: {
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  required: {
    color: '#FB4E4E',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  starIcon: {
    fontSize: 32,
    color: '#D9DBE9',
  },
  activeStar: {
    color: '#F6A609',
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageWrapper: {
    position: 'relative',
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 1,
  },
  removeIcon: {
    fontSize: 14,
    color: '#FB4E4E',
  },
  uploadButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#EFF0F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 20,
    color: '#4B5563',
  },
  uploadText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  errorText: {
    color: '#FB4E4E',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#4B6FED',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default ProductReviewComponent;