import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  FlatList,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LoadingComponent from "../components/LoadingComponent";
import { fetchCategories } from "../../../store/actions/frontend/frontendProductCategoryActions";

const CategoryCard = React.memo(({ item, onPress, cardWidth }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const cardContainerStyle = {
    width: cardWidth,
    marginHorizontal: 5,
    alignItems: 'center', // Ensures text aligns with image
  };

  const circleStyle = {
    width: cardWidth - 10,
    height: cardWidth - 10,
    borderRadius: (cardWidth - 10) / 2,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  };

  const imageContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: (cardWidth - 10) / 2,
    overflow: 'hidden',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.cardContainer, cardContainerStyle]}
      activeOpacity={0.9}
    >
      {/* Image Container */}
      <View style={[styles.circleContainer, circleStyle]}>
        <View style={[styles.imageContainer, imageContainerStyle]}>
          {!imageError && item.cover ? (
            <>
              <Image
                source={{ uri: item.cover }}
                style={styles.categoryImage}
                resizeMode="cover"
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
                onLoad={() => setImageLoading(false)}
              />
              {imageLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="small" color="#4B6FED" />
                </View>
              )}
            </>
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.textContent}>
        <Text 
          style={styles.categoryNameText}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const CategoryComponent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { width: windowWidth } = useWindowDimensions();
  
  const { lists: categories = [] } = useSelector(state => state.frontendProductCategory);

  // Calculate card width to show exactly 5 categories with 5px margin on each side
  const cardWidth = useMemo(() => {
    const totalMargins = 5 * 2 * 5;
    return (windowWidth - totalMargins) / 5;
  }, [windowWidth]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    dispatch(fetchCategories({
      paginate: 0,
      order_column: "id",
      order_type: "asc",
      parent_id: null,
      status: 5
    })).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false };
  }, [dispatch]);

  const handleCategoryPress = useCallback((slug) => {
    navigation.navigate("ProductList", { category: slug });
  }, [navigation]);

  const renderItem = useCallback(({ item }) => (
    <CategoryCard 
      item={item} 
      onPress={() => handleCategoryPress(item.slug)}
      cardWidth={cardWidth}
    />
  ), [handleCategoryPress, cardWidth]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.sectionTitle}>
        {"Browse by categories"}
      </Text>
      
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={cardWidth + 10}
        decelerationRate="fast"
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        getItemLayout={(data, index) => ({
          length: cardWidth + 10,
          offset: (cardWidth + 10) * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 24,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#111827',
  },
  listContent: {
    paddingHorizontal: 0,
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to top
  },
  circleContainer: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  textContent: {
    width: '100%',
    marginTop: 8, // Reduced from 12 for tighter spacing
    paddingHorizontal: 4, // Reduced padding for better text alignment
  },
  categoryNameText: {
    textAlign: 'center',
    fontWeight: '500',
    color: '#1F2937',
    fontSize: 13, // Slightly smaller for better fit
    lineHeight: 16, // Added line height for better readability
  },
});

export default React.memo(CategoryComponent);