import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Dimensions,
  StyleSheet 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/ProductListComponent';
import { fetchPopularProducts } from '../../../store/actions/frontend/frontendProductActions';

const { width: screenWidth } = Dimensions.get('window');

const MostPopularComponent = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const products = useSelector(state => state.frontendProduct.popularProducts);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await dispatch(fetchPopularProducts({ paginate: 0, rand: 8 }));
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [dispatch]);

  // Group products into slides of 4 products each (2x2 grid)
  const productSlides = [];
  for (let i = 0; i < products?.length; i += 4) {
    productSlides.push(products.slice(i, i + 4));
  }

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B6FED" />
      </View>
    );
  }

  if (!products || products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No popular products found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Most Popular</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Slider with 2x2 Grid */}
      <FlatList
        data={productSlides}
        renderItem={({ item: slide }) => (
          <View style={styles.slide}>
            {/* First Row */}
            <View style={styles.row}>
              <View style={styles.productContainerLeft}>
                {slide[0] && <ProductCard product={slide[0]} />}
              </View>
              <View style={styles.productContainerRight}>
                {slide[1] && <ProductCard product={slide[1]} />}
              </View>
            </View>
            
            {/* Second Row */}
            <View style={styles.row}>
              <View style={styles.productContainerLeft}>
                {slide[2] && <ProductCard product={slide[2]} />}
              </View>
              <View style={styles.productContainerRight}>
                {slide[3] && <ProductCard product={slide[3]} />}
              </View>
            </View>
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={screenWidth - 32}
        decelerationRate="fast"
      />

      {/* Pagination Indicators */}
      {productSlides.length > 1 && (
        <View style={styles.pagination}>
          {productSlides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === currentIndex ? '#8B5CF6' : '#E5E7EB' }
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#3B82F6',
  },
  slide: {
    width: screenWidth - 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productContainerLeft: {
    width: '50%',
    paddingRight: 4,
  },
  productContainerRight: {
    width: '50%',
    paddingLeft: 4,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default MostPopularComponent;