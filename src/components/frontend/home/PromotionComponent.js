import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LoadingComponent from "../components/LoadingComponent";
import { fetchPromotions } from "../../../store/actions/frontend/frontendPromotionActions";
import statusEnum from "../../../enums/modules/statusEnum";
import promotionTypeEnum from "../../../enums/modules/promotionTypeEnum";
import Carousel from "react-native-snap-carousel";

const PromotionComponent = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const promotions = useSelector(state => state.frontendPromotion.lists);
  const dispatch = useDispatch();
  const { width: screenWidth } = Dimensions.get("window");

  // Responsive item width calculation
  const itemWidth = screenWidth * 0.8; // 80% of screen width for mobile
  const sliderWidth = screenWidth;

  useEffect(
    () => {
      setLoading(true);
      dispatch(
        fetchPromotions({
          paginate: 0,
          order_column: "id",
          order_type: "asc",
          type: promotionTypeEnum.SMALL,
          status: statusEnum.ACTIVE,
        })
      )
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    },
    [dispatch]
  );

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("PromotionProducts", { slug: item.slug })}
        style={styles.promotionItem}
      >
        <Image
          source={{ uri: item.cover }}
          style={styles.promotionImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <LoadingComponent />;
  }

  if (promotions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Carousel
        data={promotions}
        renderItem={renderItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        onSnapToItem={index => setActiveSlide(index)}
        inactiveSlideScale={0.94}
        inactiveSlideOpacity={0.7}
        firstItem={0}
        loop={true}
        autoplay={true}
        autoplayInterval={5000}
        layout={"default"}
        layoutCardOffset={Platform.OS === "android" ? 9 : 18} // Adjust for different devices
      />
    </View>
  );
};

const styles = {
  container: {
    marginBottom: Platform.select({
      ios: 20,
      android: 16,
      default: 16,
    }),
  },
  promotionItem: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  promotionImage: {
    width: "100%",
    height: 150,
    borderRadius: 16,
  },
};

export default PromotionComponent;
