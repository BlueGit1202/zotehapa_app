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
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import ProductList from '../components/ProductList';
import Loading from '../components/LoadingComponent';
import Pagination from '../components/PaginationComponent';
import {
  fetchProductSection,
  fetchSectionProducts,
} from '../../../store/actions/frontend/frontendProductSectionActions';

const ProductSectionScreen = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const { slug } = route.params;
  
  const {
    show: productSection,
    products,
    productPagination,
    loading,
  } = useSelector((state) => state.frontendProductSection);
  
  const [loadingContent, setLoadingContent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 32;

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchProductSection(slug));
        await dispatch(fetchSectionProducts(slug, currentPage, perPage));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
    
    return () => {
      dispatch(resetSectionProducts());
    };
  }, [slug, dispatch]);

  const handlePageChange = async (page) => {
    setLoadingContent(true);
    setCurrentPage(page);
    try {
      await dispatch(fetchSectionProducts(slug, page, perPage));
    } catch (error) {
      console.error('Error changing page:', error);
    } finally {
      setLoadingContent(false);
    }
  };

  if (loading || !productSection.id) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="container mx-auto px-4 py-4">
          {/* Section Header */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-col">
              <Text className="text-2xl font-bold capitalize">
                {productSection.name}
              </Text>
              <Text className="text-lg text-gray-600">
                {products.length} {products.length > 1 ? 'products found' : 'product found'}
              </Text>
            </View>
          </View>
          
          {/* Products Grid */}
          <View className="w-full">
            {loadingContent ? (
              <View className="flex-1 justify-center items-center py-8">
                <ActivityIndicator size="large" color="#4B6FED" />
              </View>
            ) : (
              <>
                {products.length > 0 ? (
                  <>
                    <View className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mb-6">
                      <ProductList products={products} />
                    </View>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={productPagination.last_page}
                      onPageChange={handlePageChange}
                    />
                  </>
                ) : (
                  <View className="flex-1 justify-center items-center py-8">
                    <Text className="text-lg text-gray-500">No products found</Text>
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

export default ProductSectionScreen;