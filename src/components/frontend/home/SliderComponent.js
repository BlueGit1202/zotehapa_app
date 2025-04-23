import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  Text,
  ActivityIndicator,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { useDispatch, useSelector } from "react-redux";
import { fetchSliders } from "../../../store/actions/frontend/frontendSliderActions";

const SliderComponent = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliders = useSelector(state => state.frontendSlider.lists);
  const { width: screenWidth } = Dimensions.get("window");

  useEffect(
    () => {
      const loadSliders = async () => {
        try {
          setLoading(true);
          await dispatch(
            fetchSliders({
              paginate: 0,
              order_column: "id",
              order_type: "desc",
              status: 5,
            })
          );
        } catch (err) {
          setError("Failed to load sliders");
          console.error("Slider error:", err);
        } finally {
          setLoading(false);
        }
      };

      loadSliders();
    },
    [dispatch]
  );

  const renderItem = ({ item }) =>
    <View style={{ paddingHorizontal: 8 }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => item.link && Linking.openURL(item.link)}
      >
        <Image
          source={{ uri: item.image_url }}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 12,
            backgroundColor: "#f3f4f6", // Loading background
          }}
          resizeMode="cover"
          onError={() => console.warn("Image failed to load:", item.image_url)}
        />
        {/* Optional: Display title if exists */}
        {item.title &&
          <Text
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              textShadowColor: "rgba(0,0,0,0.5)",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 3,
            }}
          >
            {item.title}
          </Text>}
      </TouchableOpacity>
    </View>;

  if (loading) {
    return (
      <View style={{ height: 200, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#4B6FED" />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{ height: 200, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ color: "#ef4444" }}>
          {error}
        </Text>
      </View>
    );
  }

  if (!sliders || sliders.length === 0) {
    return null; // Or render a placeholder
  }

  return (
    <View style={{ marginVertical: 16 }}>
      <Carousel
        data={sliders}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={screenWidth - 32}
        loop={true}
        autoplay={true}
        autoplayInterval={3000}
        inactiveSlideOpacity={0.7}
        inactiveSlideScale={0.9}
      />
    </View>
  );
};

export default SliderComponent;
