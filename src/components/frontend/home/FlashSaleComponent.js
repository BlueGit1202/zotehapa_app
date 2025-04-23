import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import ProductListComponent from "../components/ProductListComponent";
import LoadingComponent from "../components/LoadingComponent";
import { fetchFlashSaleProducts } from "../../../store/actions/frontend/frontendProductActions";

const FlashSaleComponent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const products = useSelector(
    state => state.frontendProduct.flashSaleProducts
  );

  useEffect(
    () => {
      setLoading(true);
      dispatch(
        fetchFlashSaleProducts({
          paginate: 0,
          rand: 8,
        })
      ).finally(() => setLoading(false));
    },
    [dispatch]
  );

  if (loading) {
    return <LoadingComponent />;
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {"flash_sale"}
          </Text>

          {products.length === 8 &&
            <TouchableOpacity
              onPress={() => navigation.navigate("FlashSaleProducts")}
              style={styles.showMoreButton}
            >
              <Text style={styles.showMoreText}>
                {"show more"}
              </Text>
            </TouchableOpacity>}
        </View>

        <FlatList
          data={products}
          renderItem={({ item }) => <ProductListComponent product={item} />}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 28, // mb-7 equivalent (7 * 4 = 28)
    paddingHorizontal: 16, // px-4 equivalent (4 * 4 = 16)
  },
  innerContainer: {
    width: "100%", // container class equivalent
    maxWidth: 1280, // typical container max-width
    alignSelf: "center", // center the container
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20, // mb-5 equivalent (5 * 4 = 20)
  },
  title: {
    fontSize: 24, // text-2xl equivalent
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  showMoreButton: {
    paddingVertical: 8, // py-2 equivalent
    paddingHorizontal: 16, // px-4 equivalent
    borderRadius: 999, // rounded-full equivalent
    backgroundColor: "#E5E7EB", // bg-gray-200 equivalent
  },
  showMoreText: {
    fontSize: 14, // text-sm equivalent
    fontWeight: "600", // font-semibold equivalent
    color: "#3B82F6", // text-blue-500 equivalent
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  listContent: {
    gap: 16, // gap-4 equivalent (4 * 4 = 16)
  },
});

export default FlashSaleComponent;
