import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import LoadingContentComponent from '../components/LoadingContentComponent';
import ProductListComponent from '../components/ProductListComponent';
import PaginationComponent from '../components/PaginationComponent';
import { fetchPopularProducts } from '../../../store/actions/frontend/frontendProductActions';

const MostPopularProductComponent = () => {
  const [loading, setLoading] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const products = useSelector(state => state.frontendProduct.popularProducts);
  const pagination = useSelector(state => state.frontendProduct.popularProductPagination);
  const dispatch = useDispatch();

  const mostPopularProducts = (page = 1) => {
    setLoadingContent(true);
    setCurrentPage(page);
    dispatch(fetchPopularProducts({
      paginate: 1,
      page: page,
      per_page: 32,
      order_column: "name",
      order_type: "asc",
    }))
      .then(() => setLoadingContent(false))
      .catch(() => setLoadingContent(false));
  };

  useEffect(() => {
    setLoading(true);
    mostPopularProducts(1);
    setLoading(false);
  }, []);

  // Responsive grid columns based on screen width
  const { width } = Dimensions.get('window');
  const numColumns = width < 768 ? 2 : width < 1024 ? 3 : 4;

  return (
    <View className="mb-4 md:mb-8">
      <View className="container mx-auto px-4">
        <View className="flex flex-row items-center justify-between mb-4 md:mb-6">
          <View className="flex flex-col md:flex-row md:items-end gap-2 md:gap-3">
            <Text className="text-xl font-bold capitalize sm:text-2xl md:text-3xl">
              {'most_popular'}
            </Text>
            <Text className="text-sm font-medium capitalize md:text-base">
              ({products.length} {products.length > 1 ? 'products_found' : 'label.product_found'})
            </Text>
          </View>
        </View>

        <View className="w-full">
          {loadingContent && <LoadingContentComponent />}
          
          {products.length > 0 ? (
            <>
              <FlatList
                data={products}
                renderItem={({ item }) => <ProductListComponent product={item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={numColumns}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                contentContainerStyle={{ paddingBottom: 16 }}
                scrollEnabled={false}
              />
              <PaginationComponent
                currentPage={currentPage}
                totalPages={pagination.last_page}
                onPageChange={mostPopularProducts}
              />
            </>
          ) : (
            !loadingContent && (
              <Text className="text-center py-8">{'no_products_found'}</Text>
            )
          )}
        </View>
      </View>
    </View>
  );
};

export default MostPopularProductComponent;