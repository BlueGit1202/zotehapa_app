import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useDispatch, useSelector } from 'react-redux';
import ProductListComponent from '../components/ProductListComponent';
import LoadingContentComponent from '../components/oadingContentComponent';
import PaginationComponent from '../components/PaginationComponent';
import { fetchFlashSaleProducts } from '../../../store/actions/frontend/frontendProductActions';

const FlashSaleProductComponent = () => {
  const tailwind = useTailwind();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  
  const {
    flashSaleProducts: products,
    flashSaleProductPagination: pagination
  } = useSelector(state => state.frontendProduct);

  const fetchProducts = (page = 1) => {
    setLoadingContent(true);
    dispatch(fetchFlashSaleProducts({
      paginate: 1,
      page: page,
      per_page: 32,
      order_column: "name",
      order_type: "asc",
    }))
    .finally(() => setLoadingContent(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const productCountText = products.length > 1 
    ?'products found' 
    :'product found';

  return (
    <View style={tailwind('mb-10 sm:mb-20 px-4')}>
      <View style={tailwind('container')}>
        {/* Header */}
        <View style={tailwind('flex-row justify-between items-center mb-6')}>
          <View style={tailwind('flex-col')}>
            <Text style={tailwind('text-3xl font-bold capitalize sm:text-lg')}>
              {'flash sale'}
            </Text>
            <Text style={tailwind('text-xl font-medium capitalize sm:text-sm')}>
              ({products.length} {productCountText})
            </Text>
          </View>
        </View>

        {/* Product Grid */}
        <View style={tailwind('w-full')}>
          {loadingContent && <LoadingContentComponent />}
          
          <FlatList
            data={products}
            renderItem={({ item }) => <ProductListComponent product={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={tailwind('justify-between gap-4')}
            contentContainerStyle={tailwind('pb-6')}
            scrollEnabled={false}
            ListEmptyComponent={
              !loadingContent && (
                <Text style={tailwind('text-center py-10')}>
                  {'no products found'}
                </Text>
              )
            }
          />

          {/* Pagination */}
          {pagination?.meta?.last_page > 1 && (
            <PaginationComponent 
              onPageChange={fetchProducts} 
              data={pagination.meta} 
              limit={1} 
              keepLength={false}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default FlashSaleProductComponent;