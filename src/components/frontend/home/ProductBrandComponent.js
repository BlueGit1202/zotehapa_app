import React, { useCallback, useEffect, useState, useMemo } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  useWindowDimensions, 
  ActivityIndicator, 
  FlatList,
  StyleSheet
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingComponent from "../components/LoadingComponent";
import { fetchBrands } from "../../../store/actions/frontend/frontendProductBrandActions";

const BrandCard = React.memo(({ item, onPress, cardWidth }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.brandCardContainer, { width: cardWidth }]}
      activeOpacity={0.9}
    >
      <View style={styles.brandCardContent}>
        <View style={[styles.brandImageContainer, { height: cardWidth * 0.8 }]}>
          {!imageError && item.cover ? (
            <>
              <Image
                source={{ uri: item.cover }}
                style={styles.brandImage}
                onError={() => setImageError(true)}
                onLoad={() => setImageLoading(false)}
                resizeMode="contain"
              />
              {imageLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="small" color="#4B6FED" />
                </View>
              )}
            </>
          ) : (
            <View style={styles.brandImagePlaceholder}>
              <Ionicons name="image-outline" size={24} color="#4B6FED" />
            </View>
          )}
        </View>

        <View style={styles.brandNameContainer}>
          <Text 
            style={styles.brandNameText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const ProductBrandComponent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { width: windowWidth } = useWindowDimensions();
  
  const { lists: brands } = useSelector(state => state.frontendProductBrand);

  // Calculate dimensions for responsive brand cards
  const { cardWidth, itemSpacing } = useMemo(() => {
    const containerPadding = 24;
    const visibleItems = 4.5; // Show 4.5 items to indicate scrollability
    const totalSpacing = 16 * 4;
    const availableWidth = windowWidth - containerPadding - totalSpacing;
    return {
      cardWidth: Math.min(availableWidth / visibleItems, 120), // Max width 120
      itemSpacing: 16
    };
  }, [windowWidth]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    dispatch(fetchBrands({
      paginate: 0,
      order_column: "id",
      order_type: "asc",
      status: 5
    })).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false };
  }, [dispatch]);

  const handleBrandPress = useCallback((id) => {
    navigation.navigate("ProductList", { brand: id });
  }, [navigation]);

  const renderItem = useCallback(({ item }) => (
    <View style={{ marginRight: itemSpacing }}>
      <BrandCard 
        item={item} 
        onPress={() => handleBrandPress(item.id)}
        cardWidth={cardWidth}
      />
    </View>
  ), [handleBrandPress, cardWidth, itemSpacing]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        {"Popular brands"}
      </Text>
      
      <View style={styles.carouselContainer}>
        <FlatList
          data={brands}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.flatListContent,
            { paddingHorizontal: 12 }
          ]}
          snapToInterval={cardWidth + itemSpacing}
          decelerationRate="fast"
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          getItemLayout={(data, index) => ({
            length: cardWidth + itemSpacing,
            offset: (cardWidth + itemSpacing) * index,
            index,
          })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  carouselContainer: {
    height: 140, // Slightly taller to accommodate larger cards
  },
  flatListContent: {
    alignItems: 'center',
    paddingLeft: 12, // Extra padding to center first item
  },
  brandCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { 
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  brandCardContent: {
    padding: 12,
    alignItems: 'center',
  },
  brandImageContainer: {
    width: '100%',
    aspectRatio: 1, // Square container
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  brandImage: {
    width: '80%',
    height: '80%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(249, 250, 251, 0.8)',
  },
  brandImagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  brandNameContainer: {
    marginTop: 8,
    width: '100%',
  },
  brandNameText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
});

export default React.memo(ProductBrandComponent);