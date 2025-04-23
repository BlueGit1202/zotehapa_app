import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Dimensions,
  StyleSheet
} from 'react-native';
import { useTailwind } from 'tailwind-rn';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import ProductListComponent from '../components/ProductListComponent';
import LoadingComponent from '../components/LoadingComponent';
import LoadingContentComponent from '../components/LoadingContentComponent';
import PaginationComponent from '../components/PaginationComponent';
import CategoryBreadcrumbComponent from '../components/CategoryBreadcrumbComponent';
import CustomCheckbox from '../../CustomCheckbox';
import { 
  fetchCategoryWiseProducts,
  fetchAncestorsAndSelfCategories 
} from '../../../store/actions/frontend/frontendProductActions';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchCategoryAncestors } from '../../../store/actions/frontend/frontendProductCategoryActions';
import { roundToNearestPixel } from 'nativewind';

const ProductComponent = () => {
  const tailwind = useTailwind();
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [productSortBy, setProductSortBy] = useState(null);
  const [productBrands, setProductBrands] = useState([]);
  const [productVariations, setProductVariations] = useState([]);
  const [productPrice, setProductPrice] = useState({ range: [0, 0] });
  const [maxRange, setMaxRange] = useState(0);
  
  const {
    categoryWiseProducts: products,
    categoryWiseBands: brands,
    categoryWiseVariations: variations,
    categoryWiseProductPagination: pagination
  } = useSelector(state => state.frontendProduct);
  
  const ancestorsAndSelfCategories = useSelector(state => state.frontendProductCategory.ancestorsAndSelf);

  const [productSearchForm, setProductSearchForm] = useState({
    page: 1,
    status: 5, // ACTIVE status
    sort_by: null,
    category: null,
    name: null,
    brand: [],
    variation: [],
    min_price: null,
    max_price: null
  });

  useEffect(() => {
    fetchAncestorsAndSelf();
  }, [route.params?.category]);

  console.log("route data", route.params)

  const fetchAncestorsAndSelf = () => {
    if (route.params?.category) {
      setLoading(true);
      setProductSearchForm(prev => ({
        ...prev,
        category: route.params.category
      }));
      
      dispatch(fetchCategoryAncestors(route.params.category))
        .then(() => fetchProducts())
        .finally(() => setLoading(false));
      console.log("--------------",route.params)
    }
    else {
      setProductSearchForm(prev => ({
        ...prev,
        category: null,
      }));
      fetchProducts();
    }
  };

  const fetchProducts = (page = 1) => {
    setLoadingContent(true);
    const payload = {
      ...productSearchForm,
      page: page,
      category: route.params.category,
      brand: JSON.stringify([`${route.params.brand}`])
    };
    console.log(typeof(route.params.brand))
    console.log("payload",payload)
    
    dispatch(fetchCategoryWiseProducts(payload))
      .then(res => {
        setProductPrice({ range: [0, res.data.max_price] });
        console.log("max_price:",res.data.max_price)
        setMaxRange(1000);
      })
      .finally(() => setLoadingContent(false));
  };

  const handleSortBy = (sortBy) => {
    setProductSearchForm(prev => ({
      ...prev,
      sort_by: sortBy
    }));
    fetchProducts();
  };

  const handlePriceChange = (values) => {
    setProductPrice({ range: values });
    setProductSearchForm(prev => ({
      ...prev,
      min_price: values[0],
      max_price: values[1]
    }));
    fetchProducts();
  };

  const handleBrandToggle = (brandId, isChecked) => {
    const updatedBrands = isChecked 
      ? [...productBrands, brandId]
      : productBrands.filter(id => id !== brandId);
    
    setProductBrands(updatedBrands);
    setProductSearchForm(prev => ({
      ...prev,
      brand: JSON.stringify(updatedBrands)
    }));
    fetchProducts();
  };

  const handleVariationToggle = (attribute, option, isChecked) => {
    const updatedVariations = isChecked
      ? [...productVariations, { attribute, option }]
      : productVariations.filter(v => !(v.attribute === attribute && v.option === option));
    
    setProductVariations(updatedVariations);
    setProductSearchForm(prev => ({
      ...prev,
      variation: JSON.stringify(updatedVariations)
    }));
    fetchProducts();
  };

  const productCountText = products.length > 1 
    ? 'products_found'
    : 'product_found';

  const renderFilterSection = () => (
    <View style={styles.filterContainer}>
      {/* Sort By */}
      <View style={styles.filterSection}>
        <TouchableOpacity style={styles.filterHeader}>
          <Text style={styles.filterTitle}>
            {'sort_by'}
          </Text>
          <Icon name="chevron-up" size={20} />
        </TouchableOpacity>
        
        <View style={styles.filterOptions}>
          {[
            { id: 'newest', label: 'newest', value: 'latest' },
            { id: 'price_low_to_high', label: 'price_low_to_high', value: 'price_low_to_high' },
            { id: 'price_high_to_low', label: 'price_high_to_low', value: 'price_high_to_low' },
            { id: 'top_rated', label: 'label.top_rated', value: 'top_rated' }
          ].map(item => (
            <CustomCheckbox
              key={item.id}
              isChecked={productSortBy === item.value}
              onToggle={() => {
                setProductSortBy(item.value);
                handleSortBy(item.value);
              }}
              label={item.label}
            />
          ))}
        </View>
      </View>

      {/* Price Range */}
      <View style={styles.filterSection}>
        <TouchableOpacity style={styles.filterHeader}>
          <Text style={styles.filterTitle}>
            {'price'}
          </Text>
          <Icon name="chevron-up" size={20} />
        </TouchableOpacity>
        
        <View style={styles.filterOptions}>
          <View style={styles.priceInputContainer}>
            <TextInput
              style={[styles.priceInput, styles.priceInputLeft]}
              value={productPrice.range[0].toString()}
              onChangeText={text => handlePriceChange([parseInt(text || 0), productPrice.range[1]])}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.priceInput}
              value={productPrice.range[1].toString()}
              onChangeText={text => handlePriceChange([productPrice.range[0], parseInt(text || 0)])}
              keyboardType="numeric"
            />
          </View>
          <Slider
            minimumValue={0}
            maximumValue={maxRange}
            values={productPrice.range}
            onValuesChange={handlePriceChange}
            step={1}
            minimumTrackTintColor="#F23E14"
            maximumTrackTintColor="#D9DBE9"
          />
        </View>
      </View>

      {/* Brands */}
      {brands?.length > 0 && (
        <View style={styles.filterSection}>
          <TouchableOpacity style={styles.filterHeader}>
            <Text style={styles.filterTitle}>
              {'brand'}
            </Text>
            <Icon name="chevron-up" size={20} />
          </TouchableOpacity>
          
          <View style={styles.filterOptions}>
            {brands.map(brand => (
              <CustomCheckbox
                key={brand.id}
                isChecked={productBrands.includes(brand.id)}
                onToggle={() => handleBrandToggle(brand.id, !productBrands.includes(brand.id))}
                label={brand.name}
              />
            ))}
          </View>
        </View>
      )}

      {/* Variations */}
      {variations && Object.keys(variations).length > 0 && (
        Object.entries(variations).map(([key, items]) => (
          <View key={key} style={styles.filterSection}>
            <TouchableOpacity style={styles.filterHeader}>
              <Text style={styles.filterTitle}>
                {key.replace(/_/g, ' ')}
              </Text>
              <Icon name="chevron-up" size={20} />
            </TouchableOpacity>
            
            <View style={styles.filterOptions}>
              {items.map(item => (
                <CustomCheckbox
                  key={`${item.product_attribute_id}_${item.product_attribute_option_id}`}
                  isChecked={productVariations.some(v => 
                    v.attribute === item.product_attribute_id && 
                    v.option === item.product_attribute_option_id
                  )}
                  onToggle={() => 
                    handleVariationToggle(
                      item.product_attribute_id, 
                      item.product_attribute_option_id, 
                      !productVariations.some(v => 
                        v.attribute === item.product_attribute_id && 
                        v.option === item.product_attribute_option_id
                      )
                    )
                  }
                  label={item.attribute_option_name}
                />
              ))}
            </View>
          </View>
        ))
      )}
    </View>
  );

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Category Breadcrumb */}
        {route.params?.category && (
          <CategoryBreadcrumbComponent categories={ancestorsAndSelfCategories} />
        )}

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              {'explore_all_products'}
            </Text>
            <Text style={styles.headerSubtitle}>
              ({products.length} {productCountText})
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => setShowFilter(!showFilter)}
            style={styles.filterButtonMobile}
          >
            <Icon name="filter" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>

          <View style={styles.filterSidebar}>
            {renderFilterSection()}
          </View>

          {/* Mobile Filter Modal */}
          {showFilter && (
            <View style={styles.filterModalOverlay}>
              <View style={styles.filterModal}>
                <View style={styles.filterModalHeader}>
                  <Text style={styles.filterModalTitle}>
                    {'filter_and_sorting'}
                  </Text>
                  <TouchableOpacity onPress={() => setShowFilter(false)}>
                    <Icon name="close" size={24} color="#E93C3C" />
                  </TouchableOpacity>
                </View>
                <ScrollView>
                  {renderFilterSection()}
                </ScrollView>
              </View>
            </View>
          )}

          {/* Product Grid */}
          <View style={styles.productGrid}>
            {loadingContent && <LoadingContentComponent />}
            
            <FlatList
              data={products}
              renderItem={({ item }) => <ProductListComponent product={item} />}
              keyExtractor={(item) => `${item.id}`}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.flatListContent}
              ListEmptyComponent={
                !loadingContent && (
                  <Text style={styles.emptyText}>
                    {'no_products_found'}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 40
  },
  innerContainer: {
    paddingHorizontal: 16
  },
  filterContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 16
  },
  filterSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  filterOptions: {
    marginBottom: 16
  },
  priceInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    padding: 8,
    width: '48%'
  },
  priceInputLeft: {
    marginRight: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  headerTextContainer: {
    flexDirection: 'column'
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'capitalize'
  },
  headerSubtitle: {
    fontSize: 20,
    fontWeight: '500',
    textTransform: 'capitalize'
  },
  filterButtonMobile: {
    display: 'none'
  },
  mainContent: {
    flexDirection: 'row'
  },
  filterSidebar: {
    display: 'none',
    width: 288,
    paddingRight: 24
  },
  filterModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 50
  },
  filterModal: {
    backgroundColor: 'white',
    height: '100%',
    width: '80%'
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1
  },
  filterModalTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  productGrid: {
    flex: 1
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 16
  },
  flatListContent: {
    paddingBottom: 24
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 40
  }
});

export default ProductComponent;