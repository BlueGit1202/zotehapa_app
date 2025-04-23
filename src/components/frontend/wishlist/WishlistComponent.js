import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import ProductList from '../components/ProductListComponent';
import Pagination from '../components/PaginationComponent';
import {
  fetchWishlistProducts,
  toggleWishlist,
  resetWishlist
} from '../../../store/actions/frontend/frontendWishlistActions';
import { listProducts } from '../../../store/actions/productActions';

const WishlistScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // 1. PROPERLY STRUCTURED REDUX SELECTORS
  const {
    wishlistProducts: wishlistItems = [],
    wishlistProductPagination: pagination = {},
    loading: wishlistLoading = false,
    error: wishlistError = null
  } = useSelector((state) => state.frontendWishlist);

  const { 
    lists: allProducts = [], 
    loading: productsLoading = false,
    error: productsError = null 
  } = useSelector(state => state.product);

  const setting = useSelector((state) => state.frontendSetting.lists);
  const isLoggedIn = useSelector((state) => state.auth.authStatus);

  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // 2. PROPER DATA LOADING SEQUENCE
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all products first
        await dispatch(listProducts());
        
        // Then load wishlist if logged in
        if (isLoggedIn) {
          await dispatch(fetchWishlistProducts(currentPage));
        }
      } catch (error) {
        console.error('Initial data loading error:', error);
      }
    };

    loadData();
  }, [dispatch, isLoggedIn, currentPage]);

  // 4. PROPER FILTERING WITH TYPE SAFETY
  const wishlistProducts = useMemo(() => {
    if (!Array.isArray(allProducts)) {
      console.warn('Products data is not an array');
      return [];
    }
    
    if (!Array.isArray(wishlistItems)) {
      console.warn('Wishlist items is not an array');
      return [];
    }

    // Convert IDs to strings for consistent comparison
    const wishlistProductIds = wishlistItems.map(item => String(item.product_id));
    
    return allProducts.filter(product => 
      wishlistProductIds.includes(String(product.id))
    );
  }, [allProducts, wishlistItems]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(listProducts());
      await dispatch(fetchWishlistProducts(currentPage));
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    dispatch(fetchWishlistProducts(page));
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await dispatch(toggleWishlist(productId));
      // Refresh the wishlist after removal
      await dispatch(fetchWishlistProducts(currentPage));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  // Loading and error states
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.notLoggedInContainer}>
        <Text style={styles.notLoggedInText}>
          Please login to view your wishlist
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (wishlistLoading || productsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (wishlistError || productsError) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {wishlistError || productsError}
        </Text>
        <TouchableOpacity
          onPress={handleRefresh}
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={wishlistProducts}
        numColumns={2}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.productItemContainer}>
            <ProductList 
              product={item} 
              onRemove={() => handleRemoveFromWishlist(item.id)}
              showRemoveButton
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyWishlistContainer}>
            <Image
              source={{ uri: setting?.image_wishlist }}
              style={styles.emptyWishlistImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyWishlistText}>
              Your wishlist is empty
            </Text>
          </View>
        }
        ListFooterComponent={
          wishlistProducts.length > 0 && pagination.last_page > 1 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.last_page}
              onPageChange={handlePageChange}
            />
          ) : null
        }
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        columnWrapperStyle={styles.columnWrapper}
      />
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
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notLoggedInContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notLoggedInText: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productItemContainer: {
    width: '50%',
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyWishlistContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyWishlistImage: {
    width: 208,
    height: 208,
  },
  emptyWishlistText: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 16,
  },
});

export default WishlistScreen;