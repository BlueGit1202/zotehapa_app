import React from "react";
import { View, Text, Image, FlatList } from "react-native";
import StarRating from "react-native-star-rating";

const ProductListComponent = ({ products }) => {
  const renderProductItem = ({ item: product }) =>
    <View className="m-2 p-2 rounded-2xl shadow-sm bg-white">
      {/* Product Image with Badge */}
      <View className="relative overflow-hidden rounded-xl">
        {product.is_offer &&
          product.flash_sale &&
          <View className="absolute top-3 left-3 z-10 bg-red-500 rounded-xl px-2 py-1 shadow">
            <Text className="text-xs font-semibold text-white capitalize">
              {"flash sale"}
            </Text>
          </View>}

        <Image
          source={{ uri: product.cover }}
          className="w-full h-40 rounded-xl"
          resizeMode="cover"
        />
      </View>

      {/* Product Details */}
      <View className="px-1 pt-3 pb-2">
        {/* Product Name */}
        <Text className="text-base font-semibold mb-1.5" numberOfLines={1}>
          {product.name}
        </Text>

        {/* Rating */}
        <View className="flex-row items-center mb-3">
          <StarRating
            disabled={true}
            maxStars={5}
            rating={product.rating_star / product.rating_star_count || 0}
            starSize={14}
            fullStarColor="#FFBC1F"
            emptyStarColor="#E5E7EB"
            containerStyle={{ width: 80 }}
          />

          {product.rating_star_count > 0 &&
            <View className="flex-row items-center ml-2">
              <Text className="text-xs text-gray-600">
                {(product.rating_star / product.rating_star_count).toFixed(1)}
              </Text>
              <Text className="text-xs text-gray-600 ml-1">
                ({product.rating_star_count}{" "}
                {product.rating_star_count > 1 ? "reviews" : "review"})
              </Text>
            </View>}
        </View>

        {/* Pricing */}
        {product.is_offer
          ? <View className="flex-row items-center">
              <Text className="text-xl font-bold">
                {product.discounted_price}
              </Text>
              <Text className="text-sm font-semibold text-red-500 ml-2 line-through">
                {product.currency_price}
              </Text>
            </View>
          : <Text className="text-xl font-bold">
              {product.currency_price}
            </Text>}
      </View>
    </View>;

  if (products.length === 0) {
    return null;
  }

  return (
    <FlatList
      data={products}
      renderItem={renderProductItem}
      keyExtractor={item => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      contentContainerStyle={{ padding: 8 }}
    />
  );
};

export default ProductListComponent;
