import React from "react";
import { FlatList, View } from "react-native";
import SliderComponent from "./SliderComponent";
import CategoryComponent from "./CategoryComponent";
import PromotionComponent from "./PromotionComponent";
import ProductSectionComponent from "./ProductSectionComponent";
import MostPopularComponent from "./MostPopularComponent";
import FlashSaleComponent from "./FlashSaleComponent";
import ProductBrandComponent from "./ProductBrandComponent";
import BenefitComponent from "./BenefitComponent";

const HomeComponent = () => {
  // Array of all your components in order
  const components = [
    { id: "slider", component: <SliderComponent /> },
    { id: "category", component: <CategoryComponent /> },
    { id: "promotion", component: <PromotionComponent /> },
    { id: "featured", component: <ProductSectionComponent /> },
    { id: "popular", component: <MostPopularComponent /> },
    { id: "flashsale", component: <FlashSaleComponent /> },
    { id: "brands", component: <ProductBrandComponent /> },
    { id: "benefits", component: <BenefitComponent /> },
  ];

  const renderItem = ({ item }) =>
    <View key={item.id}>
      {item.component}
    </View>;

  return (
    <FlatList
      data={components}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      initialNumToRender={3} // Optimize initial load
      maxToRenderPerBatch={5} // Control memory usage
      windowSize={7} // Balance performance and memory
      removeClippedSubviews={true} // Improve performance
      ListFooterComponent={<View style={{ height: 20 }} />} // Add some bottom padding
    />
  );
};

export default HomeComponent;
