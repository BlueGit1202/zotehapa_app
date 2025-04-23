import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import ProductListComponent from "../components/ProductListComponent";
import LoadingComponent from "../components/LoadingComponent";
import { fetchPromotions } from "../../../store/actions/frontend/frontendPromotionActions";
import { fetchProductSections } from "../../../store/actions/frontend/frontendProductSectionActions";

const ProductSectionComponent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState([]);

  const productSections = useSelector(
    state => state.frontendProductSection.lists || []
  );

  useEffect(
    () => {
      setLoading(true);

      dispatch(fetchProductSections())
        .then(() => {
          dispatch(
            fetchPromotions({
              paginate: 0,
              order_column: "id",
              order_type: "asc",
              type: 5, // BIG promotion type
              status: 5, // ACTIVE status
            })
          )
            .then(res => setPromotions(res.data || []))
            .finally(() => setLoading(false));
        })
        .catch(() => setLoading(false));
    },
    [dispatch]
  );

  const renderSection = (productSection, index) => {
    return (
      <View key={productSection.id} style={styles.sectionContainer}>
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {productSection.name}
          </Text>

          {productSections.length === 8 &&
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ProductSectionProducts", {
                  slug: productSection.slug,
                })}
              style={styles.showMoreButton}
            >
              <Text style={styles.showMoreText}>
                {"show more"}
              </Text>
            </TouchableOpacity>}
        </View>

        {/* Products Grid */}
        <FlatList
          data={productSection.products}
          renderItem={({ item }) => <ProductListComponent product={item} />}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.productGrid}
          contentContainerStyle={styles.productListContent}
          scrollEnabled={false}
        />

        {/* Promotion Banner (if exists for this index) */}
        {promotions[index] &&
          <View style={styles.promotionContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("PromotionProducts", {
                  slug: promotions[index].slug,
                })}
            >
              <Image
                source={{ uri: promotions[index].preview }}
                style={styles.promotionImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>}
      </View>
    );
  };

  if (loading) {
    return <LoadingComponent />;
  }

  // Render product sections with promotions
  if (productSections.length > 0 && promotions.length > 0) {
    return (
      <View style={styles.container}>
        {productSections.map(
          (section, index) =>
            section.products.length > 0 && renderSection(section, index)
        )}
      </View>
    );
  }

  // Render only product sections
  if (productSections.length > 0) {
    return (
      <View style={styles.container}>
        {productSections.map(
          section => section.products.length > 0 && renderSection(section)
        )}
      </View>
    );
  }

  // Render only promotions
  if (promotions.length > 0) {
    return (
      <View style={styles.container}>
        {promotions.map(promotion =>
          <View key={promotion.id} style={styles.promotionContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("PromotionProducts", {
                  slug: promotion.slug,
                })}
            >
              <Image
                source={{ uri: promotion.preview }}
                style={styles.promotionImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    margin: 0,
  },
  sectionContainer: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "capitalize",
    color: "#111827",
  },
  showMoreButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
  productGrid: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  productListContent: {
    gap: 16,
  },
  promotionContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  promotionImage: {
    width: "100%",
    height: 160,
    borderRadius: 24,
  },
});

export default ProductSectionComponent;
