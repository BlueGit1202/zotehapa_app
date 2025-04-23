import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  TextInput,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import StarRating from 'react-native-star-rating';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { currencyFormat } from '../components/currencyFormat';
import { fetchProductDetails, fetchRelatedProducts, loadMoreReviews, resetProductDetails } from '../../../store/actions/frontend/frontendProductActions';
import VariationSelector from '../../VariationSelector';
import ProductList from '../components/ProductListComponent';
import CategoryBreadcrumb from "../components/CategoryBreadcrumbComponent";

const { width } = Dimensions.get('window');

const ProductDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { slug } = route.params;
  
  const {
    show: product,
    showImages: images = [],
    showReviews: reviews = [],
    showVideos: videos = [],
    relatedProducts = [],
    loading,
  } = useSelector((state) => state.frontendProduct) || {};
  
  const setting = useSelector((state) => state.frontendSetting.lists) || {};
  const categories = useSelector((state) => state.frontendProductCategory.ancestorsAndSelf) || [];
  const initialVariations = useSelector((state) => state.frontendProductVariation.initialVariation) || [];
  
  const [temp, setTemp] = useState({
    name: '',
    image: '',
    isVariation: false,
    variationId: null,
    productId: 0,
    sku: null,
    stock: 0,
    taxes: {},
    shipping: {},
    quantity: 1,
    discount: 0,
    price: 0,
    oldPrice: 0,
    totalPrice: 0,
  });
  
  const [activeTab, setActiveTab] = useState('details');
  const [mainSwiperIndex, setMainSwiperIndex] = useState(0);
  const mainSwiperRef = useRef(null);
  const [enableAddToCardButton, setEnableAddToCardButton] = useState(true);
  const [selectedVariation, setSelectedVariation] = useState(null);

  useEffect(() => {
    dispatch(fetchProductDetails(slug));
    dispatch(fetchRelatedProducts(slug));
    
    return () => {
      dispatch(resetProductDetails());
    };
  }, [slug, dispatch]);
  
  useEffect(() => {
    if (product?.id) {
      const initProduct = {
        name: product.name || '',
        image: product.cover || '',
        isVariation: false,
        variationId: null,
        productId: product.id,
        sku: product.sku || '',
        stock: product.stock || 0,
        taxes: product.taxes || {},
        shipping: product.shipping || {},
        quantity: 1,
        discount: product.discount || 0,
        price: product.price || 0,
        oldPrice: product.old_price || 0,
        totalPrice: product.price || 0,
      };
      
      setTemp(initProduct);
      
      if (!initialVariations.length && product.stock > 0) {
        setEnableAddToCardButton(false);
      }
    }
  }, [product, initialVariations]);

  const handleVariationSelect = (variation) => {
    if (!variation) return;
    
    setEnableAddToCardButton(true);
    setSelectedVariation(variation);
    
    const updatedTemp = {
      ...temp,
      isVariation: true,
      variationId: variation.id,
      sku: variation.sku || '',
      stock: variation.stock || 0,
      quantity: 1,
      discount: variation.discount || 0,
      price: variation.price || 0,
      oldPrice: variation.old_price || 0,
      totalPrice: variation.price || 0,
    };
    
    setTemp(updatedTemp);
    
    if (variation.stock > 0) {
      setEnableAddToCardButton(false);
    }
  };
  
  const quantityIncrement = () => {
    if (temp.quantity < temp.stock) {
      const newQuantity = temp.quantity + 1;
      setTemp({
        ...temp,
        quantity: newQuantity,
        totalPrice: temp.price * newQuantity,
      });
    }
  };
  
  const quantityDecrement = () => {
    if (temp.quantity > 1) {
      const newQuantity = temp.quantity - 1;
      setTemp({
        ...temp,
        quantity: newQuantity,
        totalPrice: temp.price * newQuantity,
      });
    }
  };
  
  const handleQuantityChange = (value) => {
    let quantity = parseInt(value) || 1;
    
    if (quantity < 1) quantity = 1;
    if (quantity > temp.stock) quantity = temp.stock;
    
    setTemp({
      ...temp,
      quantity: quantity,
      totalPrice: temp.price * quantity,
    });
  };
  
  const addToCart = () => {
    // Add to cart implementation
  };
  
  const toggleWishlist = () => {
    // Wishlist implementation
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <Text style={styles.descriptionText}>
              {product?.details || 'No details available'}
            </Text>
          </View>
        );
      case 'videos':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Product Videos</Text>
            {videos.length > 0 ? (
              <FlatList
                data={videos}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.videoItem}>
                    {/* Video player would go here */}
                    <Text style={styles.videoLink}>{item.link}</Text>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.noContentText}>No videos available</Text>
            )}
          </View>
        );
      case 'reviews':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Product Reviews</Text>
            <View style={styles.ratingSummary}>
              <StarRating
                disabled={true}
                maxStars={5}
                rating={(product?.rating_star || 0) / (product?.rating_star_count || 1)}
                starSize={20}
                fullStarColor="#FFBC1F"
                emptyStarColor="#FFBC1F"
              />
              {product?.rating_star_count > 0 && (
                <Text style={styles.reviewCount}>
                  {product.rating_star_count} {product.rating_star_count > 1 ? 'reviews' : 'review'}
                </Text>
              )}
            </View>
            
            {reviews.length > 0 ? (
              <FlatList
                data={reviews}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.reviewItem}>
                    <Text style={styles.reviewerName}>{item.name}</Text>
                    <StarRating
                      disabled={true}
                      maxStars={5}
                      rating={item.star}
                      starSize={15}
                      fullStarColor="#FFBC1F"
                      emptyStarColor="#FFBC1F"
                    />
                    <Text style={styles.reviewText}>{item.review}</Text>
                    {item.images?.length > 0 && (
                      <FlatList
                        horizontal
                        data={item.images}
                        keyExtractor={(img, idx) => idx.toString()}
                        renderItem={({ item: img }) => (
                          <Image
                            source={{ uri: img }}
                            style={styles.reviewImage}
                          />
                        )}
                      />
                    )}
                  </View>
                )}
              />
            ) : (
              <Text style={styles.noContentText}>No reviews yet</Text>
            )}
            
            {product?.rating_star_count > reviews.length && (
              <TouchableOpacity
                onPress={() => dispatch(loadMoreReviews(slug, reviews.length + 3))}
                style={styles.loadMoreButton}
              >
                <Text style={styles.loadMoreText}>Read more</Text>
                <Ionicons name="chevron-down" size={16} color="#3B82F6" />
              </TouchableOpacity>
            )}
          </View>
        );
      case 'shipping':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Shipping & Return</Text>
            <Text style={styles.descriptionText}>
              {product?.shipping_and_return || 'No shipping information available'}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };
  
  const renderImageGallery = () => {
    if (images.length > 0) {
      return (
        <View style={styles.imageGalleryContainer}>
          <SwiperFlatList
            ref={mainSwiperRef}
            data={images}
            renderItem={({ item }) => (
              <View style={styles.mainImageContainer}>
                <Image
                  source={{ uri: item }}
                  style={styles.mainImage}
                  resizeMode="contain"
                />
              </View>
            )}
            onChangeIndex={({ index }) => setMainSwiperIndex(index)}
            showPagination
            paginationActiveColor="#3B82F6"
          />
          
          <View style={styles.thumbnailContainer}>
            <FlatList
              horizontal
              data={images}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    mainSwiperRef.current?.scrollToIndex({ index });
                    setMainSwiperIndex(index);
                  }}
                  style={[
                    styles.thumbnail,
                    mainSwiperIndex === index 
                      ? styles.thumbnailActive 
                      : styles.thumbnailInactive
                  ]}
                >
                  <Image
                    source={{ uri: item }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      );
    } else if (product?.cover) {
      return (
        <Image
          source={{ uri: product.cover }}
          style={styles.singleImage}
          resizeMode="contain"
        />
      );
    }
    return null;
  };

  if (loading || !product) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B6FED"/>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {/* Breadcrumb */}
          {categories.length > 0 && (
            <View style={styles.breadcrumbWrapper}>
              <CategoryBreadcrumb categories={categories} />
            </View>
          )}
          
          {/* Product Images and Basic Info */}
          <View style={styles.productWrapper}>
            {/* Image Gallery */}
            <View style={styles.imageWrapper}>
              {renderImageGallery()}
            </View>
            
            {/* Product Info */}
            <View style={styles.infoWrapper}>
              <Text style={styles.productTitle}>
                {product.name}
              </Text>
              
              <View style={styles.priceWrapper}>
                <Text style={styles.currentPrice}>
                  {currencyFormat(
                    temp.price,
                    setting.site_digit_after_decimal_point || 2,
                    setting.site_default_currency_symbol || '$',
                    setting.site_currency_position || 'left'
                  )}
                </Text>
                {product.is_offer && (
                  <Text style={styles.oldPrice}>
                    {currencyFormat(
                      temp.oldPrice,
                      setting.site_digit_after_decimal_point || 2,
                      setting.site_default_currency_symbol || '$',
                      setting.site_currency_position || 'left'
                    )}
                  </Text>
                )}
              </View>
              
              {/* Rating */}
              <View style={styles.ratingWrapper}>
                <StarRating
                  disabled={true}
                  maxStars={5}
                  rating={(product.rating_star || 0) / (product.rating_star_count || 1)}
                  starSize={16}
                  fullStarColor="#FFBC1F"
                  emptyStarColor="#FFBC1F"
                />
                {product.rating_star_count > 0 && (
                  <Text style={styles.ratingCount}>
                    {product.rating_star_count} {product.rating_star_count > 1 ? 'reviews' : 'review'}
                  </Text>
                )}
              </View>
              
              {/* Variations */}
              {initialVariations.length > 0 && (
                <View style={styles.variationWrapper}>
                  <VariationSelector 
                    variations={initialVariations}
                    onSelect={handleVariationSelect}
                  />
                </View>
              )}
              
              {/* Quantity Selector */}
              <View style={styles.quantityWrapper}>
                <Text style={styles.quantityLabel}>Quantity:</Text>
                <View style={styles.quantityControlsWrapper}>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      onPress={quantityDecrement}
                      disabled={temp.quantity === 1}
                      style={[styles.quantityButton, temp.quantity === 1 && styles.disabledButton]}
                    >
                      <Ionicons name="remove-circle-outline" size={24} color="#3B82F6" />
                    </TouchableOpacity>
                    
                    <TextInput
                      value={temp.quantity.toString()}
                      onChangeText={handleQuantityChange}
                      keyboardType="numeric"
                      style={styles.quantityInput}
                    />
                    
                    <TouchableOpacity
                      onPress={quantityIncrement}
                      disabled={temp.quantity === temp.stock}
                      style={[styles.quantityButton, temp.quantity === temp.stock && styles.disabledButton]}
                    >
                      <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.stockInfo}>
                    {temp.stock > 0 ? (
                      <Text style={styles.stockText}>
                        Available: <Text style={styles.stockNumber}>({temp.stock})</Text> {product.unit || 'items'}
                      </Text>
                    ) : (
                      <Text style={styles.outOfStock}>Out of Stock</Text>
                    )}
                  </View>
                </View>
              </View>
              
              {/* Total Price */}
              {temp.quantity > 1 && (
                <View style={styles.totalPriceWrapper}>
                  <Text style={styles.totalPriceLabel}>Total Price:</Text>
                  <Text style={styles.totalPriceValue}>
                    {currencyFormat(
                      temp.totalPrice,
                      setting.site_digit_after_decimal_point || 2,
                      setting.site_default_currency_symbol || '$',
                      setting.site_currency_position || 'left'
                    )}
                  </Text>
                </View>
              )}
              
              {/* Action Buttons */}
              <View style={styles.actionButtonsWrapper}>
                <TouchableOpacity
                  onPress={addToCart}
                  disabled={enableAddToCardButton}
                  style={[
                    styles.addToCartButton,
                    enableAddToCardButton ? styles.disabledButton : styles.activeButton
                  ]}
                >
                  <Ionicons name="cart-outline" size={20} color="white" />
                  <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={toggleWishlist}
                  style={styles.wishlistButton}
                >
                  <Ionicons 
                    name={product.wishlist ? "heart" : "heart-outline"} 
                    size={20} 
                    color={product.wishlist ? "#EF4444" : "#6B7280"} 
                  />
                  <Text style={styles.wishlistText}>Favorite</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {/* Tabs */}
          <View style={styles.tabsWrapper}>
            {/* Tab Buttons */}
            <View style={styles.tabButtonsWrapper}>
              {['details', 'videos', 'reviews', 'shipping'].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[
                    styles.tabButton,
                    activeTab === tab ? styles.activeTab : styles.inactiveTab
                  ]}
                >
                  <Text style={[
                    styles.tabButtonText,
                    activeTab === tab ? styles.activeTabText : styles.inactiveTabText
                  ]}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Tab Content */}
            <View style={styles.tabContentWrapper}>
              {renderTabContent()}
            </View>
          </View>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <View style={styles.relatedProductsWrapper}>
              <Text style={styles.relatedProductsTitle}>Related Products</Text>
              <ProductList 
                products={relatedProducts} 
                horizontal 
                style={styles.relatedProductsList} 
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  breadcrumbContainer: {
    marginBottom: 16,
  },
  productContainer: {
    flexDirection: 'column',
    marginBottom: 32,
  },
  imageGalleryContainer: {
    width: '100%',
    marginBottom: 24,
  },
  mainImage: {
    width: '100%',
    height: 320,
    borderRadius: 8,
  },
  thumbImage: {
    width: 64,
    height: 64,
    borderRadius: 4,
    marginRight: 8,
  },
  thumbImageContainer: {
    borderWidth: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  thumbImageActive: {
    borderColor: '#3B82F6',
  },
  thumbImageInactive: {
    borderColor: '#E5E7EB',
  },
  productInfoContainer: {
    width: '100%',
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  oldPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
    marginLeft: 12,
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  quantityLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityInput: {
    width: 48,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  stockText: {
    marginLeft: 16,
  },
  outOfStock: {
    color: '#EF4444',
  },
  totalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  totalPriceLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalPriceValue: {
    color: '#10B981',
    fontWeight: '600',
    fontSize: 18,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addToCartButtonActive: {
    backgroundColor: '#3B82F6',
  },
  addToCartButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  wishlistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
  buttonTextWhite: {
    color: '#FFF',
  },
  tabsContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 32,
  },
  tabButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 24,
    borderWidth: 1,
  },
  tabButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  tabButtonInactive: {
    borderColor: '#D1D5DB',
  },
  tabButtonText: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  tabButtonTextActive: {
    color: '#FFF',
  },
  tabButtonTextInactive: {
    color: '#374151',
  },
  tabContentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  descriptionText: {
    color: '#6B7280',
    fontSize: 16,
  },
  relatedProductsContainer: {
    marginBottom: 32,
  },
  relatedProductsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  relatedProductsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});


export default ProductDetailsScreen;