import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import ProductList from '../components/ProductListComponent';
import Loading from '../components/LoadingComponent';
import Pagination from '../components/PaginationComponent';
import {
  fetchPromotion,
  fetchPromotionProducts,
  resetPromotionProducts,
} from '../../../store/actions/frontend/frontendPromotionActions';

const PromotionProductsScreen = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const { slug } = route.params;
  
  const {
    show: promotion,
    products,
    productPagination,
    loading,
  } = useSelector((state) => state.frontendPromotion);
  console.log(promotion)
  
  const [loadingContent, setLoadingContent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchPromotion(slug));
        await dispatch(fetchPromotionProducts(slug));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
    
    return () => {
      dispatch(resetPromotionProducts());
    };
  }, [slug, dispatch]);

  const handlePageChange = async (page) => {
    setLoadingContent(true);
    setCurrentPage(page);
    try {
      await dispatch(fetchPromotionProducts(slug, page));
    } catch (error) {
      console.error('Error changing page:', error);
    } finally {
      setLoadingContent(false);
    }
  };

  if (loading || !promotion.id) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.flex1}>
        <View style={styles.container}>
          {/* Promotion Header */}
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.promotionName}>{promotion.name}</Text>
              <Text style={styles.productCount}>
                {products.length} {products.length > 1 ? 'products found' : 'product found'}
              </Text>
            </View>
          </View>
          
          {/* Products Grid */}
          <View style={styles.productsContainer}>
            {loadingContent ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4B6FED" />
              </View>
            ) : (
              <>
                {products.length > 0 ? (
                  <>
                    <FlatList
                      data={products}
                      numColumns={2}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <View style={styles.productItem}>
                          <ProductList product={item} />
                        </View>
                      )}
                      contentContainerStyle={styles.flatListContent}
                    />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={productPagination.last_page}
                      onPageChange={handlePageChange}
                    />
                  </>
                ) : (
                  <View style={styles.noProductsContainer}>
                    <Text style={styles.noProductsText}>No products found</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  flex1: {
    flex: 1,
  },
  container: {
    marginHorizontal: 'auto',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTextContainer: {
    flexDirection: 'column',
  },
  promotionName: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  productCount: {
    fontSize: 18,
    color: '#6B7280', // Tailwind's gray-600
  },
  productsContainer: {
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  productItem: {
    width: '50%',
    padding: 8,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  noProductsText: {
    fontSize: 18,
    color: '#6B7280', // Tailwind's gray-500
  },
});

export default PromotionProductsScreen;