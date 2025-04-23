import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { showProduct, uploadImage, deleteImage, shippingAndReturn, productOffer } from '../../../store/actions/productActions';
import LoadingComponent from '../components/LoadingComponent';
import ProductVariationListComponent from './variation/ProductVariationListComponent';
import ProductSeoComponent from './seo/ProductSeoComponent';
import ProductVideoListComponent from './video/ProductVideoListComponent';
import statusEnum from "../../../enums/modules/statusEnum";
import askEnum from "../../../enums/modules/askEnum";
import activityEnum from "../../../enums/modules/activityEnum";
import shippingTypeEnum from "../../../enums/modules/shippingTypeEnum";


const ProductShowComponent = ({ route }) => {
  const dispatch = useDispatch();
  const { productId } = route.params;
  const [activeTab, setActiveTab] = useState('information');
  const [deleteIndex, setDeleteIndex] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const [livePreview, setLivePreview] = useState(null);
  
  const [form, setForm] = useState({
    add_to_flash_sale: "",
    discount: "1.5",
    offer_start_date: new Date(),
    offer_end_date: new Date(),
  });
  
  const [shippingAndReturnForm, setShippingAndReturnForm] = useState({
    shipping_type: shippingTypeEnum.FREE,
    shipping_cost: 0,
    is_product_quantity_multiply: askEnum.NO,
    shipping_and_return: "",
  });
  
  const { loading, product } = useSelector(state => state.product);
  
  useEffect(() => {
    dispatch(showProduct(productId));
  }, [dispatch, productId]);
  
  useEffect(() => {
    if (product) {
      setLivePreview(product.image);
      setImageCount(product.images.length);
      setShippingAndReturnForm({
        shipping_type: product.shipping_type,
        shipping_cost: product.shipping_cost,
        is_product_quantity_multiply: product.is_product_quantity_multiply,
        shipping_and_return: product.shipping_and_return,
      });
      setForm({
        add_to_flash_sale: product.add_to_flash_sale,
        discount: product.discount_percentage,
        offer_start_date: product.offer_start_date ? new Date(product.offer_start_date) : new Date(),
        offer_end_date: product.offer_end_date ? new Date(product.offer_end_date) : new Date(),
      });
    }
  }, [product]);
  
  const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.cancelled) {
    // Get file info to determine size
    const fileInfo = await FileSystem.getInfoAsync(result.uri);
    
    const formData = new FormData();
    formData.append('image', {
      uri: result.uri,
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    // Add headers
    const headers = {
      'Content-Type': 'multipart/form-data',
      'x-goog-content-length-range': '0,10485760' ,
      'Content-Length': fileInfo.size.toString(),
    };

    dispatch(uploadImage({
      id: productId,
      form: formData,
      headers: headers  // Pass headers to your upload function
    }));
  }
};
  
  const handleDeleteImage = () => {
    dispatch(deleteImage({
      id: productId,
      index: deleteIndex
    }));
  };
  
  const handleSaveShippingAndReturn = () => {
    dispatch(shippingAndReturn({
      id: productId,
      form: shippingAndReturnForm
    }));
  };
  
  const handleSaveOffer = () => {
    dispatch(productOffer({
      id: productId,
      form: form
    }));
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'information':
        return (
          <View className="p-4">
            <View className="space-y-4">
              <View className="flex-row justify-between">
                <Text className="font-medium">Name</Text>
                <Text>{product?.name}</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="font-medium">SKU</Text>
                <Text>{product?.sku}</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="font-medium">Category</Text>
                <Text>{product?.category}</Text>
              </View>
              
              {/* Add all other information fields similarly */}
            </View>
          </View>
        );
        
      case 'image':
        return (
          <View className="p-4">
            <View className="flex-row">
              <ScrollView horizontal className="mr-4">
                {product?.images?.map((image, index) => (
                  <TouchableOpacity 
                    key={index} 
                    onPress={() => {
                      setLivePreview(image);
                      setDeleteIndex(index);
                    }}
                    className="mr-2"
                  >
                    <Image 
                      source={{ uri: image }} 
                      className="w-20 h-20 rounded"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <TouchableOpacity onPress={pickImage}>
                <View className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                  <Text>+</Text>
                </View>
              </TouchableOpacity>
            </View>
            
            {livePreview && (
              <View className="mt-4">
                <Image 
                  source={{ uri: livePreview }} 
                  className="w-full h-64 rounded"
                />
                {imageCount > 0 && (
                  <TouchableOpacity 
                    onPress={handleDeleteImage}
                    className="absolute top-0 right-0 bg-white p-2 rounded-full"
                  >
                    <Text>X</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        );
        
      case 'variations':
        return <ProductVariationListComponent productId={productId} />;
        
      case 'offer':
        return (
          <View className="p-4">
            <View className="space-y-4">
              <View>
                <Text className="font-medium">Offer Start Date</Text>
                <DateTimePicker
                  value={form.offer_start_date}
                  onChange={(event, date) => setForm({...form, offer_start_date: date})}
                />
              </View>
              
              <View>
                <Text className="font-medium">Offer End Date</Text>
                <DateTimePicker
                  value={form.offer_end_date}
                  onChange={(event, date) => setForm({...form, offer_end_date: date})}
                />
              </View>
              
              <View>
                <Text className="font-medium">Discount Percentage</Text>
                <TextInput
                  className="border border-gray-300 rounded p-2"
                  value={form.discount}
                  onChangeText={(text) => setForm({...form, discount: text})}
                  keyboardType="numeric"
                />
              </View>
              
              <View>
                <Text className="font-medium">Add to Flash Sale</Text>
                <View className="flex-row space-x-4">
                  <TouchableOpacity 
                    className="flex-row items-center"
                    onPress={() => setForm({...form, add_to_flash_sale: askEnum.YES})}
                  >
                    <View className={`w-4 h-4 rounded-full border ${form.add_to_flash_sale === askEnum.YES ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}></View>
                    <Text className="ml-2">Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="flex-row items-center"
                    onPress={() => setForm({...form, add_to_flash_sale: askEnum.NO})}
                  >
                    <View className={`w-4 h-4 rounded-full border ${form.add_to_flash_sale === askEnum.NO ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}></View>
                    <Text className="ml-2">No</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity 
                className="bg-blue-500 px-4 py-2 rounded"
                onPress={handleSaveOffer}
              >
                <Text className="text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
        
      case 'video':
        return <ProductVideoListComponent productId={productId} />;
        
      case 'shippingReturn':
        return (
          <View className="p-4">
            <View className="space-y-4">
              <View>
                <Text className="font-medium">Shipping Type</Text>
                <View className="flex-row space-x-4">
                  <TouchableOpacity 
                    className="flex-row items-center"
                    onPress={() => setShippingAndReturnForm({...shippingAndReturnForm, shipping_type: shippingTypeEnum.FREE})}
                  >
                    <View className={`w-4 h-4 rounded-full border ${shippingAndReturnForm.shipping_type === shippingTypeEnum.FREE ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}></View>
                    <Text className="ml-2">Free</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="flex-row items-center"
                    onPress={() => setShippingAndReturnForm({...shippingAndReturnForm, shipping_type: shippingTypeEnum.FLAT_RATE})}
                  >
                    <View className={`w-4 h-4 rounded-full border ${shippingAndReturnForm.shipping_type === shippingTypeEnum.FLAT_RATE ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}></View>
                    <Text className="ml-2">Flat Rate</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {shippingAndReturnForm.shipping_type === shippingTypeEnum.FLAT_RATE && (
                <View>
                  <Text className="font-medium">Shipping Cost</Text>
                  <TextInput
                    className="border border-gray-300 rounded p-2"
                    value={shippingAndReturnForm.shipping_cost.toString()}
                    onChangeText={(text) => setShippingAndReturnForm({...shippingAndReturnForm, shipping_cost: parseFloat(text) || 0})}
                    keyboardType="numeric"
                  />
                  
                  <Text className="font-medium mt-2">Is Product Quantity Multiply</Text>
                  <View className="flex-row space-x-4">
                    <TouchableOpacity 
                      className="flex-row items-center"
                      onPress={() => setShippingAndReturnForm({...shippingAndReturnForm, is_product_quantity_multiply: askEnum.YES})}
                    >
                      <View className={`w-4 h-4 rounded-full border ${shippingAndReturnForm.is_product_quantity_multiply === askEnum.YES ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}></View>
                      <Text className="ml-2">Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      className="flex-row items-center"
                      onPress={() => setShippingAndReturnForm({...shippingAndReturnForm, is_product_quantity_multiply: askEnum.NO})}
                    >
                      <View className={`w-4 h-4 rounded-full border ${shippingAndReturnForm.is_product_quantity_multiply === askEnum.NO ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}></View>
                      <Text className="ml-2">No</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              
              <View>
                <Text className="font-medium">Shipping and Return</Text>
                <TextInput
                  className="border border-gray-300 rounded p-2 h-32"
                  value={shippingAndReturnForm.shipping_and_return}
                  onChangeText={(text) => setShippingAndReturnForm({...shippingAndReturnForm, shipping_and_return: text})}
                  multiline
                />
              </View>
              
              <TouchableOpacity 
                className="bg-blue-500 px-4 py-2 rounded"
                onPress={handleSaveShippingAndReturn}
              >
                <Text className="text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
        
      case 'seo':
        return <ProductSeoComponent productId={productId} />;
        
      default:
        return null;
    }
  };
  
  return (
    <View className="flex-1">
      {loading && <LoadingComponent />}
      
      <ScrollView horizontal className="border-b border-gray-200">
        <View className="flex-row">
          <TouchableOpacity 
            className={`px-4 py-2 ${activeTab === 'information' ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => setActiveTab('information')}
          >
            <Text>Information</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`px-4 py-2 ${activeTab === 'image' ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => setActiveTab('image')}
          >
            <Text>Images</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`px-4 py-2 ${activeTab === 'variations' ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => setActiveTab('variations')}
          >
            <Text>Variations</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`px-4 py-2 ${activeTab === 'offer' ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => setActiveTab('offer')}
          >
            <Text>Offer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`px-4 py-2 ${activeTab === 'video' ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => setActiveTab('video')}
          >
            <Text>Video</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`px-4 py-2 ${activeTab === 'shippingReturn' ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => setActiveTab('shippingReturn')}
          >
            <Text>Shipping & Return</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`px-4 py-2 ${activeTab === 'seo' ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => setActiveTab('seo')}
          >
            <Text>SEO</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <ScrollView className="flex-1">
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

export default ProductShowComponent;