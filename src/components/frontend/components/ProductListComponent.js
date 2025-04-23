import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Pressable, 
  ActivityIndicator,
  StyleSheet 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StarRating from 'react-native-star-rating';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, toggleWishlist } from '../../../store/actions/frontend/frontendWishlistActions';

const ProductCard = ({ product }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const authStatus = useSelector(state => state.auth.authStatus);
  const wishlist = useSelector(state => state.frontendWishlist?.lists || []);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Return null if product is not defined
  if (!product) {
    return null;
  }

  const handleWishlist = () => {
    // Check if product exists and has id
    if (!authStatus) navigation.navigate("Login")
    else {
    if (!product?.id) return;
    
      const isInWishlist = wishlist.some(item => item.id === product.id);
      console.log(isInWishlist)
    dispatch(toggleWishlist({
      product_id: product.id,
      toggle: !isInWishlist
    })).then(() => {
      dispatch(fetchWishlist());
    }).catch(error => {
      if (error.response?.status === 401) {
        navigation.navigate('Auth', { screen: 'Login' });
      }
    });
    }
    
  };

  return (
    <View style={[styles.cardContainer, styles.cardShadow]}>
      {/* Image Container */}
      <View style={styles.imageContainer}>

        {product.flash_sale === true && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleText}>SALE</Text>
          </View>
        )}

        {/* Product Image */}
        <Pressable 
          style={styles.imagePressable}
          onPress={() => product?.slug && navigation.navigate('ProductDetails', { slug: product.slug })}
        >
          {!imageError && product?.cover ? (
            <>
              <Image
                source={{ uri: product.cover }}
                style={styles.productImage}
                resizeMode="contain"
                onError={() => setImageError(true)}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
              />
              {imageLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="small" color="#4B6FED" />
                </View>
              )}
            </>
          ) : (
            <Image
              source={require('../../../../assets/product.png')}
              style={styles.productImage}
              resizeMode="contain"
            />
          )}
        </Pressable>

        {/* Wishlist Button */}
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={handleWishlist}
          activeOpacity={0.8}
        >
          <View style={styles.wishlistIconContainer}>
            <Text style={styles.wishlistIcon}>
              {wishlist.some(item => item.id === product?.id) ? '❤️' : '🤍'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Product Info */}
      <View style={styles.productInfoContainer}>
        {/* Product Name */}
        <Text 
          style={styles.productName}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {product?.name || 'Product Name'}
        </Text>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <StarRating
            disabled
            maxStars={5}
            rating={product?.rating_star || 0}
            starSize={12}
            fullStarColor="#FFBC1F"
            emptyStarColor="#E5E7EB"
          />
          {(product?.rating_star_count || 0) > 0 && (
            <Text style={styles.ratingCount}>
              ({product.rating_star_count})
            </Text>
          )}
        </View>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>
            {product?.discounted_price || product?.currency_price || 'N/A'}
          </Text>
          {product?.is_offer && product?.discounted_price && (
            <Text style={styles.originalPrice}>
              {product.currency_price}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 8,
    minHeight: 280,
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  saleBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
    backgroundColor: '#EF4444',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  saleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imagePressable: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F3F4F6',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  wishlistIconContainer: {
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  wishlistIcon: {
    fontSize: 18,
  },
  productInfoContainer: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1F2937',
    minHeight: 40,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingCount: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  originalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
});

export default React.memo(ProductCard);